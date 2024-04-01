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
      item.food, item.type, item.serving, item.calPer100g,
      item.proPer100g, item.carbPer100g, item.fatPer100g
    ]),
    afternoon: mealPeriods.afternoon.map(item => [
      item.food, item.type, item.serving, item.calPer100g,
      item.proPer100g, item.carbPer100g, item.fatPer100g
    ]),
    evening: mealPeriods.evening.map(item => [
      item.food, item.type, item.serving, item.calPer100g,
      item.proPer100g, item.carbPer100g, item.fatPer100g
    ])
  };
};