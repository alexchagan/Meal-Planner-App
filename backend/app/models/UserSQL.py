from ..database import db  

class UserSQL(db.Model):
    __tablename__ = 'Users'

    id = db.Column(db.String(30), primary_key=True) 
    name = db.Column(db.String(50)) 
    email = db.Column(db.String(50))