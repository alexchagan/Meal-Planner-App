import unittest
from flask_testing import TestCase
from datetime import date

import sys
import os

backend_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
sys.path.append(backend_dir)
from app import create_app, db

from app.models.UserSQL import UserSQL
from app.models.MealSQL import MealSQL


class TestMealRoutes(TestCase):
    def create_app(self):
        app = create_app()
        app.config["TESTING"] = True
        return app

    def setUp(self):
        db.create_all()

    def tearDown(self):
        db.session.remove()
        db.drop_all()

    def test_create_meal_for_user(self):
        # Create a user
        user = UserSQL(id="user123", name="John Doe", email="john@example.com")
        db.session.add(user)
        db.session.commit()

        # Get the current date
        current_date = date.today().strftime("%Y-%m-%d")

        # Prepare meal data
        meal_data = {
            "date": current_date,
            "morning": [["Oatmeal", "common", "0", "0", "0", "0", "0"]],
            "afternoon": [["Chicken Breast", "custom", "150", "0", "0", "0", "0"]],
            "evening": [["Salmon", "common", "0", "0", "0", "0", "0"]],
        }

        # Set the user's session
        with self.client.session_transaction() as session:
            session["user_id"] = "user123"

        # Send POST request to add meals for the user
        response = self.client.post("/receive_data", json=meal_data)

        # Assert the response
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json, {"message": "Data received successfully"})

        # Assert that the meals are stored in the database with the user's ID
        meals = MealSQL.query.filter_by(user_id="user123", date=current_date).all()
        self.assertEqual(len(meals), 3)

        # Assert the specific meal details
        morning_meal = MealSQL.query.filter_by(
            user_id="user123", date=current_date, period="morning", meal="Oatmeal"
        ).first()
        self.assertIsNotNone(morning_meal)
        self.assertEqual(morning_meal.serving, 100)

        afternoon_meal = MealSQL.query.filter_by(
            user_id="user123",
            date=current_date,
            period="afternoon",
            meal="Chicken Breast",
        ).first()
        self.assertIsNotNone(afternoon_meal)
        self.assertEqual(afternoon_meal.serving, 150)

        evening_meal = MealSQL.query.filter_by(
            user_id="user123", date=current_date, period="evening", meal="Salmon"
        ).first()
        self.assertIsNotNone(evening_meal)
        self.assertEqual(evening_meal.serving, 100)
