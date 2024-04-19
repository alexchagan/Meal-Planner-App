import requests
from ..models.MealSQL import MealSQL

class Meal:
    def __init__(self, date, period, meal):
        """
        Initialize Meal object.

        Args:
            date (str): Date of the meal.
            type (str): Type of the meal.
            period (str): Period of the day (e.g., morning, afternoon).
            meal (str): Name of the meal.
            serving (float): Serving size of the meal (in grams).
            cal (float): Calories content of the meal.
            protein (float): Protein content of the meal (in grams).
            carb (float): Carbohydrates content of the meal (in grams).
            fat (float): Fat content of the meal (in grams).
        """
        self._date = date
        self._period = period
        self._meal = meal
        self._serving = 0.0
        self._cal = 0.0
        self._protein = 0.0
        self._carb = 0.0
        self._fat = 0.0

    def get_serving_amount(self):
        return self._serving
    
    def get_meal_description(self):
        return self._meal
    
    def convert_to_sql_object(self, id):
         
        return MealSQL(
            user_id=id,
            date=self._date,
            period=self._period,
            meal=self._meal,
            serving=self._serving,
            cal=self._cal,
            protein=self._protein,
            carb=self._carb,
            fat=self._fat
        )

        

    def fix_decimals(self):
        """
        Round nutritional values to three decimal places.
        """
        self._serving = round(self._serving, 3)
        self._cal = round(self._cal, 3)
        self._protein = round(self._protein, 3)
        self._carb = round(self._carb, 3)
        self._fat = round(self._fat, 3)

    def update_nutritional_values(self):
        """
        Update nutritional values based on serving size.
        """
        serving_factor = self.serving / 100.0
        self._cal *= serving_factor
        self._protein *= serving_factor
        self._carb *= serving_factor
        self._fat *= serving_factor
        self.fix_decimals()

    def nutritional_values_api(self):
        """
        Retrieve nutritional values from an external API.
        """
        url = "https://nutrition-by-api-ninjas.p.rapidapi.com/v1/nutrition"
        headers = {
            "X-RapidAPI-Key": "096448c304mshd918b5bbf4f9eddp13a329jsn97df6f0ab30b",
            "X-RapidAPI-Host": "nutrition-by-api-ninjas.p.rapidapi.com"
        }
        try:
            response = requests.get(url, params={"query": self._meal}, headers=headers)
            response.raise_for_status()  # Raise an exception for 4xx/5xx status codes
            data = response.json()
            for food_item in data:
                self._serving += food_item['serving_size_g']
                self._cal += food_item['calories']
                self._protein += food_item['protein_g']
                self._carb += food_item['carbohydrates_total_g']
                self._fat += food_item['fat_total_g']
            self.fix_decimals()
        except requests.exceptions.RequestException as e:
            return {"error": "Failed to fetch data from API"}

    def __str__(self):
        """
        Return string representation of Meal object.
        """
        return f"Meal: {self._meal}\nDate: {self._date}\nType: {self._type}\nPeriod: {self._period}\nServing: {self._serving}\nCalories: {self._cal}\nProtein: {self._protein}\nCarbohydrates: {self._carb}\nFat: {self._fat}"
