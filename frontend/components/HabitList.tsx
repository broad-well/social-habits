import React from "react";
import { FlatList, StyleSheet } from "react-native";
import HabitPanel from "@/components/HabitPanel";
import { LocalHabit } from "@/utils/habitStore";

type HabitListProps = {
  habits: LocalHabit[];
};

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

const styles = StyleSheet.create({
  listContainer: {
    width: "90%",
    alignSelf: "center",
    paddingBottom: 130,
  },
});

export default HabitList;
