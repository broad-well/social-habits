import React from "react";
import { Stack } from "expo-router";

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
