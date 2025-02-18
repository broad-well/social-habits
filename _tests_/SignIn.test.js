import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import SignIn from '../app/account/sign-in';  // Updated path based on your structure
import { useColorTheme } from '../stores/useColorTheme';

// Mock expo-router
jest.mock('expo-router', () => ({
  Link: jest.fn().mockImplementation(({ children }) => children),
  Stack: {
    Screen: jest.fn(),
  },
  router: {
    push: jest.fn(),
  }
}));

// Mock expo-font using your exact version
jest.mock('expo-font', () => ({
  useFonts: () => [true],
}));

// Mock expo-splash-screen using your exact version
jest.mock('expo-splash-screen', () => ({
  hideAsync: jest.fn(),
}));

// Mock the theme store
jest.mock('../stores/useColorTheme', () => ({
  useColorTheme: () => ({
    colorTheme: 'light'
  })
}));

// Mock the font loading
jest.mock('../assets/fonts/Poppins/Poppins-Regular.ttf', () => '');
jest.mock('../assets/fonts/Poppins/Poppins-Bold.ttf', () => '');

describe('SignIn Screen', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    const { getByText, getByPlaceholderText } = render(<SignIn />);
    
    expect(getByText('Sign In to Cohabit')).toBeTruthy();
    expect(getByPlaceholderText('Enter your username')).toBeTruthy();
    expect(getByPlaceholderText('Enter your password')).toBeTruthy();
    expect(getByText('Sign In')).toBeTruthy();
    expect(getByText('Sign Up!')).toBeTruthy();
  });

  it('updates username and password fields', () => {
    const { getByPlaceholderText } = render(<SignIn />);
    
    const usernameInput = getByPlaceholderText('Enter your username');
    const passwordInput = getByPlaceholderText('Enter your password');
    
    fireEvent.changeText(usernameInput, 'testuser');
    fireEvent.changeText(passwordInput, 'password123');
    
    expect(usernameInput.props.value).toBe('testuser');
    expect(passwordInput.props.value).toBe('password123');
  });

  it('calls handleSignIn function on button press', () => {
    const { getByText } = render(<SignIn />);
    const signInButton = getByText('Sign In');
    
    const consoleSpy = jest.spyOn(console, 'log');
    
    fireEvent.press(signInButton);
    
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('Attempting to sign in with username:')
    );
    
    consoleSpy.mockRestore();
  });

  it('toggles password visibility', () => {
    const { getByTestId } = render(<SignIn />);
    
    // Add data-testid to your password TextInput and icon in the SignIn component
    const passwordInput = getByTestId('password-input');
    const visibilityToggle = getByTestId('password-visibility-toggle');
    
    // Initially password should be hidden
    expect(passwordInput.props.secureTextEntry).toBe(true);
    
    // Toggle visibility
    fireEvent.press(visibilityToggle);
    
    // Password should now be visible
    expect(passwordInput.props.secureTextEntry).toBe(false);
  });
});