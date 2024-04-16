import requests

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
        self.date = date
        self.period = period
        self.meal = meal
        self.serving = 0.0
        self.cal = 0.0
        self.protein = 0.0
        self.carb = 0.0
        self.fat = 0.0

    def fix_decimals(self):
        """
        Round nutritional values to three decimal places.
        """
        self.serving = round(self.serving, 3)
        self.cal = round(self.cal, 3)
        self.protein = round(self.protein, 3)
        self.carb = round(self.carb, 3)
        self.fat = round(self.fat, 3)

    def update_nutritional_values(self):
        """
        Update nutritional values based on serving size.
        """
        serving_factor = self.serving / 100.0
        self.cal *= serving_factor
        self.protein *= serving_factor
        self.carb *= serving_factor
        self.fat *= serving_factor
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
            response = requests.get(url, params={"query": self.meal}, headers=headers)
            response.raise_for_status()  # Raise an exception for 4xx/5xx status codes
            data = response.json()
            for food_item in data:
                self.serving += food_item['serving_size_g']
                self.cal += food_item['calories']
                self.protein += food_item['protein_g']
                self.carb += food_item['carbohydrates_total_g']
                self.fat += food_item['fat_total_g']
            self.fix_decimals()
        except requests.exceptions.RequestException as e:
            return {"error": "Failed to fetch data from API"}

    def __str__(self):
        """
        Return string representation of Meal object.
        """
        return f"Meal: {self.meal}\nDate: {self.date}\nType: {self.type}\nPeriod: {self.period}\nServing: {self.serving}\nCalories: {self.cal}\nProtein: {self.protein}\nCarbohydrates: {self.carb}\nFat: {self.fat}"
