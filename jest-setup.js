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
        back: jest.fn(),
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

jest.mock('react-native-safe-area-context', () => ({
    ...jest.requireActual('react-native-safe-area-context'),
    useSafeAreaInsets: () => ({ top: 0, right: 0, bottom: 0, left: 0 }),
}));

jest.mock('./assets/fonts/Poppins/Poppins-Regular.ttf', () => '');
jest.mock('./assets/fonts/Poppins/Poppins-Bold.ttf', () => '');

const mockCollection = jest.fn();
const mockWhere = jest.fn();
const mockGet = jest.fn();
const mockAdd = jest.fn();
const mockUpdate = jest.fn();
const mockDoc = jest.fn();
const mockSet = jest.fn();

const collectionMocks = {};

jest.mock("./firebaseConfig", () => ({
    db: {
        collection: (collectionName) => {
            if (!collectionMocks[collectionName]) {
                collectionMocks[collectionName] = {
                    where: mockWhere,
                    add: mockAdd,
                    doc: mockDoc,
                };
            }
            return collectionMocks[collectionName];
        },
    },
}));

beforeEach(() => {
    mockWhere.mockReturnValue({
        where: mockWhere,
        get: mockGet,
    });

    mockGet.mockResolvedValue({ empty: true });
    mockAdd.mockResolvedValue(undefined);

    mockDoc.mockReturnValue({
        update: mockUpdate,
        set: mockSet,
    });

    mockUpdate.mockResolvedValue(undefined);
    mockSet.mockResolvedValue(undefined);
});

export { mockCollection, mockWhere, mockGet, mockAdd, mockUpdate, mockDoc, mockSet };

global.setImmediate = (callback) => setTimeout(callback, 0); // eslint-disable-line

jest.setTimeout(30000); // 30 seconds
