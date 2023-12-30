const generateDays = (year, month) => {
  year = Number(year);
  month = Number(month);

  const oddMonths = [1, 3, 5, 7, 8, 10, 12];
  const evenMonths = [4, 6, 9, 11];
  const leapYears = [2024, 2028, 2032];

  const days = [];
  let quantity = 28;

  if (oddMonths.includes(month)) {
    quantity = 31;
  }
  if (evenMonths.includes(month)) {
    quantity = 30;
  }
  if (leapYears.includes(year) && month === 2) {
    quantity = 29;
  }

  for (let i = 1; i <= quantity + 1; i++) {
    days.push(i);
  }
  return days;
};

export default generateDays;
