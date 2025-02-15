import { Text, View, StyleSheet } from "react-native";
import { Button, TextInput, IconButton, Portal, Modal, Text as PaperText } from "react-native-paper";
import {
  MD3LightTheme as DefaultTheme,
  PaperProvider,
} from "react-native-paper";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import { useFonts } from "expo-font";
import DarkThemeColors from "../../constants/DarkThemeColors.json";
import LightThemeColors from "../../constants/LightThemeColors.json";
import { useColorTheme } from "../../stores/useColorTheme";
import { Link, Stack } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/backend/firebaseConfig";
import { modalStyle } from "@/components/modalStyle";

export default function SignIn() {
  const screenOptions = {
    headerShown: false,
  };

  const [loaded] = useFonts({
    Poppins: require("../../assets/fonts/Poppins/Poppins-Regular.ttf"),
    PoppinsBold: require("../../assets/fonts/Poppins/Poppins-Bold.ttf"),
  });

  const { colorTheme } = useColorTheme();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resetState = () => {
    setUsername("");
    setPassword("");
    setPasswordVisible(false);
    setError(null);
  }

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

  const handleSignIn = async () => {
    try {
      const cred = await signInWithEmailAndPassword(auth, username + "@ucsd.edu", password);
      if (!cred.user.emailVerified) {
        throw new Error("You must verify your email before using this app! Please check your inbox.");
      }
      
    } catch (fail) {
      setError(`${fail}`);
    }
  };

  return (
    <PaperProvider theme={theme}>
      <Stack.Screen options={screenOptions} />
      <View
        style={[styles.container, { backgroundColor: theme.colors.primary }]}
      >
        <Text style={[styles.title, { color: theme.colors.onPrimary }]}>
          Sign In to Cohabit
        </Text>
        <View style={styles.inputContainer}>
          <TextInput
            mode="outlined"
            label="Username"
            value={username}
            onChangeText={setUsername}
            style={styles.input}
            placeholder="Enter your username"
            placeholderTextColor={theme.colors.onBackground}
            right={<TextInput.Affix text="@ucsd.edu" />}
          />
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            mode="outlined"
            label="Password"
            value={password}
            onChangeText={setPassword}
            style={styles.input}
            placeholder="Enter your password"
            placeholderTextColor={theme.colors.onBackground}
            secureTextEntry={!passwordVisible}
            right={
              <TextInput.Icon
                icon={passwordVisible ? "eye" : "eye-off"}
                onPress={() => setPasswordVisible(!passwordVisible)}
              />
            }
          />
        </View>
        <Button
          icon="login"
          mode="contained"
          onPress={handleSignIn}
          style={[styles.button, { backgroundColor: theme.colors.onPrimary }]}
          labelStyle={styles.buttonLabel}
        >
          Sign In
        </Button>
        <View style={styles.signupContainer}>
          <Text style={{ color: theme.colors.onPrimary }}>
            Don't have an account?{" "}
            <Link
              href="/account/sign-up"
              style={[styles.signupLink, { color: theme.colors.onPrimary }]}
            >
              Sign Up!
            </Link>
          </Text>
        </View>
      </View>
      <Portal>
        <Modal
          visible={error !== null}
          contentContainerStyle={modalStyle.modal}
          onDismiss={() => {
            resetState();
          }}
        >
          <PaperText variant="titleMedium">Sign-In Failed</PaperText>
          <PaperText>
            {error}
          </PaperText>
        </Modal>
      </Portal>
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
