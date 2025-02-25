import { Stack } from "expo-router";
import React from "react";

export default function HabitLayout() {
  const screenOptions = {
    headerShown: false,
  };

  return (
    <>
      <Stack.Screen options={screenOptions} />
      <Stack />
    </>
  );
}
