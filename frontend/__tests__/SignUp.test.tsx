import React from 'react';
import { render, fireEvent, act, waitFor, screen } from '@testing-library/react-native';
import SignUp from '../app/(account)/sign-up';

describe('SignUp Screen', () => {

  it('renders correctly', async () => {
    render(<SignUp />);

    await waitFor(() => {
      expect(screen.getByText('Sign Up to Cohabit')).toBeTruthy();
      expect(screen.getByPlaceholderText('Enter your username')).toBeTruthy();
      expect(screen.getByPlaceholderText('Enter your password')).toBeTruthy();
      expect(screen.getByPlaceholderText('Retype your password')).toBeTruthy();
      expect(screen.getByText('Sign Up')).toBeTruthy();
      expect(screen.getByText(/Already have an account\?/i)).toBeTruthy();
    });
  });

  it('updates username and password fields', async () => {
    render(<SignUp />);

    const usernameInput = screen.getByPlaceholderText('Enter your username');
    const passwordInput = screen.getByPlaceholderText('Enter your password');
    const retypePasswordInput = screen.getByPlaceholderText('Retype your password');

    act(() => {
      fireEvent.changeText(usernameInput, 'testuser');
      fireEvent.changeText(passwordInput, 'password123');
      fireEvent.changeText(retypePasswordInput, 'password123');
    });

    await waitFor(() => {
      expect(usernameInput.props.value).toBe('testuser');
      expect(passwordInput.props.value).toBe('password123');
      expect(retypePasswordInput.props.value).toBe('password123');
    });
  });

  it('toggles password visibility', async () => {
    render(<SignUp />);

    const passwordInput = screen.getByPlaceholderText('Enter your password');
    const VisibilityToggle = screen.getByLabelText('password-visibility-toggle');
    const retypePasswordInput = screen.getByPlaceholderText('Retype your password');
    const rtVisibilityToggle = screen.getByLabelText('rt-password-visibility-toggle');

    expect(passwordInput.props.secureTextEntry).toBe(true);
    expect(retypePasswordInput.props.secureTextEntry).toBe(true);

    act(() => {
      fireEvent.press(VisibilityToggle);
      fireEvent.press(rtVisibilityToggle);
    });

    await waitFor(() => {
      expect(passwordInput.props.secureTextEntry).toBe(false);
      expect(retypePasswordInput.props.secureTextEntry).toBe(false);
    });
  });

  it('provides a warning when retyped password does not match original password', async () => {
    render(<SignUp />);

    const passwordInput = screen.getByPlaceholderText('Enter your password');
    const retypePasswordInput = screen.getByPlaceholderText('Retype your password');

    act(() => {
      fireEvent.changeText(passwordInput, "password");
      fireEvent.changeText(retypePasswordInput, "notthesamepassword");
    });

    await waitFor(() => {
      expect(screen.getByText("Passwords do not match")).toBeTruthy();
    });
  });

  it('provides no warning when retyped password matches original password', async () => {
    render(<SignUp />);

    const passwordInput = screen.getByPlaceholderText('Enter your password');
    const retypePasswordInput = screen.getByPlaceholderText('Retype your password');

    act(() => {
      fireEvent.changeText(passwordInput, "password");
      fireEvent.changeText(retypePasswordInput, "password");
    });

    await waitFor(() => {
      expect(screen.queryByText("Passwords do not match")).toBeNull();
    });
  });

});
