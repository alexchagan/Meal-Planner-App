from datetime import date
from flask_testing import TestCase

import sys
import os

backend_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
sys.path.append(backend_dir)

from app import create_app, db
from app.models.MealSQL import MealSQL


class TestMealsRoutes(TestCase):
    def create_app(self):
        app = create_app(testing=True)
        app.config["TESTING"] = True
        return app

    def setUp(self):
        db.create_all()

    def tearDown(self):
        db.session.remove()
        db.drop_all()

    def test_receive_data(self):
        # Prepare test data
        today = date.today().strftime("%Y-%m-%d")
        data = {
            "date": today,
            "morning": [["Oatmeal", "common", "100", "0", "0", "0", "0"]],
            "afternoon": [["Chicken Breast", "common", "150", "0", "0", "0", "0"]],
            "evening": [["Salmon", "common", "200", "0", "0", "0", "0"]],
        }

        # Send POST request to the endpoint
        response = self.client.post("/receive_data", json=data)

        # Assert the response
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json, {"message": "Data received successfully"})

        # Assert that the data is stored in the database
        meals = MealSQL.query.all()
        self.assertEqual(len(meals), 3)

    def test_send_weekly_meals(self):
        # Prepare test data
        today = date.today().strftime("%Y-%m-%d")
        meal1 = MealSQL(
            user_id=1,
            date=today,
            type="common",
            period="morning",
            meal="Oatmeal",
            serving=100,
            cal=300,
            protein=10,
            carb=50,
            fat=5,
        )
        meal2 = MealSQL(
            user_id=1,
            date=today,
            type="common",
            period="afternoon",
            meal="Chicken Breast",
            serving=150,
            cal=400,
            protein=30,
            carb=10,
            fat=10,
        )
        meal3 = MealSQL(
            user_id=1,
            date=today,
            type="common",
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

        # Set session user_id
        with self.client.session_transaction() as session:
            session["user_id"] = 1

        # Send GET request to the endpoint
        response = self.client.get("/send_weekly_meals")

        # Assert the response
        self.assertEqual(response.status_code, 200)
        data = response.json
        self.assertIn(today, data)
        self.assertEqual(len(data[today]["morning"]), 1)
        self.assertEqual(len(data[today]["afternoon"]), 1)
        self.assertEqual(len(data[today]["evening"]), 1)
        self.assertEqual(data[today]["total"]["calories"], 1200)
        self.assertEqual(data[today]["total"]["protein"], 80)
        self.assertEqual(data[today]["total"]["fat"], 35)
        self.assertEqual(data[today]["total"]["carbs"], 65)

    def test_remove_meal(self):
        # Prepare test data
        today = date.today().strftime("%Y-%m-%d")
        meal = MealSQL(
            user_id=1,
            date=today,
            type="common",
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

        # Set session user_id
        with self.client.session_transaction() as session:
            session["user_id"] = 1

        # Send POST request to the endpoint
        data = {"date": today, "period": "morning", "meal": "Oatmeal"}
        response = self.client.post("/remove_meal", json=data)

        # Assert the response
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json, {"message": "Meal removed successfully"})

        # Assert that the meal is removed from the database
        meal = MealSQL.query.filter_by(
            user_id=1, date=today, period="morning", meal="Oatmeal"
        ).first()
        self.assertIsNone(meal)
