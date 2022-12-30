// Define fetch
class EasyHTTP {
  // GET request
  async get(url) {
    const response = await fetch(url);
    const resData = await response.json();
    return resData;
  }
}

const http = new EasyHTTP();

// Define UI variables
const btn1 = document.querySelector("#vbtn-radio1");

// Load all event listeners
loadEventListeners();

// Load all event listeners function
function loadEventListeners() {
  //   Add task event
  btn1.addEventListener("click", buildMonthlyFilteredChart);
}

// Build monthly filtered chart
function buildMonthlyFilteredChart() {
  // Select main div
  const mainDiv = document.querySelector("#main-div");

  // Add dsiposable div
  const dispDiv = document.createElement("div");
  dispDiv.setAttribute("id", "disposable");

  const newCanvas = document.createElement("canvas");
  newCanvas.setAttribute("id", "main-chart");

  // Append option to list
  dispDiv.appendChild(newCanvas);
  mainDiv.appendChild(dispDiv);

  http
    .get("./office-data.json")
    .then((data) => {
      monthlyFilteredChart(JSON.parse(data));
    })
    .catch((err) => console.log(err));
}
