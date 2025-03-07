import React from 'react';
import { render, fireEvent, act, waitFor } from '@testing-library/react-native';
import Main from '../app/(tabs)/main';
import { router } from 'expo-router';

describe('Main Screen', () => {

  it('renders correctly', async () => {
    const { getByText } = render(<Main />);

    waitFor(() => {
      expect(getByText("Today's Habits")).toBeTruthy();
    });
  });

  it('takes us to new habit screen when Add New Habit button is pressed', async() => {
    const { getByLabelText } = render(<Main/>)

    act(() => {
      fireEvent.press(getByLabelText("Add New Habit"));
    });

    expect(router.push).toHaveBeenCalledWith("/new-habit");
  });

});
