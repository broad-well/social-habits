import { Tabs } from "expo-router";
import React from "react";
import { Platform } from "react-native";
import { BottomTabNavigationOptions } from "@react-navigation/bottom-tabs";

import { HapticTab } from "@/components/HapticTab";
import { IconSymbol } from "@/components/ui/IconSymbol";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { useColorTheme } from "@/stores/useColorTheme";
import LightThemeColors from "@/constants/LightThemeColors.json";
import DarkThemeColors from "@/constants/DarkThemeColors.json";

export default function TabLayout() {
  const { colorTheme } = useColorTheme();

  const myOptions: BottomTabNavigationOptions = {
    headerShown: false,
    header: () => null,
    headerStyle: { height: 0 },
    tabBarActiveTintColor:
      colorTheme === "light"
        ? LightThemeColors.colors.onPrimary
        : DarkThemeColors.colors.onPrimary,
    tabBarButton: HapticTab,
    tabBarBackground: TabBarBackground,
    tabBarStyle: Platform.select({
      ios: {
        // Use a transparent background on iOS to show the blur effect
        position: "absolute",
      },
      default: {},
    }),
  };

  return (
    <Tabs screenOptions={myOptions}>
      <Tabs.Screen
        name="main"
        options={{
          title: "Home",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="house.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: "Account",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="person.fill" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
