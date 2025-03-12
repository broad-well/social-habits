import { Stack } from "expo-router";
import React from "react";

export default function FriendLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="friend-list" options={{ headerShown: false }} />
      <Stack.Screen name="add-friend" options={{ headerShown: false }} />
    </Stack>
  );
}
