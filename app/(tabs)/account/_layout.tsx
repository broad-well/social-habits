import { Stack } from "expo-router/stack";
import React from "react";

export default function AccountLayout() {
  return (
    <Stack screenOptions={{headerShown: false}}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="friends" options={{ title: "Friends" }} />
      <Stack.Screen name="add-friend" options={{ title: "Add Friend" }} />
    </Stack>
  );
}
