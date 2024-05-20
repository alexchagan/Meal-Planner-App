import pytest
from datetime import date
import sys
import os

backend_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
sys.path.append(backend_dir)

from app import create_app, db
from app.models.UserSQL import UserSQL
from app.models.MealSQL import MealSQL

@pytest.fixture
def client():
    app = create_app(testing=True)
    app.config["TESTING"] = True

    with app.test_client() as client:
        with app.app_context():
            db.create_all()
        yield client

    with app.app_context():
        db.session.remove()
        db.drop_all()

def test_create_meal_for_user(client):  # sourcery skip: extract-duplicate-method
   
    with client.application.app_context():
        user = UserSQL(id="user123", name="John Doe", email="john@example.com")
        db.session.add(user)
        db.session.commit()

  
    current_date = date.today().strftime("%Y-%m-%d")

   
    meal_data = {
        "date": current_date,
        "morning": [["Oatmeal"]],
        "afternoon": [["Chicken Breast"]],
        "evening": [["Salmon"]],
    }

   
    with client.session_transaction() as session:
        session["user_id"] = "user123"

    response = client.post("/receive_data", json=meal_data)

    assert response.status_code == 200
    assert response.json == {"message": "Data received successfully"}

    with client.application.app_context():
        meals = MealSQL.query.filter_by(user_id="user123", date=current_date).all()
        assert len(meals) == 3

        morning_meal = MealSQL.query.filter_by(
            user_id="user123", date=current_date, period="morning", meal="Oatmeal"
        ).first()
        assert morning_meal is not None
        assert morning_meal.serving == 100.0

        afternoon_meal = MealSQL.query.filter_by(
            user_id="user123", date=current_date, period="afternoon", meal="Chicken Breast"
        ).first()
        assert afternoon_meal is not None
        assert afternoon_meal.serving == 100.0

        evening_meal = MealSQL.query.filter_by(
            user_id="user123", date=current_date, period="evening", meal="Salmon"
        ).first()
        assert evening_meal is not None
        assert evening_meal.serving == 100.0