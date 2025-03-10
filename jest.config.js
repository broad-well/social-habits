module.exports = {
    preset: "react-native",
    setupFilesAfterEnv: [
        "<rootDir>/jest-setup.js",
        "@testing-library/jest-native/extend-expect"
    ],
    transformIgnorePatterns: [
        "node_modules/(?!(@react-native|react-native|expo|expo-font|expo-constants|radio-buttons-react-native|react-native-vector-icons|@babel/runtime)/)",
    ],
    testEnvironment: 'jsdom',
    moduleNameMapper: {
        "^@/(.*)$": "<rootDir>/$1", // Adjust based on actual project structure
        "^react-native-vector-icons/(.*)$": "<rootDir>/node_modules/react-native-vector-icons/lib/$1"
    },
    transform: {
        "^.+\\.tsx?$": "babel-jest",
        "^.+\\.jsx?$": "babel-jest",
         "^.+\\.(js|jsx|ts|tsx)$": "babel-jest"
    }
};
// "jest": {
//     "preset": "jest-expo",
//     "setupFilesAfterEnv": [
//       "@testing-library/jest-native/extend-expect"
//     ],
//     "transform": {
//       "^.+\\.tsx?$": "babel-jest"
//     }
//   },
