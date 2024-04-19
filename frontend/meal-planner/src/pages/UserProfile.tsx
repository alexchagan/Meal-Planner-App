import React, { useState, useEffect } from 'react';
import { TextField } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import { stringify } from 'querystring';

const UserProfile = () => {
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    daily_cals: 0,
    daily_prot: 0,
    daily_carb: 0,
    daily_fats: 0,
    picture: ''
  });
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogContent, setDialogContent] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('http://127.0.0.1:5000/send_user_info', {
          credentials: 'include',
          method: 'GET',
        });
        if (response.ok) {
          const data = await response.json();
          console.log(data)
          setUserData(data);
        } else {
          console.error('Failed to fetch user data from the backend');
        }
      } catch (error) {
        console.error('Error fetching user data from the backend:', error);
      }
    };

    fetchUserData();
  }, []);

  const sendDailyGoals = async () => {
    try {
      const data = {
        calories: userData.daily_cals,
        protein: userData.daily_prot,
        carbs: userData.daily_carb,
        fats: userData.daily_fats,
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

  const openMessageDialog = (content: string) => {
    setDialogContent(content);
    setOpenDialog(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numericValue = Number(value);
    if (!isNaN(numericValue)) {
      setUserData(prevState => ({
        ...prevState,
        [name]: numericValue,
      }));
    }
  };

  return (
    <div>
      <div>
      {userData ? (
        <div style={{marginLeft:'40px', marginBottom:'20px', paddingTop:'40px'}}>
          <h2>{userData.name}</h2>
          <img
              src={userData.picture}
              alt={"Profile Image"}
              style={{
                position:'relative',
                width: '100px',
                height: '100px',
                borderRadius: '100%',
                marginTop: '10px',
                left: '15px'
              }}
            />
        </div>
      ) : (
        <p>Loading user data...</p>
      )}
      
      <div 
        className="box"
        style={{
          display: 'flex',
          flexDirection: 'column',
          paddingRight: '0px',
          paddingLeft: '0px',
          width: '200px',
          marginLeft: '0px',
          marginTop: '50px'
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            marginBottom: '10px',
          }}
        >
          <TextField
            style={{ width: '66px', paddingRight: '5px' }}
            label="Calories"
            type="text"
            name="daily_cals"
            value={userData.daily_cals}
            placeholder=""
            className="small-textbox"
            onChange={handleInputChange}
            size="small"
          />
          <TextField
            style={{ width: '66px' }}
            label="Protein"
            type="text"
            name="daily_prot"
            value={userData.daily_prot}
            placeholder=""
            className="small-textbox"
            onChange={handleInputChange}
            size="small"
          />
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            marginBottom: '10px',
          }}
        >
          <TextField
            style={{ width: '66px', paddingRight: '5px' }}
            label="Carbs"
            type="text"
            name="daily_carb"
            value={userData.daily_carb}
            placeholder=""
            className="small-textbox"
            onChange={handleInputChange}
            size="small"
          />
          <TextField
            style={{ width: '66px' }}
            label="Fats"
            type="text"
            name="daily_fats"
            value={userData.daily_fats}
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

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogContent>{dialogContent}</DialogContent>
        <DialogActions>
          <button onClick={() => setOpenDialog(false)}>Close</button>
        </DialogActions>
      </Dialog>
      </div>
    </div>
  );
};

export default UserProfile;