import React, { useState } from 'react';
import { TextField, MenuItem } from '@mui/material';

export const CalorieCalculator: React.FC = () => {
  const [gender, setGender] = useState<string>('');
  const [age, setAge] = useState<number>(0);
  const [weight, setWeight] = useState<number>(0);
  const [activityLevel, setActivityLevel] = useState<string>('');

  const calculateCalories = () => {
    let bmr = 0;
    if (gender === 'male') {
      bmr = 88.362 + (13.397 * weight) + (4.799 * age) - (5.677 * age);
    } else if (gender === 'female') {
      bmr = 447.593 + (9.247 * weight) + (3.098 * age) - (4.330 * age);
    }

    let maintenanceCalories = 0;
    
    switch (activityLevel) {
      case 'sedentary':
        maintenanceCalories = bmr * 1.2;
        break;
      case 'lightly-active':
        maintenanceCalories = bmr * 1.375;
        break;
      case 'moderately-active':
        maintenanceCalories = bmr * 1.55;
        break;
      case 'very-active':
        maintenanceCalories = bmr * 1.725;
        break;
      case 'extra-active':
        maintenanceCalories = bmr * 1.9;
        break;
      default:
        break;
    }

    const losingWeightCalories = maintenanceCalories - 500;

    return {
      maintenanceCalories: Math.round(maintenanceCalories),
      losingWeightCalories: Math.round(losingWeightCalories),
    };
  };

  const { maintenanceCalories, losingWeightCalories } = calculateCalories();

  return (
    <div className='meal-planner-box' style={{minHeight:'450px'}}>
      <h2>Calorie Calculator</h2>
      <div>
        <TextField
          select
          label="Gender"
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          variant="outlined"
          fullWidth
          sx={{ marginBottom: '16px' }}
        >
          <MenuItem value="">Select</MenuItem>
          <MenuItem value="male">Male</MenuItem>
          <MenuItem value="female">Female</MenuItem>
        </TextField>
      </div>
      <div>
        <TextField
          label="Age"
          type="number"
          value={age}
          onChange={(e) => setAge(Number(e.target.value))}
          variant="outlined"
          fullWidth
          sx={{ marginBottom: '16px' }}
          placeholder=''
        />
      </div>
      <div>
        <TextField
          label="Weight (kg)"
          type="number"
          value={weight}
          onChange={(e) => setWeight(Number(e.target.value))}
          variant="outlined"
          fullWidth
          sx={{ marginBottom: '16px' }}
        />
      </div>
      <div>
        <TextField
          select
          label="Activity Level"
          value={activityLevel}
          onChange={(e) => setActivityLevel(e.target.value)}
          variant="outlined"
          fullWidth
          sx={{ marginBottom: '16px' }}
        >
          <MenuItem value="">Select</MenuItem>
          <MenuItem value="sedentary">Sedentary</MenuItem>
          <MenuItem value="lightly-active">Lightly Active</MenuItem>
          <MenuItem value="moderately-active">Moderately Active</MenuItem>
          <MenuItem value="very-active">Very Active</MenuItem>
          <MenuItem value="extra-active">Extra Active</MenuItem>
        </TextField>
      </div>
      <div>
        <h3>Results:</h3>
        <p>Calories for Maintaining Weight: {maintenanceCalories}</p>
        <p>Calories for Losing Weight: {losingWeightCalories}</p>
      </div>
    </div>
  );
};