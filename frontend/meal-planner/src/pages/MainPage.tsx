import React from 'react';
import { useNavigate } from 'react-router-dom';
import SignIn from '../components/SignIn';
import '../css/MainPage.css';
import '../css/Buttons.css';

function MainPage() {
  const navigate = useNavigate();

  const goToMealPlanner = () => {
    navigate('/mealplanner');
  };

  return (
    <div className="main-page">
         <div className='signin'>
      <SignIn/>
      </div>
      <div className="main-page-content-wrapper">
        
        <div className="main-page-content-container">
          <div className="main-page-phrase-container">
          <h1 className="main-page-phrase">
                <span>Nutrition Simplified</span>
                <span>Meal Planning Amplified</span>
          </h1>
          <p className="main-page-subtext">
            <span>Effortlessly plan your meals for the entire week,</span>
            <span>track your progress, and achieve your health goals</span>
            <span>with our intuitive nutrition companion.</span>
          </p>
          </div>
          <div className="main-page-button-container">
            <button className="button-64" role="button" onClick={goToMealPlanner}>
              <span className="text">Schedule Your Meals 🍎</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MainPage;