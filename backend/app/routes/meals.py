from flask import Blueprint, jsonify, request, session
import app.utils as utils
from ..models.MealSQL import MealSQL  
from .. import db  
from collections import defaultdict

meals = Blueprint('meals', __name__)  

from flask import jsonify, request

@meals.route('/receive_data', methods=['POST'])
def receive_data():
    """
    Endpoint to receive meal data from the frontend and store it in the database.

    Returns:
        Response: JSON response indicating the success of the operation.
    """
    data = request.json
    print("Received data from frontend:", data)
    meal_objects = utils.json_to_meal_objects(data)

    for meal in meal_objects:
        
        meal.nutritional_values_api()

        if meal.get_serving_amount() == 0:        
            error_message = f"{meal.get_meal_description()} is not supported. Please check spelling or add a custom meal instead"
            return jsonify({"error": error_message}), 400
        
        meal_row = meal.convert_to_sql_object(id=session.get('user_id'))
        
        db.session.add(meal_row)
    db.session.commit()
  
    return jsonify({"message": "Data received successfully"}), 200

@meals.route('/send_weekly_meals', methods=['GET', 'POST'])
def send_weekly_meals():
    """
    Endpoint to retrieve and send weekly meals data to the frontend.

    Returns:
        Response: JSON response containing weekly meals data.
    """
    # Retrieve current days of the week
    current_days = utils.get_dates_of_week()
    user_id = session.get('user_id')

    # Retrieve meals for the current user and days
    meals_query = MealSQL.query.filter(
        MealSQL.user_id == user_id,
        MealSQL.date.in_(current_days)
    ).all()

    # Organize the retrieved data into the desired JSON format
    weekly_meals = defaultdict(lambda: {'morning': [], 'afternoon': [], 'evening': []})

    for meal in meals_query:
        period = meal.period.lower()
        weekly_meals[meal.date][period].append({
            'meal': meal.meal,
            'grams': meal.serving,
            'calories': meal.cal,
            'protein': meal.protein,
            'fat': meal.fat,
            'carbs': meal.carb
        })

    # Calculate total calories, protein, carbs, and fat for each date
    for date, meals in weekly_meals.items():
        total_calories = round(sum(meal['calories'] for meal in meals['morning'] + meals['afternoon'] + meals['evening']), 2)
        total_protein = round(sum(meal['protein'] for meal in meals['morning'] + meals['afternoon'] + meals['evening']), 2)
        total_fat = round(sum(meal['fat'] for meal in meals['morning'] + meals['afternoon'] + meals['evening']), 2)
        total_carbs = round(sum(meal['carbs'] for meal in meals['morning'] + meals['afternoon'] + meals['evening']), 2)

        weekly_meals[date]['total'] = {
            'calories': total_calories,
            'protein': total_protein,
            'fat': total_fat,
            'carbs': total_carbs
        }

    

    # Send the JSON response to the frontend
    print(weekly_meals)
    return jsonify(weekly_meals)

@meals.route('/send_daily_meals', methods=['GET', 'POST'])
def send_daily_meals():
    """
    Endpoint to retrieve and send weekly meals data to the frontend.

    Returns:
        Response: JSON response containing weekly meals data.
    """
    # Retrieve current days of the week
    data = request.json
    current_date = utils.convert_date_simple(data['date'])
    user_id = session.get('user_id')

    # Retrieve meals for the current user and days
    meals_query = MealSQL.query.filter(
        MealSQL.user_id == user_id,
        MealSQL.date == current_date
    ).all()

    # Organize the retrieved data into the desired JSON format
    daily_meals = defaultdict(lambda: {'morning': [], 'afternoon': [], 'evening': []})

    for meal in meals_query:
        period = meal.period.lower()
        daily_meals[meal.date][period].append({
            'meal': meal.meal
        })

    # Send the JSON response to the frontend
    print(daily_meals)
    return jsonify(daily_meals)

@meals.route('/remove_meal', methods=['POST'])
def receive_weekly_meals():
    """
    Endpoint to receive requests for removing meals from the database.

    Returns:
        Response: JSON response indicating the success of the operation.
    """
    data = request.json
    date = data.get('date')
    period = data.get('period')
    meal_name = data.get('meal')
    user_id = session.get('user_id')

    try:
        if meal_to_remove := MealSQL.query.filter_by(
            user_id=user_id, date=date, period=period, meal=meal_name
        ).first():
            db.session.delete(meal_to_remove)
            db.session.commit()
            return jsonify({'message': 'Meal removed successfully'}), 200
        else:
            return jsonify({'message': 'Meal not found'}), 404
    except Exception as e:
        # Handle any errors that might occur during the deletion process
        return jsonify({'message': 'Error removing meal', 'error': str(e)}), 500
    
