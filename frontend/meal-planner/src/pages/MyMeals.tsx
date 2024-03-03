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
          // If successful, update the UI to reflect the removal
          // For example, you can fetch the updated data and set the state
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
            <div key={date}>
              {/* Insert space between dates */}
              {index > 0 && <br />}
              <h2>{date}</h2>
              {/* Sort periods: morning, afternoon, evening */}
              {['morning', 'afternoon', 'evening'].map(period => (
                <div key={period}>
                  <h3>{period}</h3>
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
                        <tr key={mealIndex}>
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
