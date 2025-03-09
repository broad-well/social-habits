import React from "react";
import { FlatList, StyleSheet } from "react-native";
import { Habit } from "@/utils/service";
import HabitPanel from "@/components/HabitPanel";

// Define the props for the HabitList component
type HabitListProps = {
  habits: Habit[];
};

// Define the HabitList component
const HabitList: React.FC<HabitListProps> = ({ habits }) => {
  return (
    <FlatList
      data={habits}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <HabitPanel habit={item} />}
      contentContainerStyle={styles.listContainer}
    />
  );
};

// Define styles
const styles = StyleSheet.create({
  listContainer: {
    width: "90%",
    alignSelf: "center",
    paddingBottom: 130,
  },
});

export default HabitList;
