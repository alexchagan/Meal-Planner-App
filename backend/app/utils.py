from app.models.Meal import Meal
from datetime import datetime, timedelta
import pytz

food_to_emoji = {
    "chicken": "🍗",
    "salmon": "🐟",
    "yogurt": "🥛",
    "oatmeal": "🥣",
    "rice": "🍚",
    "potato": "🍠",
    "broccoli": "🥦",
    "spinach": "🥬",
    "avocado": "🥑",
    "strawberries": "🍓",
    "raspberries": "🍒",
    "banana": "🍌",
    "orange": "🍊",
    "apple": "🍎",
    "mango": "🥭",
    "pineapple": "🍍",
    "kiwi": "🥝",
    "watermelon": "🍉",
    "almond": "🌰",
    "peanut butter": "🥜",
    "egg": "🥚",
    "beef": "🥩",
    "turkey": "🦃",
    "tofu": "🧈",
    "edamame": "🌱",
    "cheese": "🧀",
    "tuna": "🐟",
    "shake": "🥤",
    "bread": "🍞",
    "seed": "🌰"
}

def json_to_meal_objects(json_item):
    """
    Convert JSON data to a list of Meal objects.

    Args:
        json_item (dict): JSON data containing meal information.

    Returns:
        list: List of Meal objects.
    """
    date = json_item["date"].split("T")[0]
    meals = []

    for period in ["morning", "afternoon", "evening"]:
        for meal_data in json_item[period]:
            meal_name = meal_data
            meals.append(Meal(_date=date, _period=period, _meal=meal_name))

    return meals


def get_dates_of_week():
    """
    Get the dates of the current week.

    Returns:
        list: List of date strings in YYYY-MM-DD format representing the current week.
    """
    today = get_todays_date()

    # Calculate the start of the current week (Monday)
    start_of_week = today - timedelta(days=(today.weekday() + 1) % 7)

    days = []

    for i in range(7):
        day = start_of_week + timedelta(days=i)
        days.append(day.strftime("%Y-%m-%d"))

    return days


def get_todays_date():
    """
    Get the today's date.

    Returns:
        list: List of date strings in YYYY-MM-DD format representing the current week.
    """
    tz = pytz.timezone("Israel")
    return datetime.now(tz)

def add_emojis_to_meal(meal_text):
    words = meal_text.split()
    result = []

    for word in words:
        emoji_added = False
        for food, emoji in food_to_emoji.items():
            if food in word.lower():
                result.append(word + " " + emoji)
                emoji_added = True
                break
        if not emoji_added:
            result.append(word)

    return " ".join(result)

    




    