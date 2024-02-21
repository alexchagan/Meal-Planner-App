from sqlalchemy import create_engine, Column, Integer, String, Float
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Define the base class for declarative class definitions
Base = declarative_base()

# Define the Meal class with the appropriate column names and types
class MealSQL(Base):
    __tablename__ = 'Meals'  # Table name should match your existing table name

    meal_id = Column(Integer, primary_key=True)
    user_id = Column(Integer)  # Assuming user_id is part of the table
    date = Column(String(10))  # Change to match the data type in your table
    type = Column(String(10))  # Adjust the size to match your table
    period = Column(String(10))  # Adjust the size to match your table
    meal = Column(String(50))  # Adjust the size to match your table
    serving = Column(Float)  # Adjust the data type and size to match your table
    cal = Column(Float)  # Adjust the data type and size to match your table
    protein = Column(Float)  # Adjust the data type and size to match your table
    carb = Column(Float)  # Adjust the data type and size to match your table
    fat = Column(Float)  # Adjust the data type and size to match your table

# Modify the connection string to match your MySQL database configuration
engine = create_engine('mysql://root:Olgavadim7463!@localhost/meal_planner_project')

# Create the tables in the database
Base.metadata.create_all(engine)

# Create a session
Session = sessionmaker(bind=engine)
session = Session()

# Define the function to insert a meal instance into the database
def insert_meal(meal_instance):
    meal = MealSQL(user_id=meal_instance.user_id, date=meal_instance.date, type=meal_instance.type,
                period=meal_instance.period, meal=meal_instance.meal, serving=meal_instance.serving,
                cal=meal_instance.cal, protein=meal_instance.protein, carb=meal_instance.carb,
                fat=meal_instance.fat)
    session.add(meal)
    session.commit()


# Close session
# session.close()