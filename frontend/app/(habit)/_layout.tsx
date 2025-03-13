import { Stack } from "expo-router";
import React from "react";

export default function HabitLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="new-habit" options={{ headerShown: false }} />
    </Stack>
  );
}
