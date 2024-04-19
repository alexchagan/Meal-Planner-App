from app.models.Meal import Meal
from datetime import datetime, timedelta
import pytz


def convert_date_simple(date):
    """
    Convert date string to a simplified format (YYYY-MM-DD).

    Args:
        date (str): Date string in ISO format.

    Returns:
        str: Simplified date string.
    """
    return date.split("T")[0]


def json_to_meal_objects(json_item):
    """
    Convert JSON data to a list of Meal objects.

    Args:
        json_item (dict): JSON data containing meal information.

    Returns:
        list: List of Meal objects.
    """
    date = convert_date_simple(json_item["date"])
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
    # Get today's date in Israel time zone
    tz = pytz.timezone("Israel")
    today = datetime.now(tz)

    # Calculate the start of the current week (Monday)
    start_of_week = today - timedelta(days=(today.weekday() + 1) % 7)

    # List to store the days of the week
    days = []

    # Calculate and append the dates of the week to the list
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
    # Get today's date in Israel time zone
    tz = pytz.timezone("Israel")
    return datetime.now(tz)
