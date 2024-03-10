import Meal from './Meal';

interface MealsByDate {
    [date: string]: {
      [period: string]: Meal[];} &{
      total: {
        calories: number;
        protein: number;
        fat: number;
        carbs: number;
      };
    };
  }

export default MealsByDate;