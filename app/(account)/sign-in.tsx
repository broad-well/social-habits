import { Alert, Text, View, StyleSheet } from "react-native";
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
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { signInWithCredential, GoogleAuthProvider } from 'firebase/auth';
import { jwtDecode } from "jwt-decode";

export function formatError(error: FirebaseError) {
  if (error.code === "auth/invalid-credential") {
    return "Entered credentials do not match an existing user";
  }
  return error.message;
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
  
    const handleGoogleSignIn = async () => {
      
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
  
    
        if (!data.exists) {
          Alert.alert("Failure", "User does not exist, please sign up.");
        } else {
          // await fetch("https://cohabit-server.vercel.app/api/users/signup", {
          //   method: "POST",
          //   headers: { "Content-Type": "application/json" },
          //   body: JSON.stringify({
          //     firebaseId: user.uid,
          //     name: user.displayName,
          //     email: user.email,
          //   }),
          // });
          // Alert.alert("Success", "User created, please log in.");
          router.push("/(tabs)/main");
        }
      } catch (error) {
        console.error(error);
        Alert.alert("Login Failed", "Please try again.");
      }
    };
  

  const handleSignIn = async () => {
    try {
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
    } catch (fail) {
      setError(fail);
    }
    router.push("/(tabs)/main");
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
            onChangeText={setUsername}
            inputMode="text"
            style={styles.input}
            placeholder="Enter your username"
            placeholderTextColor={theme.colors.onBackground}
            right={<TextInput.Affix text="@ucsd.edu" />}
            textContentType="username"
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
            passwordRules="minlength: 6; required: lower; required: digit;"
            placeholderTextColor={theme.colors.onBackground}
            secureTextEntry={!passwordVisible}
            right={
              <TextInput.Icon
                icon={passwordVisible ? "eye" : "eye-off"}
                onPress={() => setPasswordVisible(!passwordVisible)}
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
        >
          Sign In
        </Button>
        <Button
          icon="google"
          mode="contained"
          onPress={handleGoogleSignIn}
          style={[styles.button, { backgroundColor: theme.colors.onPrimary }]}
          labelStyle={styles.buttonLabel}
        >
          Sign In With Google
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
          contentContainerStyle={modalStyle.modal}
        >
          <PaperText variant="titleMedium">Sign-In Failed</PaperText>
          <PaperText>
            {error instanceof FirebaseError ? formatError(error) : `${error}`}
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
