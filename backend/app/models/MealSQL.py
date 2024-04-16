from ..database import db

class MealSQL(db.Model):
    """
    Model class representing the Meals table in the database.
    """

    __tablename__ = 'Meals'

    meal_id = db.Column("id", db.Integer, primary_key=True)
    user_id = db.Column("user_id", db.String(30))
    date = db.Column("date", db.String(10))
    period = db.Column("period", db.String(10))
    meal = db.Column("meal", db.String(50))
    serving = db.Column("serving", db.Float)
    cal = db.Column("cal", db.Float)
    protein = db.Column("protein", db.Float)
    carb = db.Column("carb", db.Float)
    fat = db.Column("fat", db.Float)