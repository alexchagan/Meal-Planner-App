import React, { useState, useEffect } from 'react';
import './WeeklyMeals.css';

interface Meal {
  meal: string;
  grams: number;
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
}

interface MealsByDate {
    [date: string]: {
      [period: string]: Meal[];
    } & {
      total: {
        calories: number;
        protein: number;
        fat: number;
        carbs: number;
      };
    };
  }

function WeeklyMeals() {
  const [weeklyMeals, setWeeklyMeals] = useState<MealsByDate | null>(null);

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

  return (
    <div>
      <h1>Weekly Meals</h1>
      {weeklyMeals ? (
        <div>
          {/* Loop through each date */}
          {Object.entries(weeklyMeals).map(([date, mealsByPeriod], index) => (
            <div className='weekly-meals-container'  key={date}>
              {/* Insert space between dates */}
              {index > 0 && <br />}
              <h2 className='date-header'>{date}</h2>
              {/* Sort periods: morning, afternoon, evening */}
              {['morning', 'afternoon', 'evening'].map(period => (
                <div key={period}>
                  <h3 className='period-header'>{period}</h3>
                  <table className='meal-table'>
                    <thead>
                      <tr>
                        <th>Meal</th>
                        <th>Grams</th>
                        <th>Calories</th>
                        <th>Protein (g)</th>
                        <th>Fat (g)</th>
                        <th>Carbs (g)</th>
                        
                      </tr>
                    </thead>
                    <tbody>
                      {/* Loop through meals in the period */}
                      {mealsByPeriod[period]?.map((meal, mealIndex) => (
                        <tr id={`${date}-${period}-${meal.meal}`} key={mealIndex}>
                          <td>{meal.meal}</td>
                          <td>{meal.grams}</td>
                          <td>{meal.calories}</td>
                          <td>{meal.protein}</td>
                          <td>{meal.fat}</td>
                          <td>{meal.carbs}</td>
                          <td>
                            <button
                              onClick={() => removeMeal(date, period, meal.meal)}
                            >
                              Remove
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ))}
              <h2>Calories: {mealsByPeriod.total.calories}, Protein: {mealsByPeriod.total.protein}g, Carbs: {mealsByPeriod.total.carbs}g, Fats: {mealsByPeriod.total.fat}g </h2>
            </div>
    
          ))}
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default WeeklyMeals;
