from flask_testing import TestCase
from unittest.mock import patch

import sys
import os

backend_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
sys.path.append(backend_dir)
from app import create_app, db
from app.models.UserSQL import UserSQL


class TestAuthRoutes(TestCase):
    def create_app(self):
        app = create_app(testing=True)
        app.config["TESTING"] = True
        return app

    def setUp(self):
        db.create_all()

    def tearDown(self):
        db.session.remove()
        db.drop_all()

    @patch("google.oauth2.id_token.verify_oauth2_token")
    def test_create_session_new_user(self, mock_verify_token):
        # Mock the Google ID token verification
        mock_verify_token.return_value = {
            "sub": "user123",
            "name": "John Doe",
            "email": "john@example.com",
            "picture": "picture"
        }

        # Prepare test data
        data = {"credential": "sample_token", "clientId": "sample_client_id"}

        # Send POST request to the endpoint
        response = self.client.post("/create_session", json=data)

        # Assert the response
        self.assertEqual(response.status_code, 200)
        self.assertEqual(
            response.json,
            {
                "message": "User Data received successfully",
                "user_id": "user123",
                "name": "John Doe",
            },
        )

        # Assert that the user is inserted into the database
        user = UserSQL.query.filter_by(id="user123").first()
        self.assertIsNotNone(user)
        self.assertEqual(user.name, "John Doe")
        self.assertEqual(user.email, "john@example.com")

    @patch("google.oauth2.id_token.verify_oauth2_token")
    def test_create_session_existing_user(self, mock_verify_token):
        # Mock the Google ID token verification
        mock_verify_token.return_value = {
            "sub": "user123",
            "name": "John Doe",
            "email": "john@example.com",
        }

        # Create an existing user in the database
        existing_user = UserSQL(id="user123", name="John Doe", email="john@example.com")
        db.session.add(existing_user)
        db.session.commit()

        # Prepare test data
        data = {"credential": "sample_token", "clientId": "sample_client_id"}

        # Send POST request to the endpoint
        response = self.client.post("/create_session", json=data)

        # Assert the response
        self.assertEqual(response.status_code, 200)
        self.assertEqual(
            response.json,
            {
                "message": "User Data received successfully",
                "user_id": "user123",
                "name": "John Doe",
            },
        )

        # Assert that no new user is inserted into the database
        user_count = UserSQL.query.count()
        self.assertEqual(user_count, 1)
