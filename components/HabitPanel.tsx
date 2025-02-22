import React from "react";
import { View, StyleSheet, Text } from "react-native";
import { Card, Title, Paragraph } from "react-native-paper";
import { Habit } from "../utils/types";

interface HabitPanelProps {
  habit: Habit;
}

const HabitPanel: React.FC<HabitPanelProps> = ({ habit }) => {
  return (
    <Card style={styles.card}>
      <Card.Content>
        <Title>{habit.title}</Title>
        <Paragraph>{habit.description}</Paragraph>
        <Paragraph>
          <Text style={styles.bold}>Start Date:</Text> {habit.startDate}
        </Paragraph>
        <Paragraph>
          <Text style={styles.bold}>End Date:</Text> {habit.endDate}
        </Paragraph>
        <Paragraph>
          <Text style={styles.bold}>Start Time:</Text> {habit.startTime}
        </Paragraph>
        <Paragraph>
          <Text style={styles.bold}>End Time:</Text> {habit.endTime}
        </Paragraph>
        <Paragraph>
          <Text style={styles.bold}>Streaks:</Text> {habit.streaks.join(", ")}
        </Paragraph>
        <Paragraph>
          <Text style={styles.bold}>Privacy:</Text> {habit.privacy}
        </Paragraph>
      </Card.Content>
    </Card>
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

export default HabitPanel;
