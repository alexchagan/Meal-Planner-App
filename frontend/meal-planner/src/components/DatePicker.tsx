import { useState } from "react";
import { DayPicker } from "react-day-picker";
import { startOfWeek } from "date-fns";
import { CurrentWeekRow } from "./CurrentWeekRow";

interface DatePickerProps {
  onDateChange: (date: Date) => void;
}

export function DatePicker({ onDateChange }: DatePickerProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(startOfWeek(new Date()));

  const handleDayClick = (day: Date) => {
    setSelectedDate(day);
    onDateChange(day); 
  };

  return (
    <div>
      <DayPicker
        className="meal-planner-box"
        components={{ Row: CurrentWeekRow }}
        showOutsideDays
        disableNavigation
        mode="single"
        onDayClick={handleDayClick}
        {...(selectedDate && { selected: selectedDate })}
      />
    </div>
  );
}