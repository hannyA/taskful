Array.prototype.getCount = (priority) => {
  console.log(this);
  const obj = this.find((e) => e.priority === priority);
  if (obj) return obj.numProjects;
  return 0;
};

module.exports.getPriorityCount = (arr, priority) => {
  const obj = arr.find((e) => e.priority === priority);
  if (obj) return obj.count;
  return 0;
};

module.exports.getStatusCount = (arr, status) => {
  const obj = arr.find((e) => e.status === status);
  if (obj) return obj.count;
  return 0;
};
