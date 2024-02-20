import React, { useState } from 'react';
import {TextField} from '@mui/material';

import {endOfWeek, isWithinInterval, startOfWeek} from "date-fns";
import {DayPicker, Row, RowProps} from "react-day-picker";
import { addDays} from 'date-fns';

import "react-day-picker/dist/style.css";


function CurrentWeekRow(props: RowProps) {
    const isDateInCurrentWeek = (dateToCheck: Date) => {
      const today = new Date();
      const start = startOfWeek(today);
      const end = endOfWeek(today);
      return isWithinInterval(dateToCheck, { start, end });
    };
    const isNotCurrentWeek = props.dates.every((date) => !isDateInCurrentWeek(date));
    if (isNotCurrentWeek) return <></>;
    return <Row {...props} />;
  }

interface FoodItem {
  food: string;
  type: string;
  serving: string;
  calPer100g: string;
  proPer100g: string;
  carbPer100g: string;
  fatPer100g: string;
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

  const [selectedDate, setSelectedDate] = useState<Date>(startOfWeek(new Date()));

  const addRow = (section: keyof MealData) => {
    setMealData(prevState => ({
      ...prevState,
      [section]: [...prevState[section], { food: '', type: 'common', serving: '', calPer100g: '', proPer100g: '', carbPer100g: '', fatPer100g: '' }]
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
      const selectedDatePlusOneDay = addDays(selectedDate, 1);
      const formattedData = {
        date: selectedDatePlusOneDay,
        morning: mealData.morning.map(item => [item.food, item.type, item.serving, item.calPer100g, item.proPer100g, item.carbPer100g, item.fatPer100g]),
        afternoon: mealData.afternoon.map(item => [item.food, item.type, item.serving, item.calPer100g, item.proPer100g, item.carbPer100g, item.fatPer100g]),
        evening: mealData.evening.map(item => [item.food, item.type, item.serving, item.calPer100g, item.proPer100g, item.carbPer100g, item.fatPer100g])
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
        
      
      <h1 className='title'>Meal Planner</h1>

      <div className='container'>
        <DayPicker className='box'
        components={{ Row: CurrentWeekRow }}
        showOutsideDays
        disableNavigation
        mode="single"
        onDayClick={(day) => setSelectedDate(day)}  
        {...(selectedDate && { selected: selectedDate })}
        />
      </div>

      {Object.keys(mealData).map((sectionKey) => {
        const section = sectionKey as keyof MealData;
        return (
          <div key={section} className='comp'>
            <h2>{section.charAt(0).toUpperCase() + section.slice(1)} {section === "morning" && "🍳"} {section === "afternoon" && "🥩"} {section === "evening" && "🥣"}</h2>
            {mealData[section].map((food, index) => (
              <div className='row' key={index}>
               <div className='radio'>
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
             </div>

                <TextField
                  label = "Meal Descirption"
                  value={food.food}
                  onChange={(e) => handleChange(section, index, 'food', e.target.value)}
                  placeholder="Meal Description"
                  size='small'
                />

                {food.type === 'custom' ? (
                  <>
                    
                    
                    <TextField
                      label = "Serving in g"
                      type="text"
                      value={food.serving}
                      onChange={(e) => handleChange(section, index, 'serving', e.target.value)}
                      placeholder=""
                      className="small-textbox"
                      defaultValue="0"
                      size = "small"
                    />

                    <TextField
                      label = "Calories 100g"
                      type="text"
                      value={food.calPer100g}
                      onChange={(e) => handleChange(section, index, 'calPer100g', e.target.value)}
                      placeholder=""
                      className="small-textbox"
                      defaultValue="0"
                      size = "small"
                    />

                   
                    <TextField
                      label = "Protein 100g"
                      type="text"
                      value={food.proPer100g}
                      onChange={(e) => handleChange(section, index, 'proPer100g', e.target.value)}
                      placeholder=""
                      className="small-textbox"
                      defaultValue="0"
                      size = "small"
                    />

                    <TextField
                      label = "Carbs 100g"
                      type="text"
                      value={food.carbPer100g}
                      onChange={(e) => handleChange(section, index, 'carbPer100g', e.target.value)}
                      placeholder=""
                      className="small-textbox"
                      defaultValue="0"
                      size = "small"
                    />

                    <TextField
                      label = "Fat 100g"
                      type="text"
                      value={food.fatPer100g}
                      onChange={(e) => handleChange(section, index, 'fatPer100g', e.target.value)}
                      placeholder=""
                      className="small-textbox"
                      defaultValue="0"
                      size = "small"
                    />

                  </>
                ) : (
                  <>
                    <TextField
                      label = "Serving in g"
                      type="text"
                      value="0"
                      onChange={(e) => handleChange(section, index, 'serving', e.target.value)}
                      placeholder=""
                      className="small-textbox"
                      size = "small"
                      disabled
                    />

                    <TextField
                      label = "Calories 100g"
                      type="text"
                      value="0"
                      disabled
                      onChange={(e) => handleChange(section, index, 'calPer100g', e.target.value)}
                      placeholder=""
                      className="small-textbox"
                      size = "small"
                    />

                   
                    <TextField
                      label = "Protein 100g"
                      type="text"
                      value="0"
                      disabled
                      onChange={(e) => handleChange(section, index, 'proPer100g', e.target.value)}
                      placeholder=""
                      className="small-textbox"
                      size = "small"
                    />

                    <TextField
                      label = "Carbs 100g"
                      type="text"
                      value="0"
                      disabled
                      onChange={(e) => handleChange(section, index, 'carbPer100g', e.target.value)}
                      placeholder=""
                      className="small-textbox"
                      size = "small"
                    />

                    <TextField
                      label = "Fat 100g"
                      type="text"
                      value="0"
                      disabled
                      onChange={(e) => handleChange(section, index, 'fatPer100g', e.target.value)}
                      placeholder=""
                      className="small-textbox"
                      size = "small"
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
      <button onClick={sendDataToBackend}>Confirm</button>
    </div>
  );
};

export default MealPlanner;
