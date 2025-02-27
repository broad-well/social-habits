import { useColorTheme } from "@/stores/useColorTheme";
import { DefaultTheme, PaperProvider, Text, ActivityIndicator, Card, Button, Icon, MD3Colors, FAB, Searchbar, TextInput } from "react-native-paper";
import DarkThemeColors from "@/constants/DarkThemeColors.json";
import LightThemeColors from "@/constants/LightThemeColors.json";
import { StyleSheet, FlatList, Button as RNButton, View } from "react-native";
import React from "react";
import { useFonts } from "expo-font";
import { router, SplashScreen, Stack } from "expo-router";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";

interface FriendListItem {
  id: string;
  profileLogo?: string;
  name: string;
  // Future: Maybe summary stats for habit completion
}

export default function AddFriend() {
  const [loaded] = useFonts({
    Poppins: require("@/assets/fonts/Poppins/Poppins-Regular.ttf"),
    PoppinsBold: require("@/assets/fonts/Poppins/Poppins-Bold.ttf"),
  });

  React.useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }
  const { colorTheme } = useColorTheme();
  const tabBarHeight = useBottomTabBarHeight();

  const theme = {
    ...DefaultTheme,
    colors:
      colorTheme === "light" ? LightThemeColors.colors : DarkThemeColors.colors,
  };

  const stylesheet = StyleSheet.create({
    page: {
      backgroundColor: theme.colors.primaryContainer,
      padding: 20,
      height: '100%',
      fontFamily: "Poppins",
      display: 'flex',
      flexDirection: 'column',
      gap: 16,
    },
    bold: {
      fontFamily: "PoppinsBold",
    },
    poppins: {
      fontFamily: "Poppins",
    },
    searchBox: {
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
    }
  });

  const [query, setQuery] = React.useState<string>("");

  return <PaperProvider theme={theme}>
    <Stack.Screen options={{
      title: "Add friend",
    }} />
    <View style={stylesheet.page}>
      <View style={stylesheet.searchBox}>
        <TextInput
          label="Friend's email"
          value={query}
          onChangeText={setQuery}
          textContentType="username"
          right={<TextInput.Affix text="@ucsd.edu" />}
        />
        <Button icon="account-search" mode="contained">Search</Button>
      </View>
    </View>
  </PaperProvider>;
}