from Meal import Meal
from datetime import datetime, timedelta

def convert_date_simple(date):
    return date.split('T')[0]

def json_to_meal_objects(json_item):
    
    date = convert_date_simple(json_item['date'])
    meals = []

    for period in ['morning', 'afternoon', 'evening']:
        for meal_data in json_item[period]:
            meal_name, type, serving, cal, protein, carb, fat = meal_data
            meals.append(Meal(date=date, period=period, type=type, meal=meal_name, serving=serving, cal=cal,protein=protein, carb=carb, fat=fat))

    return meals

def get_dates_of_week():
    # Get today's date
    days = []

    today = datetime.now()

    # Calculate the start of the current week (assuming Sunday is the start of the week)
    start_of_week = today - timedelta(days=today.weekday() + 1)  # Adjust by 1 day for Sunday

    # Print the days of the week in the format "year-month-day"
    print("Days of the current week (starting on Sunday and ending on Saturday):")
    for i in range(7):
        day = start_of_week + timedelta(days=i)
        days.append(day.strftime('%Y-%m-%d'))

    return days