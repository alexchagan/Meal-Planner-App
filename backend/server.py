from flask import Flask, jsonify, request
from flask_cors import CORS
import requests
import utils
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.sql import func
from google.oauth2 import id_token
from google.auth.transport import requests


app = Flask(__name__)
CORS(app)

app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://root:root@127.0.0.1:3306/meal_planner'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False


db = SQLAlchemy(app)

class MealSQL(db.Model):
    __tablename__ = 'Meals'  # Table name should match your existing table name

    meal_id = db.Column("id",db.Integer, primary_key=True)
    user_id = db.Column(db.Integer)  
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
        
        meal_row = MealSQL(date=meal_data.date, type=meal_data.type, period=meal_data.period,
                    meal=meal_data.meal, serving=meal_data.serving, cal=meal_data.cal,
                    protein=meal_data.protein, carb=meal_data.carb, fat=meal_data.fat)
        
        db.session.add(meal_row)
        db.session.commit()


    print(meals[1])
    
    return jsonify({"message": "Data received successfully"}), 200

@app.route('/create_session', methods=['POST'])
def create_session():
    try:
        data = request.json
        token = data['credential']
        client_id = data['clientId']

        idinfo = id_token.verify_oauth2_token(token, requests.Request(), client_id)

        userid = idinfo['sub']
        print(userid)

        return jsonify({"message": "User Data received successfully"}), 200
    except ValueError:
    # Invalid token
        pass


if __name__ == '__main__':
    init_app_context()
    app.run(debug=True)

