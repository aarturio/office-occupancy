// Monthly filtered chart
function monthlyFilteredChart(data) {
  if (document.querySelector("#disposable") !== null) {
    document.querySelector("#disposable").remove();
  }

  // Select main div
  const mainDiv = document.querySelector("#main-div");

  // Add dsiposable div
  const dispDiv = document.createElement("div");
  dispDiv.setAttribute("id", "disposable");

  // Add dropdown div
  const dropdownDiv = document.createElement("div");
  dropdownDiv.className = "input-group";
  dropdownDiv.setAttribute("id", "month");

  // Add label
  const label = document.createElement("label");
  label.className = "input-group-text";
  label.setAttribute("for", "month-group");
  label.innerText = "Month";
  dropdownDiv.appendChild(label);

  // Add select
  const select = document.createElement("select");
  select.className = "form-select";
  select.setAttribute("id", "month-group");
  select.setAttribute("onchange", "changeMonthFilteredChart()");
  dropdownDiv.appendChild(select);

  // Add canvas
  const newCanvas = document.createElement("canvas");
  newCanvas.setAttribute("id", "main-chart");

  // Append to main
  dispDiv.appendChild(dropdownDiv);
  dispDiv.appendChild(newCanvas);
  mainDiv.appendChild(dispDiv);

  // Unique function
  function uniqueValues(value, index, self) {
    return self.indexOf(value) === index;
  }

  // All month names
  let months = data
    .map((row) => {
      return new Date(row.date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
      });
    })
    .filter(uniqueValues);

  // Add months to filter
  months.forEach((month) => {
    // Get dropdown div
    const monthList = document.querySelector("#month-group");

    // Create option element
    const option = document.createElement("option");

    // Add value
    option.value = month;

    // Add label
    option.innerHTML = month;

    // Append option to list
    monthList.appendChild(option);
  });

  // Data processor
  function monthData(selectMonth) {
    const targetDate = new Date(selectMonth).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
    });

    const filteredData = data.filter((row) => {
      const tmpDate = new Date(row.date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
      });

      if (tmpDate === targetDate) {
        return row;
      }
    });

    console.log(filteredData);

    // Datasets
    const dataATL = {
      label: "ATL",
      borderColor: "#4dc9f6",
      backgroundColor: "#4dc9f6",
      tension: 0.1,
      pointRadius: 0,
      borderWidth: 2,
      data: [],
    };

    const dataBOS = {
      label: "BOS",
      borderColor: "#f67019",
      backgroundColor: "#f67019",
      tension: 0.1,
      pointRadius: 0,
      borderWidth: 2,
      data: [],
    };

    const dataPOR = {
      label: "POR",
      borderColor: "#f53794",
      backgroundColor: "#f53794",
      tension: 0.1,
      pointRadius: 0,
      borderWidth: 2,
      data: [],
    };

    const dataSEA = {
      label: "SEA",
      borderColor: "#537bc4",
      backgroundColor: "#537bc4",
      tension: 0.1,
      pointRadius: 0,
      borderWidth: 2,
      data: [],
    };

    filteredData.forEach((row) => {
      dataATL.data.push({
        x: new Date(row.date).toLocaleDateString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
        }),
        y: row.Atlanta,
      });
      dataBOS.data.push({
        x: new Date(row.date).toLocaleDateString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
        }),
        y: row.Boston,
      });
      dataPOR.data.push({
        x: new Date(row.date).toLocaleDateString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
        }),
        y: row.Portland,
      });
      dataSEA.data.push({
        x: new Date(row.date).toLocaleDateString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
        }),
        y: row.Seattle,
      });
    });

    console.log(dataATL);

    return [dataATL, dataBOS, dataPOR, dataSEA];
  }

  // Set month to filter data to
  const filteredMonth = months[0];

  const monthlyChart = document.getElementById("main-chart").getContext("2d");

  const monthlyLChart = new Chart(monthlyChart, {
    type: "line",
    data: {
      datasets: monthData((selectMonth = filteredMonth)),
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
          text: `Daily Occupancy: ${filteredMonth}`,
        },
      },
    },
  });
}
