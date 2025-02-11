import { Text, View } from "react-native";
import { Button } from "react-native-paper";
import {
  MD3LightTheme as DefaultTheme,
  PaperProvider,
} from "react-native-paper";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { useFonts } from "expo-font";
import DarkThemeColors from "../constants/DarkThemeColors.json";
import LightThemeColors from "../constants/LightThemeColors.json";
import { useColorTheme } from "../stores/useColorTheme";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function Index() {
  const [loaded] = useFonts({
    Poppins: require("../assets/fonts/Poppins/Poppins-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }
  const { colorTheme, toggleTheme } = useColorTheme();

  const theme = {
    ...DefaultTheme,
    colors:
      colorTheme === "light" ? LightThemeColors.colors : DarkThemeColors.colors,
  };

  return (
    <PaperProvider theme={theme}>
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: theme.colors.primary,
        }}
      >
        <Text>Use the button below to toggle the theme:</Text>
        <Button icon="camera" mode="contained" onPress={toggleTheme}>
          Toggle Theme
        </Button>
      </View>
    </PaperProvider>
  );
}
