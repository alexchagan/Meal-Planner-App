from flask import Flask, jsonify, request
from flask_cors import CORS
import requests

app = Flask(__name__)
CORS(app)

@app.route('/api/get_nutrition/<var>', methods=['GET'])
def get_nutrition(var):

    url = "https://nutrition-by-api-ninjas.p.rapidapi.com/v1/nutrition"
    query = var
    headers = {
        "X-RapidAPI-Key": "096448c304mshd918b5bbf4f9eddp13a329jsn97df6f0ab30b",
        "X-RapidAPI-Host": "nutrition-by-api-ninjas.p.rapidapi.com"
    }

    try:
        response = requests.get(url, params={"query": query}, headers=headers)
        response.raise_for_status()  # Raise an exception for 4xx/5xx status codes
        data = response.json()
        return jsonify(data)
    except requests.exceptions.RequestException as e:
        return jsonify({"error": "Failed to fetch data from API"}), 500

@app.route('/receive_data', methods=['POST'])
def receive_data():
    print("heh")
    data = request.json
    print("Received data from frontend:", data)
    
    # Here you can process the received data as needed
    
    return jsonify({"message": "Data received successfully"}), 200


if __name__ == '__main__':
    app.run(debug=True)

