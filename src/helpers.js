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

export { formatDate, uniqueValues };
