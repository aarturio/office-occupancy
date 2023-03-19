// Unique function
function uniqueValues(value, index, self) {
  return self.indexOf(value) === index;
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

class City {
  constructor(cityName) {
    this.label = cityName;
    this.data = [];
    this.tension = 0.1;
    this.pointRadius = 0;
    this.borderWidth = 2;
  }

  set _data(addData) {
    this.data.push(addData);
  }
}

export { formatDate, uniqueValues, City };
