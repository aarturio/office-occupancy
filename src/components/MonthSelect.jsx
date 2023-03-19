import ChartData from "../data/ChartData";
import { uniqueValues, formatDate } from "../helpers";

function MonthSelect({ setMonth }) {
  const months = ChartData.map((row) => {
    return formatDate(row.date, "month");
  }).filter(uniqueValues);

  const changeMonthHandler = (event) => {
    setMonth(event.target.value);
  };

  return (
    <div id="month-select">
      <label htmlFor="month"></label>
      <select id="month" className="form-select" onChange={changeMonthHandler}>
        {months.map((month) => {
          return (
            <option key={month} value={month}>
              {month}
            </option>
          );
        })}
      </select>
    </div>
  );
}

export default MonthSelect;
