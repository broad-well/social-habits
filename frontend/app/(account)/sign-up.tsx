import { Text, View, StyleSheet } from "react-native";
<<<<<<< HEAD:frontend/app/(account)/sign-up.tsx
import { Button, TextInput } from "react-native-paper";
=======
import { Button, TextInput, IconButton, Portal, Modal, Text as PaperText } from "react-native-paper";
>>>>>>> 94337bc9625342265c4f966796c1c3cce8cb9c6d:app/account/sign-up.tsx
import {
  MD3LightTheme as DefaultTheme,
  PaperProvider,
} from "react-native-paper";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import { useFonts } from "expo-font";
<<<<<<< HEAD:frontend/app/(account)/sign-up.tsx
import DarkThemeColors from "@/constants/DarkThemeColors.json";
import LightThemeColors from "@/constants/LightThemeColors.json";
import { useColorTheme } from "@/stores/useColorTheme";
import { Link, Stack } from "expo-router";
=======
import DarkThemeColors from "../../constants/DarkThemeColors.json";
import LightThemeColors from "../../constants/LightThemeColors.json";
import { useColorTheme } from "../../stores/useColorTheme";
import { Link, router, Stack } from "expo-router";
import { auth } from "@/backend/firebaseConfig";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { isEmailHandleValid } from "@/validation/account";
import { modalStyle } from "@/components/modalStyle";
import { FirebaseError } from "firebase/app";


type RegistrationOutcome = {
  type: 'success'
} | {
  type: 'error',
  error: Error,
};

export function formatErrorMessage(error: FirebaseError) {
  if (error.code === "auth/email-already-in-use") {
    return "The email you entered is already in use. Did you mean to sign in?";
  }
  return error.message;
}
>>>>>>> 94337bc9625342265c4f966796c1c3cce8cb9c6d:app/account/sign-up.tsx

import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { signInWithCredential, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '@/config/firebaseConfig';
import { Alert } from 'react-native';

export default function SignUp() {
  const screenOptions = {
    headerShown: false,
  };

  const [loaded] = useFonts({
    Poppins: require("../../assets/fonts/Poppins/Poppins-Regular.ttf"),
    PoppinsBold: require("../../assets/fonts/Poppins/Poppins-Bold.ttf"),
  });

  const { colorTheme } = useColorTheme();

  const [username, setUsername] = useState("");
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [retypePassword, setRetypePassword] = useState("");
  const [retypePasswordVisible, setRetypePasswordVisible] = useState(false);
  const [outcome, setOutcome] = useState<RegistrationOutcome | null>(null);

  const resetState = () => {
    setUsername("");
    setUsernameError(null);
    setPassword("");
    setPasswordVisible(false);
    setRetypePassword("");
    setRetypePasswordVisible(false);
    setOutcome(null);
  }

  // WebBrowser.maybeCompleteAuthSession();

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: "884027047581-q28n1u7ke6lqkma87bpiakepgm7ugpe0.apps.googleusercontent.com", 
      offlineAccess: false,
      scopes: ['profile', 'email']
    });
  }, []);

  // Old Code that used GoogleAuthProvider but kept getting blocked by Google

  // const [request, response, promptAsync] = Google.useAuthRequest({
  //   androidClientId: "884027047581-q28n1u7ke6lqkma87bpiakepgm7ugpe0.apps.googleusercontent.com",
  //   webClientId: "884027047581-q28n1u7ke6lqkma87bpiakepgm7ugpe0.apps.googleusercontent.com"
  // });
  
  // useEffect(() => {
  //   if (response?.type === 'success') {
  //     const { id_token } = response.params;
  //     const credential = GoogleAuthProvider.credential(id_token);
  //     signInWithCredential(auth, credential)
  //       .then((userCredential) => {
  //         const email = userCredential.user.email;
  //         if (!email?.endsWith('@ucsd.edu')) {
  //           auth.signOut();
  //           Alert.alert("Access Denied", "Only UCSD emails are allowed.");
  //         } else {
  //           Alert.alert("Success", "Welcome to GrubGrab!");
  //         }
  //       })
  //       .catch((error) => {
  //         console.error("Firebase Sign-In Error:", error);
  //         Alert.alert("Login Failed", "Please try again.");
  //       });
  //   }
  // }, [response]);

  if (!loaded) {
    return null;
  }

  const theme = {
    ...DefaultTheme,
    colors:
      colorTheme === "light" ? LightThemeColors.colors : DarkThemeColors.colors,
  };

