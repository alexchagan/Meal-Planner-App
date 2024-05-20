import sys
import os
import pytest

backend_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
sys.path.append(backend_dir)
from app.models.Meal import Meal


@pytest.fixture
def meal():
    return Meal(
        "2023-06-08", "Morning", "Oatmeal", 50.0, 150.0, 5.0, 25.0, 3.0
    )

class TestMeal:
    def test_fix_decimals(self, meal):
        meal._serving = 50.1234
        meal._cal = 150.5678
        meal._protein = 5.9876
        meal._carb = 25.4321
        meal._fat = 3.2109
        meal.fix_decimals()
        assert meal._serving == 50.123
        assert meal._cal == 150.568
        assert meal._protein == 5.988
        assert meal._carb == 25.432
        assert meal._fat == 3.211

    def test_update_nutritional_values(self, meal):
        meal._serving = 200.0
        meal.update_nutritional_values()
        assert meal._cal == 300.0
        assert meal._protein == 10.0
        assert meal._carb == 50.0
        assert meal._fat == 6.0

    def test_nutritional_values_api_success(self, meal):
        meal._meal = "1 banana"
        meal._serving = 0
        meal._cal = 0
        meal._protein = 0
        meal._carb = 0
        meal._fat = 0
        meal.nutritional_values_api()
        assert meal._serving == 118.0
        assert meal._cal == 105.5
        assert meal._protein == 1.3
        assert meal._carb == 27.4
        assert meal._fat == 0.4
