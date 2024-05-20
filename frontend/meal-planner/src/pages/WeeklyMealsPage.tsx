import { useState, useEffect } from 'react';

import '../css/WeeklyMeals.css';
import '../css/Buttons.css';  

import MealsByDate from '../interfaces/MealsByDate';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CloseIcon from '@mui/icons-material/Close';

function WeeklyMeals() {
  const [weeklyMeals, setWeeklyMeals] = useState<MealsByDate | null>(null);
  const [selectedDateIndex, setSelectedDateIndex] = useState(0);

  useEffect(() => {
    
    fetch('http://127.0.0.1:5000/send_weekly_meals', {
      credentials: 'include',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(response => response.json())
      .then((data: MealsByDate) => {
       
        setWeeklyMeals(data);
      })
      .catch(error => {
        console.error('Error fetching weekly meals:', error);
      });
  }, []); 

  const removeMeal = (date: string, period: string, meal: string) => {
    
    fetch('http://127.0.0.1:5000/remove_meal', {
      credentials: 'include',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ date, period, meal })
    })
      .then(response => {
        
        if (response.ok) {
          
          setWeeklyMeals(prevMeals => {
            if (prevMeals) {
              const updatedMeals = { ...prevMeals };
              updatedMeals[date][period] = updatedMeals[date][period].filter(
                m => m.meal !== meal
              );
              return updatedMeals;
            }
            return prevMeals;
          });
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
      {weeklyMeals && Object.keys(weeklyMeals).length > 0 ? (

        <div>
          <div className='weekly-meals-buttons'> 
            <button className="button-61 weekly-meals-left" onClick={handlePrevDate}><ArrowBackIcon/></button>
            <button className='button-61 weekly-meals-right' onClick={handleNextDate}><ArrowForwardIcon/></button>
          </div>
          {Object.entries(weeklyMeals).map(([date, mealsByPeriod], index) => {
            if (index !== selectedDateIndex) {
              return null;
            }
            return (
              <div key={date} className='weekly-meals-wrapper'>
                <h2 className='weekly-meals-date-header'>{date}</h2>
                {['morning', 'afternoon', 'evening'].map(period => {
                  const meals = mealsByPeriod[period];
                  if (!meals || meals.length === 0){ 
                    return null; }
                  const capitalizedPeriod = period.charAt(0).toUpperCase() + period.slice(1);
                  return (
                    <div key={period}>
                      <h3 className='weekly-meals-period-header'>{capitalizedPeriod}</h3>
                      <table className='weekly-meals-meal-table'>
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
                              
                                <button style={{ marginLeft: '5px', height: '30px', bottom:'-5px', position:'relative' }}
                                 className="meal-planner-remove"
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
                <div className="weekly-meals-total-info">
                <h2 style={{fontSize:'20px' , textDecoration: 'underline'}}>Total Daily Values</h2>
                <div className="weekly-meals-total-box">
                  <div className="weekly-meals-total-label">Calories:</div>
                  <div className="weekly-meals-total-value">{mealsByPeriod.total.calories}</div>
                </div>
                <div className="weekly-meals-total-box">
                  <div className="weekly-meals-total-label">Protein (g):</div>
                  <div className="weekly-meals-total-value">{mealsByPeriod.total.protein}g</div>
                </div>
                <div className="weekly-meals-total-box">
                  <div className="weekly-meals-total-label">Carbs (g):</div>
                  <div className="weekly-meals-total-value">{mealsByPeriod.total.carbs}g</div>
                </div>
                <div className="weekly-meals-total-box">
                  <div className="weekly-meals-total-label">Fats (g):</div>
                  <div className="weekly-meals-total-value">{mealsByPeriod.total.fat}g</div>
                </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <p style={{ fontSize: '24px', fontWeight: 'bold' }}>
          No meals are scheduled yet, go to the{' '}
          <a href="/mealplanner" style={{ color: 'blue', textDecoration: 'underline' }}>
            Meal Scheduler page
          </a>.
        </p>
      </div>
      )}
    </div>
  );
  
  
}

export default WeeklyMeals;
