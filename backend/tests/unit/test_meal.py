import sys
import os
from unittest.mock import patch
import pytest

backend_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
sys.path.append(backend_dir)
from app.models.Meal import Meal


@pytest.fixture
def meal():
    return Meal(
        "2023-06-08", "Custom", "Morning", "Oatmeal", 50.0, 150.0, 5.0, 25.0, 3.0
    )


class TestMeal:
    def test_fix_decimals(self, meal):
        meal.serving = 50.1234
        meal.cal = 150.5678
        meal.protein = 5.9876
        meal.carb = 25.4321
        meal.fat = 3.2109
        meal.fix_decimals()
        assert meal.serving == 50.123
        assert meal.cal == 150.568
        assert meal.protein == 5.988
        assert meal.carb == 25.432
        assert meal.fat == 3.211

    def test_update_nutritional_values(self, meal):
        meal.serving = 200.0
        meal.update_nutritional_values()
        assert meal.cal == 300.0
        assert meal.protein == 10.0
        assert meal.carb == 50.0
        assert meal.fat == 6.0

    def test_nutritional_values_api_success(self, meal):
        meal.meal = "1 banana"
        meal.serving = 0
        meal.cal = 0
        meal.protein = 0
        meal.carb = 0
        meal.fat = 0
        meal.nutritional_values_api()
        assert meal.serving == 118.0
        assert meal.cal == 105.5
        assert meal.protein == 1.3
        assert meal.carb == 27.4
        assert meal.fat == 0.4
