from flask import Blueprint, jsonify, request, session
from sqlalchemy.sql import exists
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
from ..models.UserSQL import UserSQL
from .. import db

auth = Blueprint("auth", __name__)


@auth.route("/create_session", methods=["POST"])
def create_session():
    """
    Create a user session and insert the user into the database if they don't already exist.

    Returns:
        Response: JSON response indicating the success of the operation and user details.
    """
    try:
        data = request.json
        token = data["credential"]
        client_id = data["clientId"]
      
        idinfo = id_token.verify_oauth2_token(
            token, google_requests.Request(), client_id
        )
        print(idinfo)

        session["name"] = idinfo["name"]
        session["user_id"] = idinfo["sub"]

        user_exists = db.session.query(
            exists().where(UserSQL.id == idinfo["sub"])
        ).scalar()

        if not user_exists:
            user_row = UserSQL(
                id=idinfo["sub"],
                name=idinfo["name"],
                email=idinfo["email"],
                picture=idinfo["picture"],
                daily_cals=0.0,
                daily_prot=0.0,
                daily_carb=0.0,
                daily_fats=0.0,
            )
            db.session.add(user_row)
            db.session.commit()

        return (
            jsonify(
                {
                    "message": "User Data received successfully",
                    "user_id": idinfo["sub"],
                    "name": idinfo["name"],
                }
            ),
            200,
        )
    except ValueError:

        pass
