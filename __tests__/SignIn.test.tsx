import React from 'react';
import { render, fireEvent, act, waitFor, screen } from '@testing-library/react-native';
import SignIn from '../app/(account)/sign-in';

describe('SignIn Screen', () => {

  it('renders correctly', async () => {
    render(<SignIn />);

    await waitFor(() => {
      expect(screen.getByText('Sign In to Cohabit')).toBeTruthy();
      expect(screen.getByPlaceholderText('Enter your username')).toBeTruthy();
      expect(screen.getByPlaceholderText('Enter your password')).toBeTruthy();
      expect(screen.getByText('Sign In')).toBeTruthy();
      expect(screen.getByText("Don't have an account? Sign Up!")).toBeTruthy();
    });
  });

  it('updates username and password fields', async () => {
    render(<SignIn />);

    const usernameInput = screen.getByPlaceholderText('Enter your username');
    const passwordInput = screen.getByPlaceholderText('Enter your password');

    act(() => {
      fireEvent.changeText(usernameInput, 'testuser');
      fireEvent.changeText(passwordInput, 'password123');
    });

    await waitFor(() => {
      expect(usernameInput.props.value).toBe('testuser');
      expect(passwordInput.props.value).toBe('password123');
    });
  });

  // it('calls handleSignIn function on button press', async () => {
  //   const { getByText } = render(<SignIn />);
  //   const signInButton = getByText('Sign In');

  //   const consoleSpy = jest.spyOn(console, 'log');

  //   fireEvent.press(signInButton);

  //   expect(consoleSpy).toHaveBeenCalledWith(
  //     expect.stringContaining('Attempting to sign in with username:')
  //   );

  //   consoleSpy.mockRestore();
  // });

  it('toggles password visibility', async () => {
    render(<SignIn />);

    const passwordInput = screen.getByPlaceholderText('Enter your password');
    const visibilityToggle = screen.getByLabelText('password-visibility-toggle');

    expect(passwordInput.props.secureTextEntry).toBe(true);

    act(() => {
      fireEvent.press(visibilityToggle);
    });

    await waitFor(() => {
      expect(passwordInput.props.secureTextEntry).toBe(false);
    });
  });
});
