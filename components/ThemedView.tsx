import { View, type ViewProps } from "react-native";

import { useColorTheme } from "@/stores/useColorTheme";

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
};

export function ThemedView({
  style,
  lightColor,
  darkColor,
  ...otherProps
}: ThemedViewProps) {
  const { colorTheme } = useColorTheme();

  return (
    <View
      style={[
        { backgroundColor: colorTheme === "light" ? lightColor : darkColor },
        style,
      ]}
      {...otherProps}
    />
  );
}
