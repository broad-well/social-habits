import { create } from "zustand";

type ThemeState = {
  colorTheme: "light" | "dark";
  toggleTheme: () => void;
};

export const useColorTheme = create<ThemeState>((set) => ({
  colorTheme: "light", // Default theme
  toggleTheme: () =>
    set((state) => ({
      colorTheme: state.colorTheme === "light" ? "dark" : "light",
    })),
}));
