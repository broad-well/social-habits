import React from "react";
import { Text, View, StyleSheet } from "react-native";
import { Button, TextInput, IconButton, Portal, Modal, Text as PaperText } from "react-native-paper";
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
import { Link, router, Stack } from "expo-router";
import { auth } from "../../config/firebaseConfig";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { isEmailHandleValid } from "@/validation/account";
import { modalStyle } from "@/components/modalStyle";
import { FirebaseError } from "firebase/app";

interface PasswordValidation {
  hasMinLength: boolean;
  hasMaxLength: boolean;
  hasUpperCase: boolean;
  hasLowerCase: boolean;
  hasSpecialChar: boolean;
  isMatching: boolean;
}

const initialPasswordValidation: PasswordValidation = {
  hasMinLength: false,
  hasMaxLength: true,
  hasUpperCase: false,
  hasLowerCase: false,
  hasSpecialChar: false,
  isMatching: false,
};

type RegistrationOutcome = {
  type: 'success'
} | {
  type: 'error',
  error: Error,
};

export function validatePassword(password: string): Omit<PasswordValidation, 'isMatching'> {
  return {
    hasMinLength: password.length >= 8,
    hasMaxLength: password.length <= 15,
    hasUpperCase: /[A-Z]/.test(password),
    hasLowerCase: /[a-z]/.test(password),
    hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };
}

export function formatErrorMessage(error: FirebaseError) {
  if (error.code === "auth/email-already-in-use") {
    return "The email you entered is already in use. Did you mean to sign in?";
  }
  return error.message;
}

const ValidationIcon: React.FC<{ isValid: boolean }> = ({ isValid }) => (
  <Text style={{ color: isValid ? '#4CAF50' : '#FF5252', marginRight: 8 }}>
    {isValid ? '✓' : '✗'}
  </Text>
);

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
  const [showPasswordCriteria, setShowPasswordCriteria] = useState(false);
  const [retypePassword, setRetypePassword] = useState("");
  const [retypePasswordVisible, setRetypePasswordVisible] = useState(false);
  const [outcome, setOutcome] = useState<RegistrationOutcome | null>(null);
  const [validation, setValidation] = useState<PasswordValidation>(initialPasswordValidation);

  const updatePasswordValidation = (newPassword: string, confirmPassword: string) => {
    const validationResult = validatePassword(newPassword);
    setValidation({
      ...validationResult,
      isMatching: newPassword === confirmPassword
    });
  };

  const resetState = () => {
    setUsername("");
    setUsernameError(null);
    setPassword("");
    setPasswordVisible(false);
    setRetypePassword("");
    setRetypePasswordVisible(false);
    setOutcome(null);
    setValidation(initialPasswordValidation);
  };

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  useEffect(() => {
    updatePasswordValidation(password, retypePassword);
  }, [password, retypePassword]);

  if (!loaded) {
    return null;
  }

  const theme = {
    ...DefaultTheme,
    colors:
      colorTheme === "light" ? LightThemeColors.colors : DarkThemeColors.colors,
  };

  const isPasswordValid = Object.values(validation).every(Boolean);

  const handleSignUp = async () => {
    if (!isEmailHandleValid(username)) {
      setUsernameError('Invalid username!');
      return;
    }

    if (!isPasswordValid) {
      setOutcome({
        type: 'error',
        error: new Error('Please ensure all password requirements are met.')
      });
      return;
    }

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
          {usernameError && <Text style={styles.errorText}>{usernameError}</Text>}
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            mode="outlined"
            label="Password"
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              updatePasswordValidation(text, retypePassword);
            }}
            style={styles.input}
            placeholder="Enter your password"
            placeholderTextColor={theme.colors.onBackground}
            secureTextEntry={!passwordVisible}
            onFocus={() => setShowPasswordCriteria(true)}
            testID="password-input"
            right={
              <TextInput.Icon
                icon={passwordVisible ? "eye" : "eye-off"}
                onPress={() => setPasswordVisible(!passwordVisible)}
                accessibilityLabel="password-visibility-toggle"
              />
            }
          />
          {showPasswordCriteria && (
            <View style={styles.criteriaContainer}>
              <View style={styles.criteriaRow}>
                <ValidationIcon isValid={validation.hasMinLength} />
                <Text style={styles.criteriaText}>At least 8 characters</Text>
              </View>
              <View style={styles.criteriaRow}>
                <ValidationIcon isValid={validation.hasMaxLength} />
                <Text style={styles.criteriaText}>Maximum 15 characters</Text>
              </View>
              <View style={styles.criteriaRow}>
                <ValidationIcon isValid={validation.hasUpperCase} />
                <Text style={styles.criteriaText}>At least one uppercase letter</Text>
              </View>
              <View style={styles.criteriaRow}>
                <ValidationIcon isValid={validation.hasLowerCase} />
                <Text style={styles.criteriaText}>At least one lowercase letter</Text>
              </View>
              <View style={styles.criteriaRow}>
                <ValidationIcon isValid={validation.hasSpecialChar} />
                <Text style={styles.criteriaText}>At least one special character (!@#$%^&*)</Text>
              </View>
            </View>
          )}
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            mode="outlined"
            label="Retype Password"
            value={retypePassword}
            onChangeText={(text) => {
              setRetypePassword(text);
              updatePasswordValidation(password, text);
            }}
            style={styles.input}
            error={retypePassword.length > 0 && !validation.isMatching}
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
          {retypePassword.length > 0 && !validation.isMatching && (
            <Text style={styles.errorText}>Passwords do not match</Text>
          )}
        </View>
        <Button
          icon="login"
          mode="contained"
          onPress={handleSignUp}
          disabled={
            username.trim().length === 0 ||
            !isPasswordValid
          }
          style={[styles.button, { backgroundColor: theme.colors.onPrimary }]}
          labelStyle={styles.buttonLabel}
        >
          Sign Up
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
  criteriaContainer: {
    marginTop: 8,
    padding: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 8,
  },
  criteriaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  criteriaText: {
    fontSize: 14,
    fontFamily: "Poppins",
  },
  errorText: {
    color: '#FF5252',
    marginLeft: 8,
    marginTop: 4,
    fontFamily: "Poppins",
  },
});