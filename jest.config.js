module.exports = {
    preset: 'react-native',
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    snapshotSerializers: [
        "enzyme-to-json/serializer"
    ],
    setupFiles: [
        "./node_modules/react-native-gesture-handler/jestSetup.js"
    ],
    setupFilesAfterEnv: [
        "<rootDir>jest_test_setup.tsx"
    ]
};