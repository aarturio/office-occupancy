// Init local fetch
async function fetchData(url) {
  try {
    const response = await fetch(url);
    const resData = await response.json();
    return resData;
  } catch (error) {
    console.log(error);
  }
}

// Unique function
function uniqueValues(value, index, self) {
  return self.indexOf(value) === index;
}

// Define UI variables
const btn1 = document.querySelector("#vbtn-radio1");
const btn2 = document.querySelector("#vbtn-radio2");
const btn3 = document.querySelector("#vbtn-radio3");

// Load event listener
btn1.addEventListener("click", buildMonthlyFilteredChart);
btn2.addEventListener("click", buildmonthlyHistoricalChart);
btn3.addEventListener("click", buildMonthlyFilteredAverageChart);

// Build monthly filtered chart
buildMonthlyFilteredChart();

function buildMonthlyFilteredChart() {
  fetchData("./office-data.json")
    .then((data) => {
      monthlyFilteredChart(JSON.parse(data));
    })
    .catch((err) => console.log(err));
}

// Update monthly filtered chart
function changeMonthFilteredChart() {
  // Get month value
  const newMonth = document.querySelector("#month-group").value;

  // Update chart
  fetchData("./office-data.json")
    .then((data) => {
      monthlyFilteredChart(JSON.parse(data), newMonth);
    })
    .catch((err) => console.log(err));
}

// Build monthly historical chart
function buildmonthlyHistoricalChart() {
  fetchData("./office-data.json")
    .then((data) => {
      monthlyHistoricalChart(JSON.parse(data));
    })
    .catch((err) => console.log(err));
}

function buildMonthlyFilteredAverageChart() {
  fetchData("./office-data.json")
    .then((data) => {
      monthlyFilteredAverageChart(JSON.parse(data));
    })
    .catch((err) => console.log(err));
}

function changeMonthFilteredAveragehart() {
  // Get month value
  const newMonth = document.querySelector("#month-group").value;

  // Update chart
  fetchData("./office-data.json")
    .then((data) => {
      monthlyFilteredAverageChart(JSON.parse(data), newMonth);
    })
    .catch((err) => console.log(err));
}

// Create a date object from string
function formatDate(date, type) {
  if (type === "month")
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
    });
  else if (type === "day") {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  } else if (type === "weekday") {
    return new Date(date).toLocaleDateString("en-US", {
      weekday: "long",
    });
  }
}

// Monthly filtered data processor
function getMonthData(monthData, selectMonth) {
  const targetDate = formatDate(selectMonth, "month");

  const filteredData = monthData.filter((row) => {
    return formatDate(row.date, "month") === targetDate;
  });

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

  return Object.values(cityProps);
}

// Monthly filtered chart
function monthlyFilteredChart(monthData, selectMonth) {
  // Delete disposable div
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
  dropdownDiv.appendChild(select);

  // Add canvas
  const newCanvas = document.createElement("canvas");
  newCanvas.setAttribute("id", "main-chart");

  // Append to main
  dispDiv.appendChild(dropdownDiv);
  dispDiv.appendChild(newCanvas);
  mainDiv.appendChild(dispDiv);

  // Month and year labels
  const months = monthData
    .map((row) => {
      return formatDate(row.date, "month");
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

    if (month === selectMonth) {
      option.setAttribute("selected", "selected");
    }
    // Append option to list
    monthList.appendChild(option);
  });

  // Add event listener
  document.querySelector("#month-group").addEventListener("change", changeMonthFilteredChart);

  // Set month to filter data to
  const filteredMonth = selectMonth || months[0];

  const monthlyChart = document.getElementById("main-chart").getContext("2d");

  new Chart(monthlyChart, {
    type: "line",
    data: {
      datasets: getMonthData(monthData, filteredMonth),
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

// Historical monthly data processor
function getHistMonthData(histData) {
  // All month names
  const months = histData
    .map((row) => {
      return formatDate(row.date, "month");
    })
    .filter(uniqueValues);

  // Datasets for historic monthly chart
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

  histData.forEach((row) => {
    for (let city of cities) {
      const formattedDate = formatDate(row.date, "month");
      cityProps[city].data.push({
        x: formattedDate,
        y: row[city],
      });
    }
  });

  for (let city of cities) {
    cityProps[city].data = cityProps[city].data.reduce((acc, cur) => {
      if (acc[cur.x]) {
        acc[cur.x] += cur.y;
      } else {
        acc[cur.x] = cur.y;
      }
      return acc;
    }, {});
  }

  return Object.values(cityProps);
}

// Historical monthly chart
function monthlyHistoricalChart(histData) {
  // Delete disposable div
  if (document.querySelector("#disposable") !== null) {
    document.querySelector("#disposable").remove();
  }

  // Select main div
  const mainDiv = document.querySelector("#main-div");

  // Add dsiposable div
  const dispDiv = document.createElement("div");
  dispDiv.setAttribute("id", "disposable");

  // Add canvas
  const newCanvas = document.createElement("canvas");
  newCanvas.setAttribute("id", "main-chart");

  dispDiv.appendChild(newCanvas);
  mainDiv.appendChild(dispDiv);

  // All months
  let months = histData
    .map((row) => {
      return new Date(row.date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
      });
    })
    .filter(uniqueValues);

  // Historical monthly line chart
  const histMonthlyChart = document.querySelector("#main-chart").getContext("2d");

  new Chart(histMonthlyChart, {
    type: "line",
    data: {
      datasets: getHistMonthData(histData),
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
          text: "Historical Occupancy by Month",
        },
      },
    },
  });
}

// Monthly average data processor
function getMonthAverageData(monthData, selectMonth) {
  const targetDate = formatDate(selectMonth, "month");

  const filteredData = monthData.filter((row) => {
    return formatDate(row.date, "month") === targetDate;
  });

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
      const formattedDate = formatDate(row.date, "weekday");
      cityProps[city].data.push({
        x: formattedDate,
        y: row[city],
      });
    }
  });

  for (let city of cities) {
    cityProps[city].data = cityProps[city].data.reduce((acc, cur) => {
      if (acc[cur.x]) {
        acc[cur.x] = (acc[cur.x] + cur.y) / 4;
      } else {
        acc[cur.x] = cur.y / 4;
      }
      return acc;
    }, {});
  }

  return Object.values(cityProps);
}

// Monthly average chart
function monthlyFilteredAverageChart(monthData, selectMonth) {
  // Delete disposable div
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
  dropdownDiv.appendChild(select);

  // Add canvas
  const newCanvas = document.createElement("canvas");
  newCanvas.setAttribute("id", "main-chart");

  // Append to main
  dispDiv.appendChild(dropdownDiv);
  dispDiv.appendChild(newCanvas);
  mainDiv.appendChild(dispDiv);

  // Month and year labels
  const months = monthData
    .map((row) => {
      return formatDate(row.date, "month");
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

    if (month === selectMonth) {
      option.setAttribute("selected", "selected");
    }
    // Append option to list
    monthList.appendChild(option);
  });

  // Add event listener
  document.querySelector("#month-group").addEventListener("change", changeMonthFilteredAveragehart);

  // Set month to filter data to
  const filteredMonth = selectMonth || months[0];

  const monthlyChart = document.getElementById("main-chart").getContext("2d");

  new Chart(monthlyChart, {
    type: "line",
    data: {
      datasets: getMonthAverageData(monthData, filteredMonth),
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
