import { addDays } from 'date-fns';
import MealPeriods from '../interfaces/MealPeriods';

export const formatMealPeriodData = (
  selectedDate: Date,
  mealPeriods: MealPeriods
) => {
  const selectedDatePlusOneDay = addDays(selectedDate, 1);
  return {
    date: selectedDatePlusOneDay,
    morning: mealPeriods.morning.map(item => [
      item.food
    ]),
    afternoon: mealPeriods.afternoon.map(item => [
      item.food
    ]),
    evening: mealPeriods.evening.map(item => [
      item.food
    ])
  };
};