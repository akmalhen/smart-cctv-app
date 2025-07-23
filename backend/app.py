# app.py

import os
import certifi
import cv2
import threading
import numpy as np
from collections import defaultdict

# Gabungkan semua import dari flask di satu tempat
from flask import Flask, jsonify, request, Response, send_from_directory, redirect, url_for
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity, JWTManager
from flask_bcrypt import Bcrypt
from flask_socketio import SocketIO, join_room, leave_room
from pymongo import MongoClient
from bson.objectid import ObjectId
from dotenv import load_dotenv

# Import model langsung
from models import User, ParkingArea

# --- KONFIGURASI & SETUP ---
load_dotenv()

app = Flask(__name__)
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY')
app.config["JWT_TOKEN_LOCATION"] = ["headers", "query_string"]
app.config["JWT_QUERY_STRING_NAME"] = "token"

# Konfigurasi Aplikasi
DENSITY_THRESHOLD_PERCENT = 15.0

# Setup ekstensi
socketio = SocketIO(app, cors_allowed_origins="*")
bcrypt = Bcrypt(app)
jwt = JWTManager(app)

# Setup Koneksi Database
try:
    client = MongoClient(os.getenv("MONGO_URI"), tlsCAFile=certifi.where())
    db = client['parking_app_db']
    db.command('ping')
    print("✅ Ping ke MongoDB Atlas berhasil!")
except Exception as e:
    print(f"❌ Gagal terhubung ke MongoDB: {e}")
    exit()

# --- VARIABEL GLOBAL UNTUK MANAJEMEN ---
video_captures = {}
detection_threads = {}
stop_detection_flags = {}
room_clients = defaultdict(int)
client_sids = {}

# --- FUNGSI HELPER ---
def get_video_capture(camera_source):
    try:
        source = int(camera_source)
    except (ValueError, TypeError):
        source = camera_source
    return cv2.VideoCapture(source)

# =====================================================================
# BAGIAN 1: STREAMING VIDEO MENTAH
# (Tidak ada perubahan di bagian ini)
# =====================================================================
def video_generator_for_marking(area_id):
    # ... kode sama ...
    area = ParkingArea.find_by_id(area_id)
    if not area: return
    cap = get_video_capture(area['camera_source'])
    video_captures[area_id] = cap
    if not cap.isOpened(): return
    print(f"MARKING: Memulai streaming untuk area {area_id}")
    while area_id in video_captures:
        success, frame = cap.read()
        if not success: break
        frame = cv2.flip(frame, 1)
        ret, buffer = cv2.imencode('.jpg', frame)
        if not ret: continue
        yield (b'--frame\r\n' b'Content-Type: image/jpeg\r\n\r\n' + buffer.tobytes() + b'\r\n\r\n')
    print(f"MARKING: Stream untuk area {area_id} berhenti.")
    if cap.isOpened(): cap.release()

@app.route('/video_feed/<area_id>')
@jwt_required()
def video_feed(area_id):
    # ... kode sama ...
    current_user_id = get_jwt_identity()
    area = ParkingArea.find_by_id(area_id)
    if not area or str(area['user_id']) != current_user_id: return "Akses ditolak", 403
    return Response(video_generator_for_marking(area_id), mimetype='multipart/x-mixed-replace; boundary=frame')

@app.route('/stop_video_feed/<area_id>', methods=['POST'])
@jwt_required()
def stop_video_feed(area_id):
    # ... kode sama ...
    current_user_id = get_jwt_identity()
    area = ParkingArea.find_by_id(area_id)
    if not area or str(area['user_id']) != current_user_id: return jsonify({"msg": "Akses ditolak"}), 403
    if area_id in video_captures:
        del video_captures[area_id]
        return jsonify({"msg": "Stream dihentikan."}), 200
    return jsonify({"msg": "Stream tidak aktif."}), 404

