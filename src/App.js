import "./App.css";
import ChartCanvas from "./components/ChartCanvas";
import MonthSelect from "./components/MonthSelect";
import { useState } from "react";

function App() {
  const [selectedMonth, setSelectedMonth] = useState("January 2021");

  return (
    <div className="App container-md">
      <div className="row">
        <h6 id="title" className="display-6 text-center">
          The daily occupancy in 4 US city offices
        </h6>
        <div className="card">
          <div className="col align-self-center">
            <MonthSelect setMonth={setSelectedMonth} />
          </div>

          <ChartCanvas month={selectedMonth} />
        </div>
      </div>
    </div>
  );
}

export default App;
