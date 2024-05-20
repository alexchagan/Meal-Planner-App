from datetime import date
import pytest
import sys
import os

backend_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
sys.path.append(backend_dir)

from app import create_app, db
from app.models.MealSQL import MealSQL
from app.models.UserSQL import UserSQL

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

@pytest.fixture
def user(client):
    with client.application.app_context():
        user = UserSQL(
            id=1,
            name='bob',
            email='bob@test.com'
        )
        db.session.add(user)
        db.session.commit()
        yield user
        db.session.delete(user)
        db.session.commit()

def test_receive_data(client):
  
    today = date.today().strftime("%Y-%m-%d")
    data = {
        "date": today,
        "morning": [["Oatmeal"]],
        "afternoon": [["Chicken Breast"]],
        "evening": [["Salmon"]],
    }

    response = client.post("/receive_data", json=data)

    assert response.status_code == 200
    assert response.json == {"message": "Data received successfully"}

    meals = MealSQL.query.all()
    assert len(meals) == 3

def test_send_weekly_meals(client, user):
    today = date.today().strftime("%Y-%m-%d")
    meal1 = MealSQL(
        user_id=user.id,
        date=today,
        period="morning",
        meal="Oatmeal",
        serving=100,
        cal=300,
        protein=10,
        carb=50,
        fat=5,
    )
    meal2 = MealSQL(
        user_id=user.id,
        date=today,
        period="afternoon",
        meal="Chicken Breast",
        serving=150,
        cal=400,
        protein=30,
        carb=10,
        fat=10,
    )
    meal3 = MealSQL(
        user_id=user.id,
        date=today,
        period="evening",
        meal="Salmon",
        serving=200,
        cal=500,
        protein=40,
        carb=5,
        fat=20,
    )
    db.session.add_all([meal1, meal2, meal3])
    db.session.commit()

    with client.session_transaction() as session:
        session["user_id"] = user.id

    response = client.get("/send_weekly_meals")

    assert response.status_code == 200
    data = response.json
    assert today in data
    assert len(data[today]["morning"]) == 1
    assert len(data[today]["afternoon"]) == 1
    assert len(data[today]["evening"]) == 1
    assert data[today]["total"]["calories"] == 1200
    assert data[today]["total"]["protein"] == 80
    assert data[today]["total"]["fat"] == 35
    assert data[today]["total"]["carbs"] == 65

def test_remove_meal(client, user):
    today = date.today().strftime("%Y-%m-%d")
    meal = MealSQL(
        user_id=user.id,
        date=today,
        period="morning",
        meal="Oatmeal",
        serving=100,
        cal=300,
        protein=10,
        carb=50,
        fat=5,
    )
    db.session.add(meal)
    db.session.commit()

    with client.session_transaction() as session:
        session["user_id"] = user.id

    data = {"date": today, "period": "morning", "meal": "Oatmeal"}
    response = client.post("/remove_meal", json=data)

    assert response.status_code == 200
    assert response.json == {"message": "Meal removed successfully"}

    meal = MealSQL.query.filter_by(
        user_id=user.id, date=today, period="morning", meal="Oatmeal"
    ).first()
    assert meal is None