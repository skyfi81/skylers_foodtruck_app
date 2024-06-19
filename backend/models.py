from pymongo import MongoClient

client = MongoClient('mongodb://localhost:27017/')
db = client.food_truck_db

class FoodTruck:
    def __init__(self, name, description, address, operating_hours, location):
        self.name = name
        self.description = description
        self.address = address
        self.operating_hours = operating_hours
        self.location = location

    def save(self):
        food_truck_data = {
            'name': self.name,
            'description': self.description,
            'address': self.address,
            'operating_hours': self.operating_hours,
            'location': self.location
        }
        db.food_trucks.insert_one(food_truck_data)

    @staticmethod
    def get_all():
        return list(db.food_trucks.find())

    @staticmethod
    def get_by_id(food_truck_id):
        return db.food_trucks.find_one({'_id': food_truck_id})

class Review:
    def __init__(self, food_truck_id, user, rating, comment):
        self.food_truck_id = food_truck_id
        self.user = user
        self.rating = rating
        self.comment = comment

    def save(self):
        review_data = {
            'food_truck_id': self.food_truck_id,
            'user': self.user,
            'rating': self.rating,
            'comment': self.comment
        }
        db.reviews.insert_one(review_data)

    @staticmethod
    def get_by_food_truck_id(food_truck_id):
        return list(db.reviews.find({'food_truck_id': food_truck_id}))
