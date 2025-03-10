import React from 'react';
import { render, fireEvent, act, waitFor, screen } from '@testing-library/react-native';
import Main from '../app/(tabs)/main';
import { ErrorBoundary } from 'react-error-boundary';
import { router } from 'expo-router';
import { View, Text } from 'react-native';


jest.mock("react-native/Libraries/Components/ScrollView/ScrollView", () => {
  const React = require("react");
  const { View } = require("react-native");
  return (props) => <View {...props} />;
});

describe('Main Screen', () => {

  it('renders correctly', async () => {
    render(
      <ErrorBoundary
        fallbackRender={({ error }) => {
          console.error("Main component crashed:", error);
          throw error; // Force the test to fail when an error occurs
        }}
      >
        <Main />
      </ErrorBoundary>
    );

    const errorMessage = screen.queryByTestId("error-message");
    if (errorMessage) {
      console.log("Main component crashed with error:", errorMessage.props.children);
    }

    // Wait for elements to appear
    await waitFor(() => {
      expect(
        screen.getByText("Today's Habits")
      ).toBeTruthy();
    });
  });

  it('takes us to new habit screen when Add New Habit button is pressed', async() => {
    render(
      <ErrorBoundary
        fallbackRender={({ error }) => {
          console.error("Main component crashed:", error);
          throw error; // Force the test to fail when an error occurs
        }}
      >
        <Main />
      </ErrorBoundary>
    );

    // await act(async () => {
    //   fireEvent.press(screen.getByLabelText("Add New Habit"));
    // });
    // Ensure button is found before pressing

    const errorMessage = screen.queryByTestId("error-message");
    if (errorMessage) {
      console.log("Main component crashed with error:", errorMessage.props.children);
    }

    const button = await screen.findByRole("button", {
      name: /Add New Habit/i,
    });

    await act(async () => {
      fireEvent.press(button);
    });

    expect(router.push).toHaveBeenCalledWith("/(habit)/new-habit");
  });

});
