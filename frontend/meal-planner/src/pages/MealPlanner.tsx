import React, { useState } from 'react';
import { TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom'; 
import CloseIcon from '@mui/icons-material/Close';
import { startOfWeek } from "date-fns";
import { DayPicker } from "react-day-picker";

import "react-day-picker/dist/style.css";
import '../css/MealPlanner.css';  
import '../css/Buttons.css';

import MealDesc from '../interfaces/MealDesc';
import MealPeriods from '../interfaces/MealPeriods';

import { CurrentWeekRow } from '../components/CurrentWeekRow';

import { formatMealPeriodData } from '../utils/mealPeriodUtils';

import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';

const MealPlanner = () => {
    
  const [MealPeriods, setMealPeriods] = useState<MealPeriods>({
    morning: [],
    afternoon: [],
    evening: []
  });

  const [selectedDate, setSelectedDate] = useState<Date>(startOfWeek(new Date()));
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogContent, setDialogContent] = useState('');

  const openMessageDialog = (content: string) => {
    setDialogContent(content);
    setOpenDialog(true);
  };

  const addRow = (section: keyof MealPeriods) => {
    setMealPeriods(prevState => ({
      ...prevState,
      [section]: [...prevState[section], { food: '' }]
    }));
  };

  const removeRow = (section: keyof MealPeriods, index: number) => {
    setMealPeriods(prevState => ({
      ...prevState,
      [section]: prevState[section].filter((_, i) => i !== index)
    }));
  };

  const handleChange = (section: keyof MealPeriods, index: number, field: keyof MealDesc, value: string) => {
   
      setMealPeriods(prevState => ({
        ...prevState,
        [section]: prevState[section].map((food, i) => i === index ? { ...food, [field]: value } : food)
      }));
  };

  const sendDataToBackend = async () => {
    try {
      const formattedData = formatMealPeriodData(selectedDate, MealPeriods);
      
      const response = await fetch('http://127.0.0.1:5000/receive_data', {
        credentials: 'include',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formattedData)
      });

      if (response.ok) {
        console.log('Data sent successfully to the backend');
        openMessageDialog('Added meals successfully');  
      } 
      else {
        console.error('Failed to send data to the backend');
        const responseData = await response.json();
        openMessageDialog(JSON.stringify(responseData.error));   
      }
    } catch (error) {
      console.error('Error sending data to the backend:', error);
    }
  };

  //TODO: Add option to fetch saved meals for the specific date and display them
  const fetchMeals = async (date: Date) => {
    try {
      const response = await fetch('http://127.0.0.1:5000/send_daily_meals', {
        credentials: 'include',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ date: date.toISOString() })
      });
  
      if (response.ok) {
        const data = await response.json();
        return {
          morning: data.morning.map((meal: { food: string }) => ({ food: meal.food })),
          afternoon: data.afternoon.map((meal: { food: string }) => ({ food: meal.food })),
          evening: data.evening.map((meal: { food: string }) => ({ food: meal.food }))
        };
      } else {
        console.error('Failed to fetch meals data from the backend');
        return null;
      }
    } catch (error) {
      console.error('Error fetching meals data from the backend:', error);
      return null;
    }
  };

  
  return (
    <div className='main'>
     <button className='confirm button-28' onClick={sendDataToBackend}>Confirm Meals</button>
     <div className ='box-container'>
      <div className='box'>
        <p style={{fontSize: '16px'}}><strong>What's a Meal Description? 🤔</strong></p>
        <p style={{fontSize: '13px'}}>* Specify the quantity of each food item</p>
        <p style={{fontSize: '13px'}}>* If not specified, default quantity is 100g</p>
        <p style={{fontSize: '13px'}}>* Example: 50g brisket and 2 bananas</p>
      </div>

      <div>
        <DayPicker className='box'
          components={{ Row: CurrentWeekRow }}
          showOutsideDays
          disableNavigation
          mode="single"
          onDayClick={(day) => setSelectedDate(day)}  
          {...(selectedDate && { selected: selectedDate })}
        />
      </div>
     </div>

      <div className='sections-container'>
        {Object.keys(MealPeriods).map((sectionKey) => {
          const section = sectionKey as keyof MealPeriods;
          return (
            <div key={section} className='comp'>
              <h2 style={{ textAlign: 'center'}}>
                {section.charAt(0).toUpperCase() + section.slice(1)}
                {section === "morning" && "🍳"}
                {section === "afternoon" && "🥩"}
                {section === "evening" && "🥣"}
              </h2>

              {MealPeriods[section].map((food, index) => (
                <div className='row' key={index}>
                  
                    <TextField
                      style={{width:'200px'}}
                      label="Meal Description"
                      value={food.food}
                      onChange={(e) => handleChange(section, index, 'food', e.target.value)}
                      placeholder="Meal Description"
                      size='small'   
                      />            
                    
                  <button style={{height: '25px', width: '10px', marginTop: '8px', marginLeft: '-235px'}}  className="remove" onClick={() => removeRow(section, index)}><CloseIcon/></button>
                </div>
              ))}
              <button style={{display:'block', margin:'0 auto'}} className="button-61" onClick={() => addRow(section)}>Add Meal</button>
            </div>
          );
        })}
      </div>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogContent>{dialogContent}</DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default MealPlanner;