from ..database import db  

class UserSQL(db.Model):
    """
    Model class representing the Users table in the database.
    """
    
    __tablename__ = 'Users'

    id = db.Column("id", db.String(30), primary_key=True) 
    name = db.Column("name", db.String(50)) 
    email = db.Column("email", db.String(50))
    weekly_cals = db.Column("weekly_cals", db.Float)
    weekly_prot = db.Column("weekly_prot", db.Float)
    weekly_carb = db.Column("weekly_carb", db.Float)
    weekly_fats = db.Column("weekly_fats", db.Float)