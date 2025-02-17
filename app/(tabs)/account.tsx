import { Text, View, StyleSheet } from "react-native";
import { Button, TextInput, IconButton } from "react-native-paper";
import {
  MD3LightTheme as DefaultTheme,
  PaperProvider,
} from "react-native-paper";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { useFonts } from "expo-font";
import DarkThemeColors from "../../constants/DarkThemeColors.json";
import LightThemeColors from "../../constants/LightThemeColors.json";
import { useColorTheme } from "../../stores/useColorTheme";
import { Stack } from "expo-router";

export default function Account() {
  const [loaded] = useFonts({
    Poppins: require("../../assets/fonts/Poppins/Poppins-Regular.ttf"),
    PoppinsBold: require("../../assets/fonts/Poppins/Poppins-Bold.ttf"),
  });

  const { colorTheme } = useColorTheme();

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  const theme = {
    ...DefaultTheme,
    colors:
      colorTheme === "light" ? LightThemeColors.colors : DarkThemeColors.colors,
  };

  return (
    <PaperProvider theme={theme}>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.container}>
        <Text>Account Page</Text>
      </View>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 30,
  },
  title: {
    fontSize: 26,
    fontFamily: "PoppinsBold",
    textAlign: "center",
    marginBottom: 30,
  },
  inputContainer: {
    width: "80%",
    marginBottom: 20,
  },
  input: {
    backgroundColor: "transparent",
    fontFamily: "Poppins",
  },
  button: {
    width: "80%",
    paddingVertical: 10,
    borderRadius: 8,
    elevation: 3,
    marginBottom: 20,
  },
  buttonLabel: {
    fontSize: 18,
    fontFamily: "Poppins",
    color: "#fff",
  },
  signupContainer: {
    marginTop: 10,
  },
  signupLink: {
    textDecorationLine: "underline",
    fontWeight: "bold",
  },
});
