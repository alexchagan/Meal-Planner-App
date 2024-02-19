import React, { useState } from 'react';

interface FoodItem {
  food: string;
  type: string;
  serving: string;
  calPer100g: string;
}

interface MealData {
  morning: FoodItem[];
  afternoon: FoodItem[];
  evening: FoodItem[];
}

const MealPlanner = () => {
  const [mealData, setMealData] = useState<MealData>({
    morning: [],
    afternoon: [],
    evening: []
  });

  const addRow = (section: keyof MealData) => {
    setMealData(prevState => ({
      ...prevState,
      [section]: [...prevState[section], { food: '', type: 'common', serving: '', calPer100g: '' }]
    }));
  };

  const removeRow = (section: keyof MealData, index: number) => {
    setMealData(prevState => ({
      ...prevState,
      [section]: prevState[section].filter((_, i) => i !== index)
    }));
  };

  const handleChange = (section: keyof MealData, index: number, field: keyof FoodItem, value: string) => {
    setMealData(prevState => ({
      ...prevState,
      [section]: prevState[section].map((food, i) => i === index ? { ...food, [field]: value } : food)
    }));
  };

  const sendDataToBackend = async () => {
    try {
      const formattedData = {
        morning: mealData.morning.map(item => [item.food, item.type, item.serving, item.calPer100g]),
        afternoon: mealData.afternoon.map(item => [item.food, item.type, item.serving, item.calPer100g]),
        evening: mealData.evening.map(item => [item.food, item.type, item.serving, item.calPer100g])
      };
      
      // Assuming you have an API endpoint to send data to the backend
      const response = await fetch('http://127.0.0.1:5000/receive_data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formattedData)
      });

      if (response.ok) {
        console.log('Data sent successfully to the backend');
        // Handle success
      } else {
        console.error('Failed to send data to the backend');
        // Handle error
      }
    } catch (error) {
      console.error('Error sending data to the backend:', error);
      // Handle error
    }
  };

  return (
    <div>
      <h1>Meal Planner</h1>

      {Object.keys(mealData).map((sectionKey) => {
        const section = sectionKey as keyof MealData;
        return (
          <div key={section}>
            <h2>{section.charAt(0).toUpperCase() + section.slice(1)}</h2>
            {mealData[section].map((food, index) => (
              <div key={index}>
                <label style={{ fontWeight: 'bold' }}>Type</label>
                <label>
                  <input
                    type="radio"
                    value="common"
                    checked={food.type === 'common'}
                    onChange={() => handleChange(section, index, 'type', 'common')}
                  />
                  Common
                </label>
                <label>
                  <input
                    type="radio"
                    value="custom"
                    checked={food.type === 'custom'}
                    onChange={() => handleChange(section, index, 'type', 'custom')}
                  />
                  Custom
                </label>

                <label style={{ fontWeight: 'bold' }}> Meal </label>
                <input
                  type="text"
                  value={food.food}
                  onChange={(e) => handleChange(section, index, 'food', e.target.value)}
                  placeholder="Food"
                />

                {food.type === 'custom' ? (
                  <>
                    <label style={{ fontWeight: 'bold' }}> Serving </label>
                    <input
                      type="text"
                      value={food.serving || ''}
                      onChange={(e) => handleChange(section, index, 'serving', e.target.value)}
                      placeholder=""
                    />

                    <label style={{ fontWeight: 'bold' }}> Cal per 100g </label>
                    <input
                      type="text"
                      value={food.calPer100g || ''}
                      onChange={(e) => handleChange(section, index, 'calPer100g', e.target.value)}
                      placeholder=""
                    />
                  </>
                ) : (
                  <>
                    <label style={{ fontWeight: 'bold' }}> Serving </label>
                    <input
                      type="text"
                      value="0"
                      disabled
                      onChange={(e) => handleChange(section, index, 'serving', e.target.value)}
                      placeholder=""
                    />

                    <label style={{ fontWeight: 'bold' }}> Cal per 100g </label>
                    <input
                      type="text"
                      value="0"
                      disabled
                      onChange={(e) => handleChange(section, index, 'calPer100g', e.target.value)}
                      placeholder=""
                    />
                  </>
                )}

                <button onClick={() => removeRow(section, index)}>-</button>
              </div>
            ))}
            <button onClick={() => addRow(section)}>Add Meal</button>
          </div>
        );
      })}
      <button onClick={sendDataToBackend}>Send Data to Backend</button>
    </div>
  );
};

export default MealPlanner;
