# models.py
from bson.objectid import ObjectId

class User:
    def __init__(self, email, password, _id=None):
        self.email = email
        self.password = password
        self._id = _id

    def save(self):
        ### PERBAIKAN: Mencegah circular import
        from app import db 
        user_data = {
            "email": self.email,
            "password": self.password
        }
        result = db.users.insert_one(user_data)
        self._id = result.inserted_id
        return self._id

    @staticmethod
    def find_by_email(email):
        ### PERBAIKAN: Mencegah circular import
        from app import db
        return db.users.find_one({"email": email})

    @staticmethod
    def find_by_id(user_id):
        ### PERBAIKAN: Mencegah circular import
        from app import db
        return db.users.find_one({"_id": ObjectId(user_id)})


class ParkingArea:
    def __init__(self, user_id, name, camera_source, spots=None, _id=None):
        self.user_id = user_id
        self.name = name
        self.camera_source = camera_source
        self.spots = spots if spots is not None else []
        self._id = _id
    
    def save(self):
        ### PERBAIKAN: Mencegah circular import
        from app import db
        area_data = {
            "user_id": ObjectId(self.user_id),
            "name": self.name,
            "camera_source": self.camera_source,
            "spots": self.spots
        }
        result = db.parking_areas.insert_one(area_data)
        self._id = result.inserted_id
        return self._id
    
    @staticmethod
    def find_by_user_id(user_id):
        ### PERBAIKAN: Mencegah circular import
        from app import db
        return list(db.parking_areas.find({"user_id": ObjectId(user_id)}))

    @staticmethod
    def update_spots(area_id, user_id, new_spots):
        ### PERBAIKAN: Mencegah circular import
        from app import db
        result = db.parking_areas.update_one(
            {"_id": ObjectId(area_id), "user_id": ObjectId(user_id)},
            {"$set": {"spots": new_spots}}
        )
        return result.modified_count
    
    @staticmethod
    def find_by_id(area_id):
        ### PERBAIKAN: Mencegah circular import
        from app import db
        try:
            return db.parking_areas.find_one({"_id": ObjectId(area_id)})
        except:
            return None
        
    @staticmethod
    def delete_by_id(area_id, user_id):
        ### PERBAIKAN: Mencegah circular import
        from app import db
        # Pastikan user hanya bisa menghapus areanya sendiri
        result = db.parking_areas.delete_one(
            {"_id": ObjectId(area_id), "user_id": ObjectId(user_id)}
        )
        return result.deleted_count