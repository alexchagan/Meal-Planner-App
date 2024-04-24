import {endOfWeek, isWithinInterval, startOfWeek} from "date-fns";
import { Row, RowProps} from "react-day-picker";

export function CurrentWeekRow(props: RowProps) {
    const isDateInCurrentWeek = (dateToCheck: Date) => {
      const today = new Date();
      const start = startOfWeek(today);
      const end = endOfWeek(today);
      return isWithinInterval(dateToCheck, { start, end });
    };
    const isNotCurrentWeek = props.dates.every((date) => !isDateInCurrentWeek(date));
    if (isNotCurrentWeek) return <></>;
    return <Row {...props} />;
}