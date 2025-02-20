import React from 'react';
import { render, fireEvent, cleanup } from '@testing-library/react-native';
import SignIn from '../app/account/sign-in';
// import { useColorTheme } from '../stores/useColorTheme';

jest.mock('expo-router', () => ({
  Link: jest.fn().mockImplementation(({ children }) => children),
  Stack: {
    Screen: jest.fn(),
  },
  router: {
    push: jest.fn(),
  }
}));

jest.mock('expo-font', () => ({
  useFonts: () => [true],
}));

jest.mock('expo-splash-screen', () => ({
  hideAsync: jest.fn(),
}));

jest.mock('../stores/useColorTheme', () => ({
  useColorTheme: () => ({
    colorTheme: 'light'
  })
}));

jest.mock('../assets/fonts/Poppins/Poppins-Regular.ttf', () => '');
jest.mock('../assets/fonts/Poppins/Poppins-Bold.ttf', () => '');

describe('SignIn Screen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it('renders correctly', async () => {
    const { getByText, getByPlaceholderText } = render(<SignIn />);

    expect(getByText('Sign In to Cohabit')).toBeTruthy();
    expect(getByPlaceholderText('Enter your username')).toBeTruthy();
    expect(getByPlaceholderText('Enter your password')).toBeTruthy();
    expect(getByText('Sign In')).toBeTruthy();
    expect(getByText("Don't have an account? Sign Up!")).toBeTruthy();
  });

  it('updates username and password fields', async () => {
    const { getByPlaceholderText } = render(<SignIn />);

    const usernameInput = getByPlaceholderText('Enter your username');
    const passwordInput = getByPlaceholderText('Enter your password');

    fireEvent.changeText(usernameInput, 'testuser');
    fireEvent.changeText(passwordInput, 'password123');

    expect(usernameInput.props.value).toBe('testuser');
    expect(passwordInput.props.value).toBe('password123');
  });

  it('calls handleSignIn function on button press', async () => {
    const { getByText } = render(<SignIn />);
    const signInButton = getByText('Sign In');

    const consoleSpy = jest.spyOn(console, 'log');

    fireEvent.press(signInButton);

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('Attempting to sign in with username:')
    );

    consoleSpy.mockRestore();
  });

  it('toggles password visibility', async () => {
    const { getByTestId } = render(<SignIn />);

    const passwordInput = getByTestId('password-input');
    const visibilityToggle = getByTestId('password-visibility-toggle');

    expect(passwordInput.props.secureTextEntry).toBe(true);

    fireEvent.press(visibilityToggle);

    expect(passwordInput.props.secureTextEntry).toBe(false);

  });
});
