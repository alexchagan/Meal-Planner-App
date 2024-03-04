import React from 'react';  
import { useNavigate } from 'react-router-dom';  
import SignIn from '../components/SignIn'  
import { Button } from '@mui/material'  
import '../css/MainPage.css'  
import logo from '../assets/logo.png'
import background from '../assets/background.jpg'
  
function MainPage() {  
  
    const navigate = useNavigate();  
  
    const goToMealPlanner = () => {  
        navigate('/mealplanner');  
    };    
  
    const goToCurrentMeals = () => {  
        navigate('/currentmeals');  
    };      
    // <button class="button-64" role="button"><span class="text">Button 64</span></button>
    return (  
        <div className="main-page" >  
            <img className='logo' src={logo}  alt="Logo" />  
               
                <button className="button-64" role="button"><span className="text" onClick={goToMealPlanner} >Add Meals 🍎</span></button>   
                <button className="button-64" role="button"><span className="text" onClick={goToCurrentMeals} >Weekly Meals 📅</span></button> 
             <div className='signin-container'>
            <SignIn/>  
            </div>
            
            <h1 className='btext' >Made by Alex Chagan</h1>
            
        </div>      
    );  
};  
  
export default MainPage; 