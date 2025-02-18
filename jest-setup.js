import "@testing-library/jest-native/extend-expect";
import "react-native-gesture-handler/jestSetup";

jest.mock("expo-font", () => ({
    isLoaded: jest.fn(() => true),
    loadAsync: jest.fn(),
    useFonts: () => [true],
}));

jest.mock("expo-constants", () => ({
    manifest: {
        extra: {},
    },
}));

jest.mock("react-native/Libraries/Animated/NativeAnimatedHelper");

jest.setTimeout(30000); // 30 seconds
