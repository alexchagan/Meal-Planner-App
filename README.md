

[![LinkedIn][linkedin-shield]][linkedin-url]

<!-- PROJECT LOGO -->
<br />
<div align="center">
<img src=https://github.com/alexchagan/Meal-Planner-App/assets/44925899/4e21b983-6e6a-4971-b6d5-e7ce19e68f6c>
</div>

<!-- ABOUT THE PROJECT -->
## About The Project
Welcome to the Meal Planner App! <br />
This application allows users to create and manage their daily meal schedules for the current week. <br />
The application can send simple meal descriptions to a third-party API and get full nutrition values. <br />
The application provides a convenient way to plan and visualize meals for each day of the week. <br />

<div align="center">
<img src=https://github.com/alexchagan/Meal-Planner-App/assets/44925899/5bb981a6-0eea-4c44-a934-95832a35fa00>
</div>

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Key Features
* Google Account Integration: Users can easily log in to the app using their Google account credentials.
* Meal Planning: Users can create a daily meal schedule for the current week, specifying meals for morning, afternoon, and evening periods.
* Weekly Meal Overview: The app provides a table format to view the weekly meal schedule, making it easy for users to see their planned meals for each day.
* Database: Stores all user data and meal data for each week of each user.
* Third party API: A Nutrition API that converts simple meal description into full nutritional values.

<!-- GETTING STARTED -->
## Getting Started

### Installation


1. Clone the repo
   ```
   git clone https://github.com/alexchagan/Meal-Planner-App.git
   ```
2. Install frontend dependencies:
   ```
   cd frontend/meal-planner
   npm install
   npm run dev
   ```

3. Install backend dependencies:
   ```
   cd backend
   pip install -r requirements.txt
   python3 run.py
   ```
<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- USAGE EXAMPLES -->
## Usage

* Log In: Click on the "Log In with Google" button to log in to the app using your Google account.
* Create Meal Schedule: Once logged in, navigate to the meal planner section to create your daily meal schedule. Choose the day of the week and specify meals for morning, afternoon, and evening periods. Choose between Common and Custom options for meal description.
 <div align="center">
  <img src=https://github.com/alexchagan/Meal-Planner-App/assets/44925899/4b7ca843-a0ed-4219-ae80-a65d334f2815>
 </div>
   
* View Weekly Meals: To view your weekly meal schedule, navigate to the weekly meal overview section. You'll see a table format displaying your planned meals for each day of the week. And Total values for each day. 
 <div align="center">
  <img src=https://github.com/alexchagan/Meal-Planner-App/assets/44925899/2d2d37a6-74c4-4f6b-a4a3-d512b6dc266f>

 </div>

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Nutrition API
The Nutrition API extracts nutrition information from text using natural language processing.<br />
From food blogs to menus to recipes, it can read any text and calculate the corresponding nutrition data.<br />
An intelligent feature of this API is custom portioning: if your text specifies quantities of individual food items or ingredients, the algorithm will automatically scale the nutrition data in the result accordingly.
https://api-ninjas.com/api/nutrition
<p align="right">(<a href="#readme-top">back to top</a>)</p>


## Technologies Used 
* React.js: Frontend framework for building the user interface.
* Firebase Authentication: Used for user authentication with Google accounts.
* CSS: Styling the components and layout of the application.
* Flask: Backend framework for Users/Meals and database management.
* MySQL: Database for storing users and meals data.

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- CONTACT -->
## Contact

Alex Chagan  -- alexchagan95@gmail.com

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://www.linkedin.com/in/alex-chagan-a243221b6/
