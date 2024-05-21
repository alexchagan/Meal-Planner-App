from flask import Flask
from flask_cors import CORS
from .database import db
from .routes.meals import meals as meals_blueprint
from .routes.auth import auth as auth_blueprint
from .routes.users import users as users_blueprint


def create_app(testing=False):
    app = Flask(__name__)

    app.secret_key = "default"

    app.config["SESSION_COOKIE_SAMESITE"] = "None"
    app.config["SESSION_COOKIE_SECURE"] = True
    if not testing:
        # app.config["SQLALCHEMY_DATABASE_URI"] = (
        #     "mysql://root:root@127.0.0.1:3306/meal_planner"
        # )
        app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://root:root@db:3306/meal_planner'
    else:
        app.config["SQLALCHEMY_DATABASE_URI"] = (
            "mysql://root:root@127.0.0.1:3306/meal_planner_test"
        )
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    CORS(app, supports_credentials=True)

    db.init_app(app)

    with app.app_context():
        db.create_all()

    app.register_blueprint(meals_blueprint)
    app.register_blueprint(auth_blueprint)
    app.register_blueprint(users_blueprint)

    return app
