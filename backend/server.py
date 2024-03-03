from flask import Flask, jsonify, request, session
from flask_session import Session
from flask_cors import CORS
import requests
import utils
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.sql import func, exists
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

class UserSQL(db.Model):
    __tablename__ = 'Users'

    id = db.Column(db.String(30), primary_key=True) 
    name = db.Column(db.String(50)) 
    email = db.Column(db.String(50)) 

class MealSQL(db.Model):
    __tablename__ = 'Meals'  

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

current_days = utils.get_dates_of_week()
print(current_days)


@app.route('/create_session', methods=['POST'])
def create_session():
    try:
        data = request.json
        token = data['credential']
        client_id = data['clientId']

        idinfo = id_token.verify_oauth2_token(token, requests.Request(), client_id)
        print(idinfo)

        session['name'] = idinfo['name']
        session['user_id'] = idinfo['sub']

        # Check if the user with the given ID already exists in the database
        user_exists = db.session.query(exists().where(UserSQL.id == idinfo['sub'])).scalar()

        # If the user doesn't exist, insert the user into the database
        if not user_exists:
            user_row = UserSQL(id=idinfo['sub'], name=idinfo['name'], email=idinfo['email'])
            db.session.add(user_row)
            db.session.commit()

        
        return jsonify({"message": "User Data received successfully", "user_id": idinfo['sub'], "name": idinfo['name']}), 200
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

@app.route('/send_weekly_meals', methods=['GET', 'POST'])
def send_weekly_meals():
    print('Hi')
    # Retrieve current days of the week
    current_days = utils.get_dates_of_week()
    print(session.get('user_id'))
    # Retrieve meals for the current user and days
    meals_query = MealSQL.query.filter(
        MealSQL.user_id == session.get('user_id'),
        MealSQL.date.in_(current_days)
    ).all()

    # Organize the retrieved data into the desired JSON format
    weekly_meals = {}
    for meal in meals_query:
        if meal.date not in weekly_meals:
            weekly_meals[meal.date] = {
                'morning': [],
                'afternoon': [],
                'evening': []
            }
        # Add meal details to the corresponding period
        period = meal.period.lower()  # assuming period is 'Morning', 'Afternoon', or 'Evening'
        weekly_meals[meal.date][period].append({
            'meal': meal.meal,
            'grams': meal.serving,
            'calories': meal.cal,
            'protein': meal.protein,
            'fat': meal.fat,
            'carbs': meal.carb
        })

    # Send the JSON response to the frontend
    print(weekly_meals)
    return jsonify(weekly_meals)

if __name__ == '__main__':
    init_app_context()
    app.run(debug=True)

