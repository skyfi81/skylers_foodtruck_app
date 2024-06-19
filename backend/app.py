from flask import Flask, jsonify, request
from flask_cors import CORS
import requests
from pymongo import MongoClient
from bson import ObjectId

app = Flask(__name__)
CORS(app)

# Connect to MongoDB
client = MongoClient('mongodb://db:27017/')
db = client.food_truck_db
food_trucks_collection = db.food_trucks
reviews_collection = db.reviews
favorites_collection = db.favorites

# URL of the external API
API_URL = 'https://data.sfgov.org/resource/rqzj-sfat.json'

@app.route('/api/foodtrucks', methods=['GET'])
def get_food_trucks():
    try:
        # Fetch data from external API
        response = requests.get(API_URL)
        response.raise_for_status()  # Raise an error for bad status codes

        # Check if the response is empty or not valid JSON
        try:
            data = response.json()
        except requests.exceptions.JSONDecodeError:
            return jsonify({'error': 'Failed to decode JSON from the API'}), 500

        # Filter data to include only approved food trucks
        approved_trucks = [truck for truck in data if truck.get('status') == 'APPROVED']

        # Insert data into MongoDB (optional, for caching purposes)
        food_trucks_collection.delete_many({})  # Clear existing data
        food_trucks_collection.insert_many(approved_trucks)

        # Convert ObjectId to string before returning the response
        for item in approved_trucks:
            if '_id' in item:
                item['_id'] = str(item['_id'])

        return jsonify(approved_trucks)
    except requests.exceptions.RequestException as e:
        return jsonify({'error': 'Failed to fetch data from the API', 'details': str(e)}), 500

@app.route('/api/foodtrucks/<id>', methods=['GET'])
def get_food_truck_by_id(id):
    food_truck = food_trucks_collection.find_one({'objectid': id})
    if food_truck:
        food_truck['_id'] = str(food_truck['_id'])
        return jsonify(food_truck)
    else:
        return jsonify({'error': 'Food truck not found'}), 404

@app.route('/api/foodtrucks/cached', methods=['GET'])
def get_cached_food_trucks():
    food_trucks = list(food_trucks_collection.find())
    for food_truck in food_trucks:
        food_truck['_id'] = str(food_truck['_id'])
    return jsonify(food_trucks)

@app.route('/api/reviews', methods=['POST'])
def add_review():
    review = request.get_json()
    try:
        rating = int(review.get('rating'))
        if not (1 <= rating <= 5):
            return jsonify({'error': 'Rating must be between 1 and 5'}), 400
    except (ValueError, TypeError):
        return jsonify({'error': 'Rating must be an integer between 1 and 5'}), 400

    review['rating'] = rating
    result = reviews_collection.insert_one(review)
    review['_id'] = str(result.inserted_id)
    return jsonify({'message': 'Review added successfully', 'review': review}), 201

@app.route('/api/reviews/<food_truck_id>', methods=['GET'])
def get_reviews(food_truck_id):
    reviews = list(reviews_collection.find({'food_truck_id': food_truck_id}))
    for review in reviews:
        review['_id'] = str(review['_id'])
        review['food_truck_id'] = str(review['food_truck_id'])
    return jsonify(reviews)

@app.route('/api/favorites', methods=['POST'])
def add_favorite():
    favorite = request.get_json()
    favorite['food_truck_id'] = favorite['food_truck_id']
    favorites_collection.insert_one(favorite)
    return jsonify({'message': 'Favorite added successfully'}), 201

@app.route('/api/favorites/<user_id>', methods=['GET'])
def get_favorites(user_id):
    favorites = list(favorites_collection.find({'user_id': user_id}))
    favorite_truck_ids = [favorite['food_truck_id'] for favorite in favorites]
    favorite_trucks = list(food_trucks_collection.find({'objectid': {'$in': favorite_truck_ids}}))
    for favorite in favorite_trucks:
        favorite['_id'] = str(favorite['_id'])
    return jsonify(favorite_trucks)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
