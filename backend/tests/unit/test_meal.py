import unittest
from unittest.mock import patch
import sys
import os

backend_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
sys.path.append(backend_dir)

from app.models.Meal import Meal

class TestMeal(unittest.TestCase):
    def setUp(self):
        self.meal = Meal("2023-06-08", "Custom", "Morning", "Oatmeal", 50.0, 150.0, 5.0, 25.0, 3.0)

    def test_fix_decimals(self):
        self.meal.serving = 50.1234
        self.meal.cal = 150.5678
        self.meal.protein = 5.9876
        self.meal.carb = 25.4321
        self.meal.fat = 3.2109

        self.meal.fix_decimals()

        self.assertEqual(self.meal.serving, 50.123)
        self.assertEqual(self.meal.cal, 150.568)
        self.assertEqual(self.meal.protein, 5.988)
        self.assertEqual(self.meal.carb, 25.432)
        self.assertEqual(self.meal.fat, 3.211)

    def test_update_nutritional_values(self):
        self.meal.serving = 200.0

        self.meal.update_nutritional_values()

        self.assertEqual(self.meal.cal, 300.0)
        self.assertEqual(self.meal.protein, 10.0)
        self.assertEqual(self.meal.carb, 50.0)
        self.assertEqual(self.meal.fat, 6.0)

    
    def test_nutritional_values_api_success(self):
        
        self.meal.meal = "1 banana"
        self.meal.serving = 0
        self.meal.cal = 0
        self.meal.protein = 0
        self.meal.carb = 0
        self.meal.fat = 0

        self.meal.nutritional_values_api()

        self.assertEqual(self.meal.serving, 118.0)
        self.assertEqual(self.meal.cal, 105.5)
        self.assertEqual(self.meal.protein, 1.3)
        self.assertEqual(self.meal.carb, 27.4)
        self.assertEqual(self.meal.fat, 0.4)

if __name__ == "__main__":
    unittest.main()