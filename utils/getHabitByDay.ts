// TODO: In the future, this will be replaced with a call to the database
export const getHabitByDay = (date: string) => {
  const habits = require("@/assets/data/habits_by_day.json");
  // if the date is not in the habits object, return an empty array
  return habits[date] || [];
};