# =====================================================================
# BAGIAN 2: DETEKSI REAL-TIME DENGAN SOCKET.IO
# =====================================================================
def run_detection_for_area(area_id):
    area_data = ParkingArea.find_by_id(area_id)
    if not area_data:
        print(f"DETECTION: Dibatalkan, area {area_id} tidak ditemukan.")
        return

    cap = get_video_capture(area_data['camera_source'])
    if not cap.isOpened():
        print(f"DETECTION: Gagal membuka kamera untuk {area_data['camera_source']}")
        socketio.emit('update_status', {'error': 'Gagal membuka kamera!'}, room=area_id)
        return
        
    print(f"DETECTION: Memulai thread deteksi untuk area {area_id}...")
    posList = area_data.get('spots', [])

    while not stop_detection_flags.get(area_id):
        success, img = cap.read()
        if not success: break
        img = cv2.flip(img, 1)

        if not posList:
            # Mode tanpa spot
            text = "Belum ada spot parkir. Tandai dulu!"
            (text_width, text_height), _ = cv2.getTextSize(text, cv2.FONT_HERSHEY_SIMPLEX, 0.8, 2)
            text_x = (img.shape[1] - text_width) // 2
            text_y = (img.shape[0] + text_height) // 2
            cv2.putText(img, text, (text_x, text_y), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 255, 255), 2)
            socketio.emit('update_status', {'error': 'Belum ada spot parkir yang ditandai.'}, room=area_id)
        else:
            # Mode deteksi normal
            imgGray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

            ### === PERBAIKAN UTAMA DI SINI === ###
            # Mengurangi agresivitas thresholding agar lebih sensitif di dalam ruangan.
            # Nilai 'C' (parameter ke-4) dikurangi dari 16 menjadi 5.
            # Anda bisa bereksperimen dengan nilai ini (misal: 2, 5, 8) untuk mendapatkan hasil terbaik.
            imgBlur = cv2.GaussianBlur(imgGray, (3, 3), 1)
            imgThreshold = cv2.adaptiveThreshold(imgBlur, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY_INV, 21, 5) # blockSize=21, C=5
            ### ================================= ###

            imgMedian = cv2.medianBlur(imgThreshold, 5)
            kernel = np.ones((3, 3), np.uint8)
            imgDilate = cv2.dilate(imgMedian, kernel, iterations=1)
            
            debug_frame_to_send = cv2.cvtColor(imgDilate, cv2.COLOR_GRAY2BGR)

            spaceCounter = 0
            statusList = []
            
            for i, spot_coords in enumerate(posList):
                points = np.array(spot_coords, dtype=np.int32)
                total_spot_area = cv2.contourArea(points)
                if total_spot_area < 10: continue

                mask = np.zeros_like(imgDilate)
                cv2.fillPoly(mask, [points.reshape(-1, 1, 2)], 255)
                imgCrop = cv2.bitwise_and(imgDilate, imgDilate, mask=mask)
                white_pixel_count = cv2.countNonZero(imgCrop)
                density = (white_pixel_count / total_spot_area) * 100 if total_spot_area > 0 else 0

                if density < DENSITY_THRESHOLD_PERCENT:
                    status, color = 'Kosong', (0, 255, 0)
                    spaceCounter += 1
                else:
                    status, color = 'Terisi', (0, 0, 255)
                
                statusList.append(status)
                cv2.polylines(img, [points.reshape(-1, 1, 2)], True, color, 2)
                text_pos = (points[0][0], points[0][1] - 5)
                cv2.putText(img, f"{status}", text_pos, cv2.FONT_HERSHEY_SIMPLEX, 0.5, color, 1)

            h, w, _ = img.shape
            debug_frame_resized = cv2.resize(debug_frame_to_send, (w // 4, h // 4))
            h_debug, w_debug, _ = debug_frame_resized.shape
            img[10:h_debug+10, w-w_debug-10:w-10] = debug_frame_resized
            
            socketio.emit('update_status', {'spaces': statusList, 'empty': spaceCounter}, room=area_id)

        ret, buffer = cv2.imencode('.jpg', img)
        if ret:
            socketio.emit('update_frame', buffer.tobytes(), room=area_id)
        
        socketio.sleep(0.1)

    cap.release()
    print(f"\nDETECTION: Thread untuk area {area_id} dihentikan.")
    if area_id in detection_threads: del detection_threads[area_id]
    if area_id in stop_detection_flags: del stop_detection_flags[area_id]

# =====================================================================
# BAGIAN 3 & 4: SOCKET.IO EVENTS & ROUTES API + HTML
# (Tidak ada perubahan di bagian ini, semua sama seperti sebelumnya)
# =====================================================================
@socketio.on('connect')
def handle_connect():
    print(f"SOCKET: Klien terhubung, SID: {request.sid}")

@socketio.on('join_detection_room')
# ... (kode sama)
def handle_join_room(data):
    area_id = data.get('area_id')
    if not area_id: return
    join_room(area_id)
    client_sids[request.sid] = area_id
    room_clients[area_id] += 1
    print(f"SOCKET: Klien {request.sid} bergabung ke room {area_id}. Total klien di room: {room_clients[area_id]}")
    if room_clients[area_id] == 1 and (area_id not in detection_threads or not detection_threads[area_id].is_alive()):
        print(f"DETECTION: Klien pertama masuk, memulai thread untuk {area_id}")
        stop_detection_flags[area_id] = False
        thread = threading.Thread(target=run_detection_for_area, args=(area_id,))
        detection_threads[area_id] = thread
        thread.start()

@socketio.on('leave_detection_room')
# ... (kode sama)
def handle_leave_room(data):
    area_id = data.get('area_id')
    if not area_id: return
    leave_room(area_id)
    if room_clients[area_id] > 0:
        room_clients[area_id] -= 1
    print(f"SOCKET: Klien meninggalkan room {area_id}. Sisa klien di room: {room_clients[area_id]}")
    if room_clients[area_id] == 0:
        print(f"DETECTION: Klien terakhir keluar, menghentikan thread untuk {area_id}")
        stop_detection_flags[area_id] = True

@socketio.on('disconnect')
# ... (kode sama)
def handle_disconnect():
    print(f"SOCKET: Klien {request.sid} terputus")
    area_id = client_sids.pop(request.sid, None)
    if area_id:
        handle_leave_room({'area_id': area_id})

# --- ROUTES ---
@app.route('/api/auth/register', methods=['POST'])
# ... (kode sama)
def register():
    data = request.get_json()
    email, password = data.get('email'), data.get('password')
    if not email or not password: return jsonify({"msg": "Email dan password dibutuhkan"}), 400
    if User.find_by_email(email): return jsonify({"msg": "Email sudah terdaftar"}), 400
    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
    user = User(email, hashed_password)
    user.save()
    return jsonify({"msg": "User berhasil dibuat"}), 201

@app.route('/api/auth/login', methods=['POST'])
# ... (kode sama)
def login():
    data = request.get_json()
    email, password = data.get('email'), data.get('password')
    user = User.find_by_email(email)
    if user and bcrypt.check_password_hash(user['password'], password):
        access_token = create_access_token(identity=str(user['_id']))
        return jsonify(access_token=access_token), 200
    return jsonify({"msg": "Email atau password salah"}), 401

@app.route('/api/parking-areas', methods=['POST'])
@jwt_required()
# ... (kode sama)
def add_parking_area():
    current_user_id = get_jwt_identity()
    data = request.get_json()
    if not data.get('name') or not data.get('camera_source'): return jsonify({"msg": "Nama area dan sumber kamera dibutuhkan"}), 400
    new_area = ParkingArea(user_id=current_user_id, name=data.get('name'), camera_source=data.get('camera_source'), spots=[])
    new_area.save()
    return jsonify({"msg": "Area parkir berhasil dibuat", "area_id": str(new_area._id)}), 201

@app.route('/api/parking-areas', methods=['GET'])
@jwt_required()
# ... (kode sama)
def get_user_parking_areas():
    current_user_id = get_jwt_identity()
    areas = ParkingArea.find_by_user_id(current_user_id)
    result = []
    for area in areas:
        area['_id'] = str(area['_id'])
        area['user_id'] = str(area['user_id'])
        result.append(area)
    return jsonify(result), 200

@app.route('/api/parking-areas/<area_id>/spots', methods=['PUT'])
@jwt_required()
# ... (kode sama)
def update_parking_spots(area_id):
    current_user_id = get_jwt_identity()
    data = request.get_json()
    new_spots = data.get('spots')
    if new_spots is None or not isinstance(new_spots, list): return jsonify({"msg": "Data 'spots' dibutuhkan dan harus berupa list"}), 400
    updated_count = ParkingArea.update_spots(area_id, current_user_id, new_spots)
    if updated_count == 0: return jsonify({"msg": "Area tidak ditemukan atau Anda tidak punya akses"}), 404
    return jsonify({"msg": f"Spot untuk area {area_id} berhasil diupdate"}), 200

@app.route('/api/parking-areas/<area_id>', methods=['DELETE'])
@jwt_required()
# ... (kode sama)
def delete_parking_area(area_id):
    current_user_id = get_jwt_identity()
    deleted_count = ParkingArea.delete_by_id(area_id, current_user_id)
    if deleted_count == 0: return jsonify({"msg": "Area tidak ditemukan atau Anda tidak punya akses"}), 404
    if area_id in video_captures: del video_captures[area_id]
    if area_id in detection_threads: stop_detection_flags[area_id] = True
    return jsonify({"msg": "Area parkir berhasil dihapus"}), 200

# Routes HTML
@app.route('/')
# ... (kode sama)
def home(): return redirect(url_for('login_page'))
@app.route('/login')
# ... (kode sama)
def login_page(): return send_from_directory('static', 'login.html')
@app.route('/register')
# ... (kode sama)
def register_page(): return send_from_directory('static', 'register.html')
@app.route('/dashboard')
# ... (kode sama)
def dashboard_page(): return send_from_directory('static', 'dashboard.html')
@app.route('/area/<area_id>')
# ... (kode sama)
def area_detail_page(area_id): return send_from_directory('static', 'area_detail.html')
@app.route('/detection/<area_id>')
@jwt_required()
# ... (kode sama)
def detection_page(area_id):
    current_user_id = get_jwt_identity()
    area = ParkingArea.find_by_id(area_id)
    if not area or str(area['user_id']) != current_user_id: return "Akses ditolak", 403
    return send_from_directory('static', 'detection.html')

# Jalankan aplikasi
if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port=5001, debug=True)