const utcDate = (date) => {
  let [year, month, day] = date.split("-").map(Number);
  month = month - 1;
  const utcDate = new Date(Date.UTC(year, month, day, 0, 0, 0));

  return utcDate;
};

module.exports = utcDate;
