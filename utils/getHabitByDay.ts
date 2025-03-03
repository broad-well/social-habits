interface Habit {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  streaks: string[];
  privacy: string;
}

interface HabitsByDay {
  [date: string]: Habit[];
}

import habits from "@/assets/data/habits_by_day.json";

export const getHabitByDay = (date: string) => {
  return (habits as HabitsByDay)[date] || [];
};
