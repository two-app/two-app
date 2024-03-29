module.exports = {
  preset: 'react-native',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  setupFiles: ['./node_modules/react-native-gesture-handler/jestSetup.js'],
  setupFilesAfterEnv: ['<rootDir>jest_test_setup.tsx'],
  transformIgnorePatterns: [],
  modulePathIgnorePatterns: [
    '<rootDir>/__tests__/utils/',
    '<rootDir>/__tests__/helpers/',
  ],
};
