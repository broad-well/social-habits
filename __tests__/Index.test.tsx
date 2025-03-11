import React from 'react';
import { render, fireEvent, act, waitFor, screen } from '@testing-library/react-native';
import Index from '../app/index';
import { router } from "expo-router";

describe('SignIn Screen', () => {

  it('renders correctly', async () => {
    render(<Index />);

    await waitFor(() => {
      expect(screen.getByText('Welcome to Cohabit!')).toBeTruthy();
      expect(screen.getByText('Sign In')).toBeTruthy();
      expect(screen.getByText("Don't have an account? Sign Up!")).toBeTruthy();
    });
  });

  it('takes us to Sign In screen when Sign In button is pressed', async() => {
    render(<Index/>);

    act(() => {
      fireEvent.press(screen.getByText("Sign In"));
    });

    expect(router.push).toHaveBeenCalledWith("/(account)/sign-in");
  });

});
