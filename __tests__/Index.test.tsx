import React from 'react';
import { render, fireEvent, act, waitFor } from '@testing-library/react-native';
import Index from '../app/index';
import { router } from "expo-router";

describe('SignIn Screen', () => {

  it('renders correctly', async () => {
    const { getByText, getByPlaceholderText } = render(<Index />);

    waitFor(() => {
      expect(getByText('Welcome to Cohabit!')).toBeTruthy();
      expect(getByText('Sign In')).toBeTruthy();
      expect(getByText("Don't have an account? Sign Up!")).toBeTruthy();
    });
  });

  it('takes us to Sign In screen when Sign In button is pressed', async() => {
    const { getByText } = render(<Index/>)

    act(() => {
      fireEvent.press(getByText("Sign In"));
    });

    expect(router.push).toHaveBeenCalledWith("/(account)/sign-in");
  });

});
