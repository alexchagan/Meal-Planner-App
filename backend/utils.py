from Meal import Meal

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