import React from 'react';
import { render, fireEvent, act, waitFor } from '@testing-library/react-native';
import SignUp from '../app/(account)/sign-up';

describe('SignUp Screen', () => {

  it('renders correctly', async () => {
    const { getByText, getByPlaceholderText } = render(<SignUp />);

    waitFor(() => {
      expect(getByText('Sign Up to Cohabit')).toBeTruthy();
      expect(getByPlaceholderText('Enter your username')).toBeTruthy();
      expect(getByPlaceholderText('Enter your password')).toBeTruthy();
      expect(getByPlaceholderText('Retype your password')).toBeTruthy();
      expect(getByText('Sign Up')).toBeTruthy();
      expect(getByText("Already have an account?")).toBeTruthy();
    });
  });

  it('updates username and password fields', async () => {
    const { getByPlaceholderText } = render(<SignUp />);

    const usernameInput = getByPlaceholderText('Enter your username');
    const passwordInput = getByPlaceholderText('Enter your password');
    const retypePasswordInput = getByPlaceholderText('Retype your password');

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
    const { getByPlaceholderText, getByLabelText } = render(<SignUp />);

    const passwordInput = getByPlaceholderText('Enter your password');
    const VisibilityToggle = getByLabelText('password-visibility-toggle');
    const retypePasswordInput = getByPlaceholderText('Retype your password');
    const rtVisibilityToggle = getByLabelText('rt-password-visibility-toggle');

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
    const { getByPlaceholderText, getByText } = render(<SignUp />);

    const passwordInput = getByPlaceholderText('Enter your password');
    const retypePasswordInput = getByPlaceholderText('Retype your password');

    act(() => {
      fireEvent.changeText(passwordInput, "password");
      fireEvent.changeText(retypePasswordInput, "notthesamepassword");
    });

    await waitFor(() => {
      expect(getByText("Passwords do not match")).toBeTruthy();
    });
  });

  it('provides no warning when retyped password matches original password', async () => {
    const { getByPlaceholderText, queryByText } = render(<SignUp />);

    const passwordInput = getByPlaceholderText('Enter your password');
    const retypePasswordInput = getByPlaceholderText('Retype your password');

    act(() => {
      fireEvent.changeText(passwordInput, "password");
      fireEvent.changeText(retypePasswordInput, "password");
    });

    await waitFor(() => {
      expect(queryByText("Passwords do not match")).toBeNull();
    });
  });

});
