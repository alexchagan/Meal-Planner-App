import React, { useState } from 'react';
import { TextField } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import { stringify } from 'querystring';
//s
const UserProfile = () => {
  const [dailyGoals, setDailyGoals] = useState({
    dailyCals: 0,
    dailyProt: 0,
    dailyCarb: 0,
    dailyFats: 0,
  });
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogContent, setDialogContent] = useState('');

  const openMessageDialog = (content: string) => {
    setDialogContent(content);
    setOpenDialog(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numericValue = Number(value);
    if (!isNaN(numericValue)) {
      setDailyGoals(prevState => ({
        ...prevState,
        [name]: numericValue,
      }));
    }
  };

  const sendDailyGoals = async () => {
    try {
      const data = {
        calories: dailyGoals.dailyCals,
        protein: dailyGoals.dailyProt,
        carbs: dailyGoals.dailyCarb,
        fats: dailyGoals.dailyFats,
      };
      console.log(data);
      const response = await fetch('http://127.0.0.1:5000/get_daily_goals', {
        credentials: 'include',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (response.ok) {
        console.log('Data sent successfully to the backend');
        openMessageDialog('Updated Daily Goals successfully');
      } else {
        console.error('Failed to send data to the backend');
        const responseData = await response.json();
        openMessageDialog(JSON.stringify(responseData.error));
      }
    } catch (error) {
      console.error('Error sending data to the backend:', error);
    }
  };

  return (
    <div>
      <div
        className="box"
        style={{
          display: 'flex',
          flexDirection: 'column',
          paddingLeft: '30px',
          paddingRight: '30px',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '10px',
          }}
        >
          <TextField
            style={{ width: '66px', paddingRight: '5px' }}
            label="Calories"
            type="text"
            name="dailyCals"
            value={dailyGoals.dailyCals}
            placeholder=""
            className="small-textbox"
            onChange={handleInputChange}
            size="small"
          />
          <TextField
            style={{ width: '66px' }}
            label="Protein"
            type="text"
            name="dailyProt"
            value={dailyGoals.dailyProt}
            placeholder=""
            className="small-textbox"
            onChange={handleInputChange}
            size="small"
          />
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '10px',
          }}
        >
          <TextField
            style={{ width: '66px' }}
            label="Carbs"
            type="text"
            name="dailyCarb"
            value={dailyGoals.dailyCarb}
            placeholder=""
            className="small-textbox"
            onChange={handleInputChange}
            size="small"
          />
          <TextField
            style={{ width: '66px' }}
            label="Fats"
            type="text"
            name="dailyFats"
            value={dailyGoals.dailyFats}
            placeholder=""
            className="small-textbox"
            onChange={handleInputChange}
            size="small"
          />
        </div>
        <button
          style={{
            display: 'block',
            margin: '0 auto',
            fontSize: '14px',
            width: '180px',
            bottom: '6px',
          }}
          className="button-61"
          onClick={sendDailyGoals}
        >
          Update Daily Goals
        </button>
      </div>
    </div>
  );
};

export default UserProfile;