import { Habit } from "./types";
import habitData from "@/assets/data/habit_by_id.json";

// Function to fetch habit data by ID
function getHabitById(id: string): Habit {
  // Implement data fetching logic
  return habitData[id as keyof typeof habitData] as Habit; // Placeholder data
}

export default getHabitById;
