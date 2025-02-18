module.exports = {
    preset: "react-native",
    setUpFilesAfterEnv: ["social-habits/jest-setup.js"],
    transformIgnorePatterns: [
        "node_modules/(?!(@react-native|react-native|expo|expo-font|expo-constants)/)",
    ],
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
