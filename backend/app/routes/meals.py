from flask import Blueprint, jsonify, request, session
import utils
from ..models.MealSQL import MealSQL  
from .. import db  

meals = Blueprint('meals', __name__)  

@meals.route('/receive_data', methods=['POST'])
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

from collections import defaultdict

@meals.route('/send_weekly_meals', methods=['GET', 'POST'])
def send_weekly_meals():
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

@meals.route('/remove_meal', methods=['POST'])
def receive_weekly_meals():
    data = request.json
    date = data.get('date')
    period = data.get('period')
    meal_name = data.get('meal')
    user_id = session.get('user_id')
    
    try:
        # Perform deletion based on provided conditions
        meal_to_remove = MealSQL.query.filter_by(user_id=user_id, date=date, period=period, meal=meal_name).first()
        if meal_to_remove:
            db.session.delete(meal_to_remove)
            db.session.commit()
            return jsonify({'message': 'Meal removed successfully'}), 200
        else:
            return jsonify({'message': 'Meal not found'}), 404
    except Exception as e:
        # Handle any errors that might occur during the deletion process
        return jsonify({'message': 'Error removing meal', 'error': str(e)}), 500

    # Do something with the received JSON data
    print(data)
    return '', 204
