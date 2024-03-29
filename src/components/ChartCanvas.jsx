import { Fragment, useEffect, useRef } from "react";
import { formatDate, City } from "../helpers";
import ChartData from "../data/ChartData";
import { Chart } from "chart.js/auto";

function ChartCanvas({ month }) {
  // canvas reference
  const canvasRef = useRef();

  // draw chart
  useEffect(() => {
    const filteredData = ChartData.filter((row) => {
      return formatDate(row.date, "month") === formatDate(month, "month");
    });

    const cities = ["Atlanta", "Boston", "Portland", "Seattle"];
    const cityProps = {};

    cities.forEach((city) => {
      cityProps[city] = new City(city);
    });

    filteredData.forEach((row) => {
      for (let city of cities) {
        const formattedDate = formatDate(row.date, "day");
        cityProps[city]._data = {
          x: formattedDate,
          y: row[city],
        };
      }
    });
    const ctx = canvasRef.current.getContext("2d");

    let newChart = null;

    newChart = new Chart(ctx, {
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
        },
      },
    });

    return () => {
      newChart.destroy();
    };
  }, [month]);

  return (
    <Fragment>
      <canvas id="chart" ref={canvasRef}></canvas>
    </Fragment>
  );
}

export default ChartCanvas;
