from flask import Flask, jsonify, request, session
from flask_session import Session
from flask_cors import CORS
import requests
import utils
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.sql import func
from google.oauth2 import id_token
from google.auth.transport import requests

app = Flask(__name__)

app.secret_key = "default"

app.config["SESSION_COOKIE_SAMESITE"] = "None"
app.config["SESSION_COOKIE_SECURE"] = True

CORS(app, supports_credentials=True)

app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://root:root@127.0.0.1:3306/meal_planner'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

class MealSQL(db.Model):
    __tablename__ = 'Meals'  # Table name in mySQL

    meal_id = db.Column("id",db.Integer, primary_key=True)
    user_id = db.Column(db.String(30))  
    date = db.Column(db.String(10))  
    type = db.Column(db.String(10))  
    period = db.Column(db.String(10))  
    meal = db.Column(db.String(50))  
    serving = db.Column(db.Float)  
    cal = db.Column(db.Float)  
    protein = db.Column(db.Float) 
    carb = db.Column(db.Float)  
    fat = db.Column(db.Float)  

def init_app_context():
    with app.app_context():
        db.create_all()

@app.route('/create_session', methods=['POST'])
def create_session():
    try:
        data = request.json
        token = data['credential']
        client_id = data['clientId']

        idinfo = id_token.verify_oauth2_token(token, requests.Request(), client_id)

        session['user_id'] = idinfo['sub']
        
        return jsonify({"message": "User Data received successfully", "user_id": idinfo['sub']}), 200
    except ValueError:
    # Invalid token
        pass

@app.route('/receive_data', methods=['POST'])
def receive_data():
    data = request.json
    print("Received data from frontend:", data)
    
    # Here you can process the received data as needed
    meals = utils.json_to_meal_objects(data)

    for meal_data in meals:
        if meal_data.type == 'custom':
            meal_data.update_nutritional_values()
        else:
            meal_data.nutritional_values_api()
        
        meal_row = MealSQL(user_id=session.get('user_id'), date=meal_data.date, type=meal_data.type, period=meal_data.period,
                    meal=meal_data.meal, serving=meal_data.serving, cal=meal_data.cal,
                    protein=meal_data.protein, carb=meal_data.carb, fat=meal_data.fat)
        
        db.session.add(meal_row)
        db.session.commit()
  
    return jsonify({"message": "Data received successfully"}), 200

if __name__ == '__main__':
    init_app_context()
    app.run(debug=True)

