import React from 'react';
import { render, fireEvent, act, waitFor } from '@testing-library/react-native';
import Account from '../app/(tabs)/account';

describe('Account Screen', () => {

  it('renders correctly', async () => {
    const { getByText } = render(<Account />);

    waitFor(() => {
      expect(getByText('My Account')).toBeTruthy();
      expect(getByText('Update Profile')).toBeTruthy();
      expect(getByText("Friend List")).toBeTruthy();
      expect(getByText("Update My Courses")).toBeTruthy();
    });
  });
});
