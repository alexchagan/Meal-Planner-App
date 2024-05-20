import pytest
from unittest.mock import patch
import sys
import os

backend_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
sys.path.append(backend_dir)

from app import create_app, db
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

@patch("google.oauth2.id_token.verify_oauth2_token")
def test_create_session_new_user(mock_verify_token, client):
    # Mock the Google ID token verification
    mock_verify_token.return_value = {
        "sub": "user123",
        "name": "John Doe",
        "email": "john@example.com",
        "picture": "picture"
    }

    data = {"credential": "sample_token", "clientId": "sample_client_id"}

    response = client.post("/create_session", json=data)

    assert response.status_code == 200
    assert response.json == {
        "message": "User Data received successfully",
        "user_id": "user123",
        "name": "John Doe",
    }

    user = UserSQL.query.filter_by(id="user123").first()
    assert user is not None
    assert user.name == "John Doe"
    assert user.email == "john@example.com"

@patch("google.oauth2.id_token.verify_oauth2_token")
def test_create_session_existing_user(mock_verify_token, client):
    # Mock the Google ID token verification
    mock_verify_token.return_value = {
        "sub": "user123",
        "name": "John Doe",
        "email": "john@example.com",
    }

    with client.application.app_context():
        existing_user = UserSQL(id="user123", name="John Doe", email="john@example.com")
        db.session.add(existing_user)
        db.session.commit()

    data = {"credential": "sample_token", "clientId": "sample_client_id"}

    with client.application.app_context():
        response = client.post("/create_session", json=data)

        assert response.status_code == 200
        assert response.json == {
            "message": "User Data received successfully",
            "user_id": "user123",
            "name": "John Doe",
        }

        user_count = UserSQL.query.count()
        assert user_count == 1