<<<<<<< HEAD:frontend/app/(account)/sign-up.tsx
  const handleGoogleSignUp = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      const tokens = await GoogleSignin.getTokens();
      const idToken = tokens.idToken;

      if (!idToken) {
        throw new Error("No ID token returned from Google Sign-In");
      }

      const googleCredential = GoogleAuthProvider.credential(idToken);
      const userCredential = await signInWithCredential(auth, googleCredential);

      const email = userCredential.user.email;
      if (!email?.endsWith('@ucsd.edu')) {
        await auth.signOut();
        Alert.alert("Access Denied", "Only UCSD emails are allowed.");
      } else {
        Alert.alert("Success", "Please login.");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Login Failed", "Please try again.");
    }
  };

  const handleSignIn = () => {
    console.log(
      `Attempting to sign in with username: ${username}@ucsd.edu and password: ${password}`
    );
    // Add authentication logic here
  };
=======
  const handleSignUp = async () => {
    if (!isEmailHandleValid(username)) {
      setUsernameError('Invalid username!');
      return;
    }
    // TODO verify retyped password matches original password
>>>>>>> 94337bc9625342265c4f966796c1c3cce8cb9c6d:app/account/sign-up.tsx

    try {
      const cred = await createUserWithEmailAndPassword(auth, username + '@ucsd.edu', password);
      await sendEmailVerification(cred.user);
      setOutcome({ type: 'success' });
    } catch (prob) {
      setOutcome({ type: 'error', error: prob as Error });
    }
  };

  return (
    <PaperProvider theme={theme}>
      <Stack.Screen options={screenOptions} />
      <View
        style={[styles.container, { backgroundColor: theme.colors.primary }]}
      >
        <Text style={[styles.title, { color: theme.colors.onPrimary }]}>
          Sign Up to Cohabit
        </Text>
        <View style={styles.inputContainer}>
          <TextInput
            mode="outlined"
            label="Username"
            value={username}
            onChangeText={setUsername}
            error={usernameError !== null}
            style={styles.input}
            placeholder="Enter your username"
            placeholderTextColor={theme.colors.onBackground}
            right={<TextInput.Affix text="@ucsd.edu" />}
          />
          {usernameError && <Text style={{ marginLeft: 8 }}>{usernameError}</Text>}
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
        <View style={styles.inputContainer}>
          <TextInput
            mode="outlined"
            label="Retype Password"
            value={retypePassword}
            onChangeText={setRetypePassword}
            style={styles.input}
            error={retypePassword.length > 0 && retypePassword !== password}
            placeholder="Retype your password"
            placeholderTextColor={theme.colors.onBackground}
            secureTextEntry={!retypePasswordVisible}
            right={
              <TextInput.Icon
                icon={retypePasswordVisible ? "eye" : "eye-off"}
                onPress={() => setRetypePasswordVisible(!retypePasswordVisible)}
              />
            }
          />
          {retypePassword.length > 0 && retypePassword !== password &&
            <Text style={{ marginLeft: 8 }}>Passwords do not match</Text>}
        </View>
        <Button
          icon="login"
          mode="contained"
          onPress={handleSignUp}
          disabled={
            username.trim().length === 0 ||
            password.trim().length === 0 ||
            (retypePassword !== password)
          }
          style={[styles.button, { backgroundColor: theme.colors.onPrimary }]}
          labelStyle={styles.buttonLabel}
        >
          Sign Up
        </Button>
        <Button
          icon="google"
          mode="contained"
          onPress={handleGoogleSignUp}
          style={[styles.button, { backgroundColor: theme.colors.onPrimary }]}
          labelStyle={styles.buttonLabel}
        >
          Sign Up with Google
        </Button>
        <View style={styles.signupContainer}>
          <Text style={{ color: theme.colors.onPrimary }}>
            Already have an account?{" "}
            <Link
              href="/(account)/sign-in"
              style={[styles.signupLink, { color: theme.colors.onPrimary }]}
            >
              Sign In!
            </Link>
          </Text>
        </View>
      </View>
      <Portal>
        <Modal
          visible={outcome !== null}
          contentContainerStyle={modalStyle.modal}
          onDismiss={() => {
            resetState();
          }}
        >
          {outcome?.type === 'success' &&
            <>
              <PaperText variant="titleMedium">Verify your Email</PaperText>
              <PaperText>
                We have just sent you a verification email.
                Please click on the link in the email to finish signing up!
              </PaperText>
            </>
          }
          {outcome?.type === 'error' &&
            <>
              <PaperText variant="titleMedium">Registration Failed</PaperText>
              <PaperText>
                {outcome.error instanceof FirebaseError ?
                  formatErrorMessage(outcome.error) : outcome.error.message}
              </PaperText>
            </>
          }
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
  verifyButton: {
    height: 56,
    justifyContent: "center",
    borderRadius: 8,
    elevation: 3,
  },
  verifyButtonLabel: {
    fontSize: 14,
    fontFamily: "Poppins",
    color: "#fff",
  },
});
