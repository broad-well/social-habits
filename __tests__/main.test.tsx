import React from 'react';
import { render, fireEvent, act, waitFor } from '@testing-library/react-native';
import Main from '../app/(tabs)/main';

describe('Main Screen', () => {

  it('renders correctly', async () => {
    const { getByText, getByPlaceholderText } = render(<Main />);

    waitFor(() => {
      expect(getByText("Today's Habits")).toBeTruthy();
    });
  });
});
