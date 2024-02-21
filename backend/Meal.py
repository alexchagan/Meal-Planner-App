import requests

class Meal:
    def __init__(self, date, type, period, meal, serving, cal, protein, carb, fat) -> None:
        self.date = date
        self.type = type
        self.period = period
        self.meal = meal
        self.serving = float(serving)
        self.cal =  float(cal)
        self.protein =  float(protein)
        self.carb =  float(carb)
        self.fat =  float(fat)

    def fix_decimals(self):
        self.serving = float("{:.3f}".format(float(self.serving)))
        self.cal = float("{:.3f}".format(float(self.cal)))
        self.protein = float("{:.3f}".format(float(self.protein)))
        self.carb = float("{:.3f}".format(float(self.carb)))
        self.fat = float("{:.3f}".format(float(self.fat)))

    def update_nutritional_values(self):
        # Calculate new values based on serving size
        serving_factor = self.serving / 100.0
        self.cal *= serving_factor
        self.protein *= serving_factor
        self.carb *= serving_factor
        self.fat *= serving_factor
        self.fix_decimals()
    
    def nutritional_values_api(self):
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
        return f"Meal: {self.meal}\nDate: {self.date}\nType: {self.type}\nPeriod: {self.period}\nServing: {self.serving}\nCalories: {self.cal}\nProtein: {self.protein}\nCarbohydrates: {self.carb}\nFat: {self.fat}"
    
      
        