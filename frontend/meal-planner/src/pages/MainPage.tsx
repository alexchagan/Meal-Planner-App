import React from 'react';  
import { useNavigate } from 'react-router-dom';  
import SignIn from '../components/SignIn'    
import '../css/MainPage.css'  
import '../css/Buttons.css'  
import logo from '../assets/logo.png'

  
function MainPage() {  
  
    const navigate = useNavigate();  
  
    const goToMealPlanner = () => {  
        navigate('/mealplanner');  
    };    
  
    const goToCurrentMeals = () => {  
        navigate('/currentmeals');  
    };      
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