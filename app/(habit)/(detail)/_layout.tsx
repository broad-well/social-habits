import { Stack } from "expo-router";
import React from "react";

export default function DetailLayout() {
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
