from flask import Blueprint, jsonify, request, session
import requests
from sqlalchemy.sql import exists
from google.oauth2 import id_token
from google.auth.transport import requests 
from ..models.UserSQL import UserSQL 
from .. import db  

auth = Blueprint('auth', __name__)  

@auth.route('/create_session', methods=['POST'])
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