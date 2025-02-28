import {jest} from '@jest/globals'
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

jest.mock('expo-router', () => ({
    Link: jest.fn().mockImplementation(({ children }) => children),
    Stack: {
        Screen: jest.fn(),
    },
    router: {
        push: jest.fn(),
        replace: jest.fn(),
    }
}));

jest.mock('expo-splash-screen', () => ({
    hideAsync: jest.fn(),
}));

jest.mock('./stores/useColorTheme', () => ({
    useColorTheme: () => ({
        colorTheme: 'light'
    })
}));

jest.mock('./assets/fonts/Poppins/Poppins-Regular.ttf', () => '');
jest.mock('./assets/fonts/Poppins/Poppins-Bold.ttf', () => '');

global.setImmediate = (callback) => setTimeout(callback, 0); // eslint-disable-line

jest.setTimeout(30000); // 30 seconds
