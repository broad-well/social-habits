import React from 'react';
import { render, fireEvent, act, waitFor } from '@testing-library/react-native';
import Account from '../app/(tabs)/account';
import { router } from 'expo-router';

describe('Account Screen', () => {

  it('renders correctly', async () => {
    const { getByText } = render(<Account />);

    waitFor(() => {
      expect(getByText('My Account')).toBeTruthy();
      expect(getByText('Update Profile')).toBeTruthy();
      expect(getByText("Friend List")).toBeTruthy();
      expect(getByText("Update My Courses")).toBeTruthy();
      expect(getByText("Sign Out")).toBeTruthy();
    });
  });

  it('takes us to Sign In screen when Sign Out button is pressed', async() => {
    const { getByText } = render(<Account/>)

    act(() => {
      fireEvent.press(getByText("Sign Out"));
    });

    expect(router.replace).toHaveBeenCalledWith("/");
  });

});
