from ..database import db

class MealSQL(db.Model):
    """
    Model class representing the Meals table in the database.
    """

    __tablename__ = 'Meals'

    meal_id = db.Column("id", db.Integer, primary_key=True)
    user_id = db.Column(db.String(30))
    date = db.Column(db.String(10))
    type = db.Column(db.String(10))
    period = db.Column(db.String(10))
    meal = db.Column(db.String(50))
    serving = db.Column(db.Float)
    cal = db.Column(db.Float)
    protein = db.Column(db.Float)
    carb = db.Column(db.Float)
    fat = db.Column(db.Float)