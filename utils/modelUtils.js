module.exports.formatDate = (date) => {
  let d = date.getDate();
  let m = date.getMonth() + 1;
  let y = date.getFullYear();
  return `${m}/${d}/${y}`;
};

module.exports.formatTime = (date) => {
  let hours = date.getHours();
  let end = hours >= 12 ? "pm" : "am";
  hours = hours % 12;
  hours = hours > 0 ? hours : 12;

  let minutes = date.getMinutes();
  minutes = minutes < 10 ? `0${minutes}` : minutes;
  return `${hours}:${minutes}${end}`;
};
