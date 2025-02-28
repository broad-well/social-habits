import React from 'react';
import { render, fireEvent, act, waitFor } from '@testing-library/react-native';
import HabitCreation from '../app/new-habit';
import { router } from 'expo-router';

describe('Habit Creation Screen', () => {

  it('renders correctly', async () => {
    const { getByText } = render(<HabitCreation />);

    waitFor(() => {
      expect(getByText('New Habit')).toBeTruthy();
      expect(getByText('Frequency:')).toBeTruthy();
      expect(getByText("Start Date:")).toBeTruthy();
      expect(getByText("End Date:")).toBeTruthy();
      expect(getByText("Start Time:")).toBeTruthy();
      expect(getByText("End Time:")).toBeTruthy();
      expect(getByText("Privacy:")).toBeTruthy();
      expect(getByText("Reset")).toBeTruthy();
      expect(getByText("Save")).toBeTruthy();
    });
  });

  it('takes us back to Habit Creation screen when Save button is pressed', async() => {
    const { getByText } = render(<HabitCreation/>)

    act(() => {
      fireEvent.press(getByText("Save"));
    });

    expect(router.back).toHaveBeenCalledWith("");
  });

});
