from flask import Blueprint, jsonify, request, session
from ..models.UserSQL import UserSQL
from .. import db
from collections import defaultdict

users = Blueprint("users", __name__)


@users.route("/get_daily_goals", methods=["POST"])
def get_daily_goals():
    """
    Endpoint to receive daily nutrition goals from the frontend and store it in the database.

    Returns:
        Response: JSON response indicating the success of the operation.
    """
    try:
        data = request.json
        user_id = session.get("user_id")
        if user := UserSQL.query.filter(UserSQL.id == user_id).first():
            calories = data["calories"]
            user.daily_cals = calories
            protein = data["protein"]
            user.daily_prot = protein
            carbs = data["carbs"]
            user.daily_carb = carbs
            fats = data["fats"]
            user.daily_fats = fats
            db.session.commit()

            return (
                jsonify(
                    {
                        "message": "Daily goals were updated",
                        "user_id": session.get("user_id"),
                    }
                ),
                200,
            )

    except ValueError:
        pass


@users.route("/send_user_info", methods=["GET"])
def send_user_info():
    """
    Endpoint to send daily nutrition goals to the frontend.

    Returns:
        Response: JSON with user object.
    """
    try:
        user_id = session.get("user_id")
        if user_query := UserSQL.query.filter(UserSQL.id == user_id).first():
            user = {
                "name": user_query.name,
                "email": user_query.email,
                "daily_cals": user_query.daily_cals,
                "daily_prot": user_query.daily_prot,
                "daily_carb": user_query.daily_carb,
                "daily_fats": user_query.daily_fats,
                "picture": user_query.picture,
            }
            return jsonify(user)
        else:
            return jsonify({"error": "User not found"}), 404
    except ValueError:
        return jsonify({"error": "Invalid request"}), 400
