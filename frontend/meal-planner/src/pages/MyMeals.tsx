import React, { useState, useEffect } from 'react';

import '../css/MyMeals.css';
import '../css/Buttons.css';  

import MealsByDate from '../interfaces/MealsByDate';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CloseIcon from '@mui/icons-material/Close';

function WeeklyMeals() {
  const [weeklyMeals, setWeeklyMeals] = useState<MealsByDate | null>(null);
  const [selectedDateIndex, setSelectedDateIndex] = useState(0);

  useEffect(() => {
    // Fetch data from your Flask backend
    fetch('http://127.0.0.1:5000/send_weekly_meals', {
      credentials: 'include',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(response => response.json())
      .then((data: MealsByDate) => {
        // Update state with fetched data
        setWeeklyMeals(data);
      })
      .catch(error => {
        console.error('Error fetching weekly meals:', error);
      });
  }, []); // Run effect only once on component mount

  const removeMeal = (date: string, period: string, meal: string) => {
    // Send data to backend to remove the meal
    fetch('http://127.0.0.1:5000/remove_meal', {
      credentials: 'include',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ date, period, meal })
    })
      .then(response => {
        // Handle response from backend
        if (response.ok) {
          // If successful, remove the row from the UI
          const tableRow = document.getElementById(
            `${date}-${period}-${meal}`
          );
          if (tableRow) {
            tableRow.remove();
          }
        } else {
          throw new Error('Failed to remove meal');
        }
      })
      .catch(error => {
        console.error('Error removing meal:', error);
      });
  };

  const handlePrevDate = () => {
    setSelectedDateIndex(prevIndex =>
      prevIndex > 0 ? prevIndex - 1 : prevIndex
    );
  };

  const handleNextDate = () => {
    setSelectedDateIndex(prevIndex =>
      prevIndex < Object.keys(weeklyMeals || {}).length - 1
        ? prevIndex + 1
        : prevIndex
    );
  };

  return (
    <div>
      {weeklyMeals ? (
        <div>
          <div className='buttons'> 
            <button className="button-61 left" onClick={handlePrevDate}><ArrowBackIcon/></button>
            <button className='button-61 right' onClick={handleNextDate}><ArrowForwardIcon/></button>
          </div>
          {Object.entries(weeklyMeals).map(([date, mealsByPeriod], index) => {
            if (index !== selectedDateIndex) return null;
            return (
              <div key={date} className='wrapper'>
                <h2 className='date-header'>{date}</h2>
                {['morning', 'afternoon', 'evening'].map(period => {
                  const meals = mealsByPeriod[period];
                  if (!meals || meals.length === 0) return null; // Don't show the period if there are no meals
                  const capitalizedPeriod = period.charAt(0).toUpperCase() + period.slice(1);
                  return (
                    <div key={period}>
                      <h3 className='period-header'>{capitalizedPeriod}</h3>
                      <table className='meal-table'>
                        <thead>
                          <tr style={{fontSize:'14px'}}>
                            <th>Meal</th>
                            <th>Grams</th>
                            <th>Calories</th>
                            <th>Protein (g)</th>
                            <th>Fat (g)</th>
                            <th>Carbs (g)</th>                   
                          </tr>
                        </thead>
                        <tbody>
                          {meals.map((meal, mealIndex) => (
                            <tr
                              id={`${date}-${period}-${meal.meal}`}
                              key={mealIndex}
                            >
                              <td>{meal.meal}</td>
                              <td>{meal.grams}</td>
                              <td>{meal.calories}</td>
                              <td>{meal.protein}</td>
                              <td>{meal.fat}</td>
                              <td>{meal.carbs}</td>
                              
                                <button style={{ marginLeft: '5px', height: '30px', bottom:'-5px', position:'relative' }} className="remove"
                                  onClick={() =>
                                    removeMeal(date, period, meal.meal)
                                  }
                                >
                                  <CloseIcon/>
                                </button> 
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  );
                })}
                <div className="total-info">
                <h2 style={{fontSize:'20px' , textDecoration: 'underline'}}>Total Daily Values</h2>
                <div className="total-box">
                  <div className="total-label">Calories:</div>
                  <div className="total-value">{mealsByPeriod.total.calories}</div>
                </div>
                <div className="total-box">
                  <div className="total-label">Protein (g):</div>
                  <div className="total-value">{mealsByPeriod.total.protein}g</div>
                </div>
                <div className="total-box">
                  <div className="total-label">Carbs (g):</div>
                  <div className="total-value">{mealsByPeriod.total.carbs}g</div>
                </div>
                <div className="total-box">
                  <div className="total-label">Fats (g):</div>
                  <div className="total-value">{mealsByPeriod.total.fat}g</div>
                </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
  
  
}

export default WeeklyMeals;
