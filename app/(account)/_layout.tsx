import { Stack } from "expo-router";
import React from "react";

export default function AccountLayout() {
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
