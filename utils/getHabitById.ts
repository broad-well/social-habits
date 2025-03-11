import { Habit } from "./service";
import habitData from "@/assets/data/habits_by_id.json";

// Function to fetch habit data by ID
function getHabitById(id: string): Habit {
  // Implement data fetching logic
  return habitData[id as keyof typeof habitData] as unknown as Habit; // Placeholder data
}

export default getHabitById;
