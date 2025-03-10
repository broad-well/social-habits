import React from 'react';
import { render, fireEvent, act, waitFor, screen } from '@testing-library/react-native';
import HabitCreation from '../app/(habit)/new-habit';
import { router } from 'expo-router';

describe('Habit Creation Screen', () => {

  it('renders correctly', async () => {
    render(<HabitCreation />);

    await waitFor(() => {
      expect(screen.getByText('New Habit')).toBeTruthy();
      expect(screen.getByText('Frequency:')).toBeTruthy();
      expect(screen.getByText("Start Date:")).toBeTruthy();
      expect(screen.getByText("End Date:")).toBeTruthy();
      expect(screen.getByText("Start Time:")).toBeTruthy();
      expect(screen.getByText("End Time:")).toBeTruthy();
      expect(screen.getByText("Privacy:")).toBeTruthy();
      expect(screen.getByText("Reset")).toBeTruthy();
      expect(screen.getByText("Save")).toBeTruthy();
    });
  });

  it('takes us back to Habit Creation screen when Save button is pressed', async() => {
    render(<HabitCreation/>);

    act(() => {
      fireEvent.press(screen.getByText("Save"));
    });

    expect(router.back).toHaveBeenCalledWith("");
  });

});
