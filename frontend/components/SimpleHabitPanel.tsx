import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { Card, Title, Paragraph } from "react-native-paper";
import { router } from "expo-router";
import { LocalHabit } from "@/utils/habitStore";

interface HabitPanelProps {
  habit: LocalHabit;
}

const SimpleHabitPanel: React.FC<HabitPanelProps> = ({ habit }) => {
  const handlePress = () => {
    router.push(`/(habit)/(simpledetail)/${habit.id}`);
  };

  return (
    <TouchableOpacity onPress={handlePress}>
      <Card style={styles.card}>
        <Card.Content>
          <Title>{habit.title}</Title>
          <Paragraph>{habit.description}</Paragraph>
          <Paragraph>
            <Text style={styles.bold}>Start Date:</Text> {new Date(habit.startDate).toLocaleDateString()}
          </Paragraph>
          <Paragraph>
            <Text style={styles.bold}>End Date:</Text> {new Date(habit.endDate).toLocaleDateString()}
          </Paragraph>
          <Paragraph>
            <Text style={styles.bold}>Reminder Time:</Text> {new Date(habit.reminderTime).toLocaleTimeString()}
          </Paragraph>
          <Paragraph>
            <Text style={styles.bold}>Streaks:</Text> {habit.streaks.join(", ")}
          </Paragraph>
          <Paragraph>
            <Text style={styles.bold}>Privacy:</Text> {habit.privacy}
          </Paragraph>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    margin: 10,
    padding: 10,
  },
  bold: {
    fontWeight: "bold",
  },
});

export default SimpleHabitPanel;
