import React, { useEffect, useState } from "react";
import { Alert, Text, View, StyleSheet } from "react-native";
import {
  Button,
  TextInput,
  Portal,
  Modal,
  Text as PaperText,
  MD3LightTheme as DefaultTheme,
  PaperProvider,
} from "react-native-paper";
import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";
import DarkThemeColors from "@/constants/DarkThemeColors.json";
import LightThemeColors from "@/constants/LightThemeColors.json";
import { useColorTheme } from "@/stores/useColorTheme";
import { Link, Stack } from "expo-router";
import { auth } from "@/config/firebaseConfig";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import { isEmailHandleValid } from "@/validation/account";
import { modalStyle } from "@/components/modalStyle";
import { FirebaseError } from "firebase/app";
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { signInWithCredential, GoogleAuthProvider } from 'firebase/auth';
import { jwtDecode } from "jwt-decode";


type RegistrationOutcome =
  | {
      type: "success";
    }
  | {
      type: "error";
      error: Error;
    };

export function formatErrorMessage(error: FirebaseError) {
  if (error.code === "auth/email-already-in-use") {
    return "The email you entered is already in use. Did you mean to sign in?";
  }
  return error.message;
}

export default function SignUp() {
  const screenOptions = {
    headerShown: false,
  };

  const [loaded] = useFonts({
    Poppins: require("../../assets/fonts/Poppins/Poppins-Regular.ttf"), // eslint-disable-line
    PoppinsBold: require("../../assets/fonts/Poppins/Poppins-Bold.ttf"), // eslint-disable-line
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
  };

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: "884027047581-vro97mr4eg39fba7rla68uup2bd3jqoa.apps.googleusercontent.com",
      offlineAccess: false,
      scopes: ['profile', 'email']
    });
  }, []);

  if (!loaded) {
    return null;
  }

  const theme = {
    ...DefaultTheme,
    colors:
      colorTheme === "light" ? LightThemeColors.colors : DarkThemeColors.colors,
  };

  function checkTokenType(token: string): void {
    if (!token) {
      console.error("Invalid Token: Empty or Undefined");
      return;
    } try {
      const decoded = jwtDecode(token);
      console.error("Decoded Payload:", decoded);
      if (decoded.iss?.includes("accounts.google.com")) {
        console.error("This is a Google ID Token.");
      } else if (decoded.iss?.includes("securetoken.google.com")) {
        console.error("This is a Firebase ID Token.");
      } else { 
        console.error("Unknown Token Type.");
      }
    } catch (error) {
      console.error("Invalid Token: Could not decode", error);
    }
  }

  const handleGoogleSignUp = async () => {
    
    try {
      await GoogleSignin.hasPlayServices();
      await GoogleSignin.signOut();
      const userInfo = await GoogleSignin.signIn();
      //const tokens = await GoogleSignin.getTokens();
      const idToken = userInfo.data?.idToken;
      
      console.error(idToken);
      
      if (!idToken) {
        throw new Error("No ID token returned from Google Sign-In");
      }


      // signInWithPopup(auth, provider)
      // .then((result) => {
      //   // This gives you a Google Access Token. You can use it to access the Google API.
      //   const credential = GoogleAuthProvider.credentialFromResult(result);
      //   const token = credential.accessToken;
      //   // The signed-in user info.
      //   const user = result.user;
      //   // IdP data available using getAdditionalUserInfo(result)
      //   // ...
      // }).catch((error) => {
      //   // Handle Errors here.
      //   const errorCode = error.code;
      //   const errorMessage = error.message;
      //   // The email of the user's account used.
      //   const email = error.customData.email;
      //   // The AuthCredential type that was used.
      //   const credential = GoogleAuthProvider.credentialFromError(error);
      //   // ...
      // });

      
      const googleCredential = GoogleAuthProvider.credential(idToken);
      const userCredential = await signInWithCredential(auth, googleCredential);
      const user = userCredential.user;
      //userCredential.
      // const user = userInfo.data?.user;
      const firebaseIdToken = await user.getIdToken(true);

      console.error((idToken === firebaseIdToken));

      console.error(idToken);

      checkTokenType(idToken);
      checkTokenType(firebaseIdToken);

      if (!user?.email?.endsWith("@ucsd.edu")) {
        await auth.signOut();
        Alert.alert("Access Denied", "Only UCSD emails are allowed.");
        return;
      }

      // const response = await fetch("https://cohabit-server.vercel.app/api/users/check", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ email: user.email }),
      // });
      // Send the ID token to the backend
      // const responseA = await fetch("https://cohabit-server.vercel.app/api/auth/google", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ idToken }),
      // });

      // console.error("FIRST RAN PROPERLY")
      const response = await fetch("https://cohabit-server.vercel.app/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ "idToken" : firebaseIdToken }),
      });
      console.error("SUCCESS");

      // console.log(response);
      
      // Check if response is OK and has correct content type
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Server Error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();

  
      if (data.exists) {
        Alert.alert("Success", "User exists, please log in.");
      } else {
        await fetch("https://cohabit-server.vercel.app/api/users/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            firebaseId: user.uid,
            name: user.displayName,
            email: user.email,
          }),
        });
        Alert.alert("Success", "User created, please log in.");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Login Failed", "Please try again.");
    }
  };


  const handleSignUp = async () => {
    if (!isEmailHandleValid(username)) {
      setUsernameError("Invalid username!");
      return;
    }
    // TODO verify retyped password matches original password

    try {
      const cred = await createUserWithEmailAndPassword(
        auth,
        username + "@ucsd.edu",
        password
      );
      await sendEmailVerification(cred.user);
      setOutcome({ type: "success" });
    } catch (prob) {
      setOutcome({ type: "error", error: prob as Error });
    }
  };

  return (
    <PaperProvider theme={theme}>
      <Stack.Screen options={screenOptions} />
      <View
        style={[styles.container, { backgroundColor: theme.colors.primaryContainer }]}
      >
        <Text style={[styles.title, { color: theme.colors.onPrimaryContainer }]}>
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
          {usernameError && (
            <Text style={{ marginLeft: 8 }}>{usernameError}</Text>
          )}
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
            testID="password-input"
            right={
              <TextInput.Icon
                icon={passwordVisible ? "eye" : "eye-off"}
                onPress={() => setPasswordVisible(!passwordVisible)}
                accessibilityLabel="password-visibility-toggle"
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
          {retypePassword.length > 0 && retypePassword !== password && (
            <Text style={{ marginLeft: 8 }}>Passwords do not match</Text>
          )}
        </View>
        <Button
          icon="login"
          mode="contained"
          onPress={handleSignUp}
          disabled={
            username.trim().length === 0 ||
            password.trim().length === 0 ||
            retypePassword !== password
          }
          style={[styles.button, { backgroundColor: theme.colors.primary }]}
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
          <Text style={{ color: theme.colors.onPrimaryContainer }}>
            Already have an account?{" "}
            <Link
              href="/(account)/sign-in"
              style={styles.signupLink}
              replace
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
          {outcome?.type === "success" && (
            <>
              <PaperText variant="titleMedium">Verify your Email</PaperText>
              <PaperText>
                We have just sent you a verification email. Please click on the
                link in the email to finish signing up!
              </PaperText>
            </>
          )}
          {outcome?.type === "error" && (
            <>
              <PaperText variant="titleMedium">Registration Failed</PaperText>
              <PaperText>
                {outcome.error instanceof FirebaseError
                  ? formatErrorMessage(outcome.error)
                  : outcome.error.message}
              </PaperText>
            </>
          )}
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
