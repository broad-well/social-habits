import React from "react";
import {
  render,
  fireEvent,
  act,
  waitFor,
  screen,
} from "@testing-library/react-native";
import Account from "../app/(tabs)/account";
import { router } from "expo-router";

describe("Account Screen", () => {
  it("renders correctly", async () => {
    render(<Account />);

    await waitFor(() => {
      expect(screen.getByText("My Account")).toBeTruthy();
      expect(screen.getByText("Update Profile")).toBeTruthy();
      expect(screen.getByText("Friend List")).toBeTruthy();
      expect(screen.getByText("Sign Out")).toBeTruthy();
    });
  });

  it("takes us to Index screen when Sign Out button is pressed", async () => {
    render(<Account />);

    await act(async () => {
      fireEvent.press(screen.getByText("Sign Out"));
    });

    expect(router.replace).toHaveBeenCalledWith("/(account)/sign-in");
  });
});
