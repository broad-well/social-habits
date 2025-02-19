import { Text, View, StyleSheet } from "react-native";
import { Button, TextInput } from "react-native-paper";
import {
  MD3LightTheme as DefaultTheme,
  PaperProvider,
} from "react-native-paper";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import { useFonts } from "expo-font";
import DarkThemeColors from "@/constants/DarkThemeColors.json";
import LightThemeColors from "@/constants/LightThemeColors.json";
import { useColorTheme } from "@/stores/useColorTheme";
import { Link, Stack } from "expo-router";

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
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [retypePassword, setRetypePassword] = useState("");
  const [retypePasswordVisible, setRetypePasswordVisible] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");

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

  const handleSendVerificationCode = () => {
    console.log(`Attempting to send verification code to ${username}@ucsd.edu`);
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
        <View style={styles.inputContainer}>
          <TextInput
            mode="outlined"
            label="Retype Password"
            value={retypePassword}
            onChangeText={setRetypePassword}
            style={styles.input}
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
        </View>
        <View
          style={[
            styles.inputContainer,
            { flexDirection: "row", gap: 10, alignItems: "center" },
          ]}
        >
          <TextInput
            mode="outlined"
            label="Verification Code"
            value={verificationCode}
            onChangeText={setVerificationCode}
            style={[styles.input, { flex: 1 }]}
            placeholder="Enter your verification code"
            placeholderTextColor={theme.colors.onBackground}
          />
          <Button
            icon="send"
            mode="contained"
            style={[
              styles.verifyButton,
              { backgroundColor: theme.colors.onPrimary },
            ]}
            onPress={handleSendVerificationCode}
            labelStyle={styles.verifyButtonLabel}
          >
            Verify
          </Button>
        </View>
        <Button
          icon="login"
          mode="contained"
          onPress={handleSignIn}
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
