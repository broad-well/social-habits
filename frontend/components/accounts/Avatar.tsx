import { useColorTheme } from "@/stores/useColorTheme";
import React from "react";
import { Image } from "react-native";
import { DefaultTheme } from "react-native-paper";
import DarkThemeColors from "@/constants/DarkThemeColors.json";
import LightThemeColors from "@/constants/LightThemeColors.json";

export interface AvatarProps {
  imageUrl: string;
  size?: number;
}

export default function Avatar(props: AvatarProps) {
  const { colorTheme } = useColorTheme();

  const theme = {
    ...DefaultTheme,
    colors:
      colorTheme === "light" ? LightThemeColors.colors : DarkThemeColors.colors,
  };

  const avatarStyle = {
    width: props.size ?? 120,
    height: props.size ?? 120,
    borderRadius: props.size ?? 120,
    borderWidth: 3,
    borderColor: theme.colors.onPrimary,
  };

  return <Image
    source={{
      uri: props.imageUrl,
    }} // Placeholder image
    style={avatarStyle}
  />;
}

