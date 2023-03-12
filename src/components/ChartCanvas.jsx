import { useState, useEffect } from "react";
import { uniqueValues, formatDate, City, drawChart } from "../helpers";
import { Chart, Colors } from "chart.js/auto";
import ChartData from "../data/ChartData";

function ChartCanvas() {
  const [month, setMonth] = useState("January 2021");
  useEffect(() => {
    const targetDate = formatDate(month, "month");

    const filteredData = ChartData.filter((row) => {
      return formatDate(row.date, "month") === targetDate;
    });

    const cities = ["Atlanta", "Boston", "Portland", "Seattle"];
    const cityProps = {};

    cities.forEach((city) => {
      cityProps[city] = new City(city);
    });

    filteredData.forEach((row, index) => {
      for (let city of cities) {
        const formattedDate = formatDate(row.date, "day");
        cityProps[city]._data = {
          x: formattedDate,
          y: row[city],
        };
      }
    });

    // Delete disposable div
    if (document.querySelector("#main-chart") !== null) {
      document.querySelector("#main-chart").remove();
    }
    // Select main div
    const mainDiv = document.querySelector("#main-div");

    // Add canvas
    const newCanvas = document.createElement("canvas");
    newCanvas.setAttribute("id", "main-chart");
    mainDiv.appendChild(newCanvas);

    // Month and year labels
    const months = ChartData.map((row) => {
      return formatDate(row.date, "month");
    }).filter(uniqueValues);

    // Get dropdown div
    const monthList = document.querySelector("#month-group");
    monthList.innerHTML = "";

    // Add months to filter
    months.forEach((element) => {
      // Create option element
      const option = document.createElement("option");

      // Add value
      option.value = element;

      // Add label
      option.innerHTML = element;

      // Append option to list
      monthList.appendChild(option);
    });

    // Chart
    const monthlyChart = newCanvas.getContext("2d");

    drawChart(monthlyChart, Object.values(cityProps));
  }, [month]);

  const handleSelect = (e) => {
    e.preventDefault();
    setMonth(e.target.value);
  };

  return (
    <div id="main-div">
      <div id="month">
        <label htmlFor="month-group"></label>
        <select id="month-group" onChange={handleSelect} value={month}></select>
      </div>
    </div>
  );
}

export default ChartCanvas;
