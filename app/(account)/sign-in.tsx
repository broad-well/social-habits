
import { Text, View, StyleSheet } from "react-native";
import {
  Button,
  TextInput,
  Portal,
  Modal,
  Text as PaperText,
} from "react-native-paper";
import {
  MD3LightTheme as DefaultTheme,
  PaperProvider,
} from "react-native-paper";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect, useState } from "react";
import { useFonts } from "expo-font";
import DarkThemeColors from "@/constants/DarkThemeColors.json";
import LightThemeColors from "@/constants/LightThemeColors.json";
import { useColorTheme } from "@/stores/useColorTheme";
import { Link, router, Stack } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/config/firebaseConfig";
import { modalStyle } from "@/components/modalStyle";
import { FirebaseError } from "firebase/app";

export function formatError(error: FirebaseError) {
  switch (error.code) {
    case "auth/invalid-credential":
      return "Entered credentials do not match an existing user";
    case "auth/invalid-email":
      return "Please enter a valid email address";
    case "auth/user-disabled":
      return "This account has been disabled";
    case "auth/user-not-found":
      return "No account found with these credentials";
    case "auth/wrong-password":
      return "Incorrect password";
    case "auth/too-many-requests":
      return "Too many failed attempts. Please try again later";
    default:
      return error.message;
  }
}

export default function SignIn() {
  const screenOptions = {
    headerShown: false,
  };

  const [loaded] = useFonts({
    Poppins: require("../../assets/fonts/Poppins/Poppins-Regular.ttf"),  // eslint-disable-line
    PoppinsBold: require("../../assets/fonts/Poppins/Poppins-Bold.ttf"), // eslint-disable-line
  });

  const { colorTheme } = useColorTheme();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [error, setError] = useState<unknown | null>(null);
  const [isLoading, setIsLoading] = useState(false);

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

  const validateInputs = () => {
    if (!username.trim()) {
      setError(new Error("Please enter your username"));
      return false;
    }
    if (!password.trim()) {
      setError(new Error("Please enter your password"));
      return false;
    }
    return true;
  };

  const handleSignIn = async () => {
    if (!validateInputs()) return;

    try {
      
      setIsLoading(true);
      setError(null);

      const cred = await signInWithEmailAndPassword(
        auth,
        username + "@ucsd.edu",
        password
      );
      if (!cred.user.emailVerified) {
        throw new Error(
          "You must verify your email before using this app! Please check your inbox."
        );
      }

      router.replace("/");
      
    } catch (fail) {
      setError(fail);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    /* eslint-disable react/no-unescaped-entities */
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
            onChangeText={(text) => {
              setUsername(text);
              setError(null);
            }}
            inputMode="text"
            style={styles.input}
            placeholder="Enter your username"
            placeholderTextColor={theme.colors.onBackground}
            right={<TextInput.Affix text="@ucsd.edu" />}
            textContentType="username"
            autoCapitalize="none"
            disabled={isLoading}
          />
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            mode="outlined"
            label="Password"
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              setError(null);
            }}
            style={styles.input}
            placeholder="Enter your password"
            passwordRules="minlength: 6; required: lower; required: digit;"
            placeholderTextColor={theme.colors.onBackground}
            secureTextEntry={!passwordVisible}
            right={
              <TextInput.Icon
                icon={passwordVisible ? "eye" : "eye-off"}
                onPress={() => setPasswordVisible(!passwordVisible)}
                disabled={isLoading}
                accessibilityLabel="password-visibility-toggle"
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
          loading={isLoading}
          disabled={isLoading}
        >
          {isLoading ? "Signing In..." : "Sign In"}
        </Button>
        <View style={styles.signupContainer}>
          <Text style={{ color: theme.colors.onPrimary }}>
            Don't have an account?{" "}
            <Link
              href="/(account)/sign-up"
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
          onDismiss={() => setError(null)}
          contentContainerStyle={modalStyle.modal}
        >
          <PaperText variant="titleMedium">Sign-In Failed</PaperText>
          <PaperText style={styles.errorText}>
            {error instanceof FirebaseError ? formatError(error) : `${error}`}
          </PaperText>
          <Button onPress={() => setError(null)} style={styles.modalButton}>
            OK
          </Button>
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
  errorText: {
    marginVertical: 10,
    textAlign: 'center',
  },
  modalButton: {
    marginTop: 10,
  },
});