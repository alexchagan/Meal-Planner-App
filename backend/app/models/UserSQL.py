from ..database import db  

class UserSQL(db.Model):
    """
    Model class representing the Users table in the database.
    """
    
    __tablename__ = 'Users'

    id = db.Column(db.String(30), primary_key=True) 
    name = db.Column(db.String(50)) 
    email = db.Column(db.String(50))