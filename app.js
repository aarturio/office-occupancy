// Define fetch
class EasyHTTP {
  // GET request
  async get(url) {
    const response = await fetch(url);
    const resData = await response.json();
    return resData;
  }
}

// Init local fetch
const http = new EasyHTTP();

// Define UI variables
const btn1 = document.querySelector("#vbtn-radio1");

// Load event listener
btn1.addEventListener("click", buildMonthlyFilteredChart);

// Build monthly filtered chart
function buildMonthlyFilteredChart() {
  http
    .get("./office-data.json")
    .then((data) => {
      monthlyFilteredChart(JSON.parse(data));
    })
    .catch((err) => console.log(err));
}

// Update monthly filtered chart
function changeMonthFilteredChart(e) {
  // Get month value
  const newMonth = document.querySelector("#month-group").value;

  // Update chart
  http
    .get("./office-data.json")
    .then((data) => {
      monthlyFilteredChart(JSON.parse(data), newMonth);
    })
    .catch((err) => console.log(err));
}

// Unique function
function uniqueValues(value, index, self) {
  return self.indexOf(value) === index;
}

// Monthly filtered data processor
function monthData(data, selectMonth) {
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

  // Datasets
  const dataATL = {
    label: "Atlanta",
    borderColor: "#4dc9f6",
    backgroundColor: "#4dc9f6",
    tension: 0.1,
    pointRadius: 0,
    borderWidth: 2,
    data: [],
  };

  const dataBOS = {
    label: "Boston",
    borderColor: "#f67019",
    backgroundColor: "#f67019",
    tension: 0.1,
    pointRadius: 0,
    borderWidth: 2,
    data: [],
  };

  const dataPOR = {
    label: "Portand",
    borderColor: "#f53794",
    backgroundColor: "#f53794",
    tension: 0.1,
    pointRadius: 0,
    borderWidth: 2,
    data: [],
  };

  const dataSEA = {
    label: "Seattle",
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

  return [dataATL, dataBOS, dataPOR, dataSEA];
}

// Monthly filtered chart
function monthlyFilteredChart(data, selectedMonth) {
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

    if (month === selectedMonth) {
      option.setAttribute("selected", "selected");
    }
    // Append option to list
    monthList.appendChild(option);
  });

  // Add event listener
  document.querySelector("#month-group").addEventListener("change", changeMonthFilteredChart);

  // Set month to filter data to
  const filteredMonth = selectedMonth === undefined ? months[0] : selectedMonth;

  const monthlyChart = document.getElementById("main-chart").getContext("2d");

  new Chart(monthlyChart, {
    type: "line",
    data: {
      datasets: monthData(data, filteredMonth),
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
