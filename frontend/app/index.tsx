import React from "react";
import { Image, Text, View, StyleSheet } from "react-native";
import {
  Button,
  MD3LightTheme as DefaultTheme,
  PaperProvider,
} from "react-native-paper";
import { useFonts } from "expo-font";
import DarkThemeColors from "@/constants/DarkThemeColors.json";
import LightThemeColors from "@/constants/LightThemeColors.json";
import { useColorTheme } from "@/stores/useColorTheme";
import { Link, router, Stack } from "expo-router";


export default function Index() {
  const screenOptions = {
    headerShown: false,
  };

  const [loaded] = useFonts({
    Poppins: require("../assets/fonts/Poppins/Poppins-Regular.ttf"), // eslint-disable-line
    PoppinsBold: require("../assets/fonts/Poppins/Poppins-Bold.ttf"), // eslint-disable-line
  });
  const { colorTheme } = useColorTheme();
  const theme = {
    ...DefaultTheme,
    colors:
      colorTheme === "light" ? LightThemeColors.colors : DarkThemeColors.colors,
  };

  return (
    /* eslint-disable react/no-unescaped-entities */
    <PaperProvider theme={theme}>
      <Stack.Screen options={screenOptions} />
      <View
        style={[
          styles.container,
          { backgroundColor: theme.colors.primaryContainer },
        ]}
      >
        <Image
          source={require("../assets/images/icon.png")} // eslint-disable-line
          style={styles.logo}
          resizeMode="contain"
        />
        <Text
          style={[styles.title, { color: theme.colors.onPrimaryContainer }]}
        >
          Welcome to Cohabit!
        </Text>
        <Button
          icon="login"
          mode="contained"
          onPress={() => router.push("/(account)/sign-in")}
          style={[
            styles.button,
            { backgroundColor: theme.colors.onPrimaryContainer },
          ]}
          labelStyle={styles.buttonLabel}
        >
          Sign In
        </Button>
        <View style={styles.signupContainer}>
          <Text style={{ color: theme.colors.onPrimaryContainer }}>
            Don't have an account?{" "}
            <Link
              href="/(account)/sign-up"
              style={[
                styles.signupLink,
                { color: theme.colors.onPrimaryContainer },
              ]}
            >
              Sign Up!
            </Link>
          </Text>
        </View>
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
  logo: {
    width: 150,
    height: 150,
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontFamily: "PoppinsBold",
    textAlign: "center",
    marginBottom: 40,
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
  link: {
    textDecorationLine: "none",
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
