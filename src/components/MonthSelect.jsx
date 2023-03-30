import { Fragment, useState, useEffect } from "react";
import ChartData from "../data/ChartData";
import { uniqueValues, formatDate } from "../helpers";

function MonthSelect({ setMonth }) {
  // unique month values
  const months = ChartData.map((row) => {
    return formatDate(row.date, "month");
  }).filter(uniqueValues);

  // set selected month state
  const [selectedMonth, setSelectedMonth] = useState(months[0]);

  // selected month handler function
  const changeMonthHandler = (event) => {
    setSelectedMonth(event.target.value);
  };

  // update state in parent element if selected month has changed
  useEffect(() => {
    setMonth(selectedMonth);
  }, [setMonth, selectedMonth]);

  return (
    <Fragment id="month-select">
      <label htmlFor="month"></label>
      <select id="month" className="form-select" onChange={changeMonthHandler}>
        {months.map((month, index) => {
          return (
            <option key={month} value={month} selected={month === selectedMonth}>
              {month}
            </option>
          );
        })}
      </select>
    </Fragment>
  );
}

export default MonthSelect;
