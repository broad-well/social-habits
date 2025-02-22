export type Habit = {
  id: string;
  title: string;
  description: string | null;
  startDate: string | null;
  endDate: string | null;
  startTime: string | null;
  endTime: string | null;
  streaks: string[];
  privacy: string;
};
