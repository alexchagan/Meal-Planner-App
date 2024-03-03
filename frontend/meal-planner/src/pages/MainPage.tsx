import React from 'react';
import { useNavigate } from 'react-router-dom';
import SignIn from '../components/SignIn'
import { Button } from '@mui/material'

function MainPage() {

    const navigate = useNavigate();

    const goToMealPlanner = () => {
        navigate('/mealplanner');
        };    

    return (
        <div>
        <h1>Main Page</h1>
        <Button onClick={goToMealPlanner}>Go to Meal Planner</Button>
        <SignIn/>
        </div>
                
    );
};

export default MainPage;
