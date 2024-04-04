from flask import Blueprint, jsonify, request, session
from ..models.UserSQL import UserSQL
from .. import db

users = Blueprint('users', __name__)

@users.route('/get_daily_goals', methods=['POST'])
def get_daily_goals():
    try:
        data = request.json
        calories = data['calories']
        protein = data['protein']
        carbs = data['carbs']
        fats = data['fats']
        
        user_id = session.get('user_id')
        user = UserSQL.query.filter(UserSQL.id == user_id).first()

        if user:
            user.weekly_cals = calories * 7.0
            user.weekly_prot = protein * 7.0
            user.weekly_carb = carbs * 7.0
            user.weekly_fats = fats * 7.0
            db.session.commit()

            return jsonify({
            "message": "Daily goals were updated",
            "user_id": session.get('user_id')
             }), 200

    except ValueError:
        pass

