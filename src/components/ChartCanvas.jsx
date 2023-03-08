import React from "react";
import { useState, useEffect } from "react";
import Chart from "chart.js/auto";
import ChartData from "./ChartData";
import { uniqueValues, formatDate } from "../helpers";

function ChartCanvas() {
  const [month, setMonth] = useState("January 2021");
  useEffect(() => {
    const targetDate = formatDate(month, "month");

    const filteredData = ChartData.filter((row) => {
      return formatDate(row.date, "month") === targetDate;
    });

    // City object
    const cityProps = {
      Atlanta: {
        label: "Atlanta",
        borderColor: "#34568B",
        backgroundColor: "#34568B",
        data: [],
        tension: 0.1,
        pointRadius: 0,
        borderWidth: 2,
      },
      Boston: {
        label: "Boston",
        borderColor: "#FF6F61",
        backgroundColor: "#FF6F61",
        data: [],
        tension: 0.1,
        pointRadius: 0,
        borderWidth: 2,
      },
      Portland: {
        label: "Portland",
        borderColor: "#6B5B95",
        backgroundColor: "#6B5B95",
        data: [],
        tension: 0.1,
        pointRadius: 0,
        borderWidth: 2,
      },
      Seattle: {
        label: "Seattle",
        borderColor: "#88B04B",
        backgroundColor: "#88B04B",
        data: [],
        tension: 0.1,
        pointRadius: 0,
        borderWidth: 2,
      },
    };

    const cities = Object.keys(cityProps);
    filteredData.forEach((row) => {
      for (let city of cities) {
        const formattedDate = formatDate(row.date, "day");
        cityProps[city].data.push({
          x: formattedDate,
          y: row[city],
        });
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

    new Chart(monthlyChart, {
      type: "line",
      data: {
        datasets: Object.values(cityProps),
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
          },
        },
        plugins: {
          legend: {
            position: "top",
          },
          title: {
            display: true,
            text: `Daily Occupancy:`,
          },
        },
      },
    });
  }, [month]);

  const handleSelect = (e) => {
    e.preventDefault();
    setMonth(e.target.value);
  };

  return (
    <div id="main-div">
      <div id="month">
        <label htmlFor="month-group">Month</label>
        <select id="month-group" onChange={handleSelect} value={month}></select>
      </div>
    </div>
  );
}

export default ChartCanvas;
