from ..database import db


class UserSQL(db.Model):
    """
    Model class representing the Users table in the database.
    """

    __tablename__ = "Users"

    id = db.Column("id", db.String(30), primary_key=True)
    name = db.Column("name", db.String(50))
    email = db.Column("email", db.String(50))
    daily_cals = db.Column("daily_cals", db.Float)
    daily_prot = db.Column("daily_prot", db.Float)
    daily_carb = db.Column("daily_carb", db.Float)
    daily_fats = db.Column("daily_fats", db.Float)
    picture = db.Column("picture", db.String(255))
