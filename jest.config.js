module.exports = {
    preset: "react-native",
    setupFilesAfterEnv: ["<rootDir>/jest-setup.js"],
    transformIgnorePatterns: [
        "node_modules/(?!(@react-native|react-native|expo|expo-font|expo-constants)/)",
    ],
    testEnvironment: 'jsdom',
    moduleNameMapper: {
        "^@/(.*)$": "<rootDir>/$1" // Adjust based on actual project structure
      },
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
