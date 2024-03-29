import React, { useState } from 'react';
import {TextField} from '@mui/material';
import { useNavigate } from 'react-router-dom'; 
import DeleteIcon from '@mui/icons-material/Delete';
import HomeIcon from '@mui/icons-material/Home';

import {endOfWeek, isWithinInterval, startOfWeek} from "date-fns";
import {DayPicker, Row, RowProps} from "react-day-picker";
import { addDays} from 'date-fns';

import "react-day-picker/dist/style.css";
import '../css/MealPlanner.css';  
import '../css/Buttons.css';

import MealDesc from '../interfaces/MealDesc';
import MealPeriods from '../interfaces/MealPeriods';

import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';

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

const MealPlanner = () => {
  const navigate = useNavigate();  
  const goToMainPage = () => {  
      navigate('/');  
  }; 

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
      [section]: [...prevState[section], { food: '', type: 'common', serving: '0', calPer100g: '0', proPer100g: '0', carbPer100g: '0', fatPer100g: '0' }]
    }));
  };

  const removeRow = (section: keyof MealPeriods, index: number) => {
    setMealPeriods(prevState => ({
      ...prevState,
      [section]: prevState[section].filter((_, i) => i !== index)
    }));
  };

  const handleChange = (section: keyof MealPeriods, index: number, field: keyof MealDesc, value: string) => {
    if (field === 'type' && value === 'common') {
      // Set the values to '0' when 'common' radio option is selected
      setMealPeriods(prevState => ({
        ...prevState,
        [section]: prevState[section].map((food, i) => i === index ? { ...food, [field]: value, serving: '0', calPer100g: '0', proPer100g: '0', carbPer100g: '0', fatPer100g: '0' } : food)
      }));
    } else {
      // For other fields or when 'custom' radio option is selected
      setMealPeriods(prevState => ({
        ...prevState,
        [section]: prevState[section].map((food, i) => i === index ? { ...food, [field]: value } : food)
      }));
    }
  };

  const sendDataToBackend = async () => {
    try {
      const selectedDatePlusOneDay = addDays(selectedDate, 1);
      const formattedData = {
        date: selectedDatePlusOneDay,
        morning: MealPeriods.morning.map(item => [item.food, item.type, item.serving, item.calPer100g, item.proPer100g, item.carbPer100g, item.fatPer100g]),
        afternoon: MealPeriods.afternoon.map(item => [item.food, item.type, item.serving, item.calPer100g, item.proPer100g, item.carbPer100g, item.fatPer100g]),
        evening: MealPeriods.evening.map(item => [item.food, item.type, item.serving, item.calPer100g, item.proPer100g, item.carbPer100g, item.fatPer100g])
      };
      
    
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

  return (
  
    
    <div className='main'>
      <div style={{alignContent:'flex-start', marginBottom:'10px'}}>
      <button className="button-61" role="button" onClick={goToMainPage} ><HomeIcon/></button> 
      </div>

      <div className='box'>
      <p style={{fontSize: '16px'}}><strong>What's a Common meal?</strong></p>
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

      <div>
      {Object.keys(MealPeriods).map((sectionKey) => {
        const section = sectionKey as keyof MealPeriods;
        return (
          <div key={section} className='comp'>
            <h2>{section.charAt(0).toUpperCase() + section.slice(1)} {section === "morning" && "🍳"} {section === "afternoon" && "🥩"} {section === "evening" && "🥣"}</h2>
            {MealPeriods[section].map((food, index) => (
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
                {food.type === 'custom' && <p style={{marginTop:'11px',marginLeft:'15px'}}>(per 100g)</p>}
             </div>

                <TextField
                  style={{width:'170px'}}
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
                      style={{width:'70px'}}
                      label = "Calories"
                      type="text"
                      value={food.calPer100g}
                      onChange={(e) => handleChange(section, index, 'calPer100g', e.target.value)}
                      placeholder=""
                      className="small-textbox"
                      defaultValue="0"
                      size = "small"
                    />

                   
                    <TextField
                      style={{width:'65px'}}
                      label = "Protein"
                      type="text"
                      value={food.proPer100g}
                      onChange={(e) => handleChange(section, index, 'proPer100g', e.target.value)}
                      placeholder=""
                      className="small-textbox"
                      defaultValue="0"
                      size = "small"
                    />

                    <TextField
                      style={{width:'60px'}}
                      label = "Carbs"
                      type="text"
                      value={food.carbPer100g}
                      onChange={(e) => handleChange(section, index, 'carbPer100g', e.target.value)}
                      placeholder=""
                      className="small-textbox"
                      defaultValue="0"
                      size = "small"
                    />

                    <TextField
                      style={{width:'60px'}}
                      label = "Fat"
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
                      style={{width:'70px'}}
                      label = "Calories"
                      type="text"
                      value="0"
                      disabled
                      onChange={(e) => handleChange(section, index, 'calPer100g', e.target.value)}
                      placeholder=""
                      className="small-textbox"
                      size = "small"
                    />

                   
                    <TextField
                      style={{width:'65px'}}
                      label = "Protein"
                      type="text"
                      value="0"
                      disabled
                      onChange={(e) => handleChange(section, index, 'proPer100g', e.target.value)}
                      placeholder=""
                      className="small-textbox"
                      size = "small"
                    />

                    <TextField
                      style={{width:'60px'}}
                      label = "Carbs"
                      type="text"
                      value="0"
                      disabled
                      onChange={(e) => handleChange(section, index, 'carbPer100g', e.target.value)}
                      placeholder=""
                      className="small-textbox"
                      size = "small"
                    />

                    <TextField
                      style={{width:'60px'}}
                      label = "Fat"
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

                <button style={{ marginLeft: '10px', height: '40px' }} className="button-61" onClick={() => removeRow(section, index)}><DeleteIcon/></button>
              </div>
            ))}
            <button className="button-61" onClick={() => addRow(section)}>Add Meal</button>
          </div>
        );
      })}
      <button style={{ marginTop: '10px' }} className='button-28' onClick={sendDataToBackend}>Confirm</button>

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
