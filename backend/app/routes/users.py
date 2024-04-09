from flask import Blueprint, jsonify, request, session
from ..models.UserSQL import UserSQL
from .. import db

users = Blueprint('users', __name__)

@users.route('/get_daily_goals', methods=['POST'])
def get_daily_goals():
    try:
        data = request.json
        user_id = session.get('user_id')
        if user := UserSQL.query.filter(UserSQL.id == user_id).first():
            calories = data['calories']
            user.weekly_cals = calories * 7.0
            protein = data['protein']
            user.weekly_prot = protein * 7.0
            carbs = data['carbs']
            user.weekly_carb = carbs * 7.0
            fats = data['fats']

            user.weekly_fats = fats * 7.0
            db.session.commit()

            return jsonify({
            "message": "Daily goals were updated",
            "user_id": session.get('user_id')
             }), 200

    except ValueError:
        pass

