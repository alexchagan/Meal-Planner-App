from flask import Flask, jsonify, request
from flask_cors import CORS
import requests
import utils

app = Flask(__name__)
CORS(app)

@app.route('/receive_data', methods=['POST'])
def receive_data():
    data = request.json
    print("Received data from frontend:", data)
    
    # Here you can process the received data as needed
    meals = utils.json_to_meal_objects(data)

    for meal in meals:
        if meal.type == 'custom':
            meal.update_nutritional_values()
        else:
            meal.nutritional_values_api()
            
    print(meals[1])
    
    return jsonify({"message": "Data received successfully"}), 200


if __name__ == '__main__':
    app.run(debug=True)

