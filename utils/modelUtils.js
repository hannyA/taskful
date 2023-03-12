module.exports.formatDate = (date) => {
  let d = date.getDate();
  let m = date.getMonth() + 1;
  let y = date.getFullYear();
  return `${m}/${d}/${y}`;
};
module.exports.formatTime = (date) => {
  let h = date.getHours() % 12;
  let end = date.getHours() >= 12 ? "pm" : "am";
  let min = date.getMinutes();
  min = min < 10 ? `0${min}` : min;
  return `${h}:${min}${end}`;
};
