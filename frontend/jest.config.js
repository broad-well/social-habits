module.exports = {
  preset: "react-native",
  setupFilesAfterEnv: [
    "<rootDir>/jest-setup.js",
    "@testing-library/jest-native/extend-expect",
  ],
  transformIgnorePatterns: [
    "node_modules/(?!(@react-native|react-native|react-navigation|react-native-gesture-handler|expo|expo-font|expo-constants|react-native-radio-buttons-group|react-native-vector-icons|@babel/runtime|@react-native-community/datetimepicker)/)",
  ],
  testEnvironment: "jsdom",
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1", // Adjust based on actual project structure
    "^react-native-vector-icons/(.*)$":
      "<rootDir>/node_modules/react-native-vector-icons/lib/$1",
    "/^react-native-vector-icons/(.*)$/":
      "<rootDir>/node_modules/react-native-vector-icons/lib/$1",
    "\\.(png|jpg|jpeg|gif|svg)$": "<rootDir>/__mocks__/fileMock.js",
  },
  transform: {
    "^.+\\.tsx?$": "babel-jest",
    "^.+\\.jsx?$": "babel-jest",
    "^.+\\.(js|jsx|ts|tsx)$": "babel-jest",
  },
  resolver: undefined,
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
