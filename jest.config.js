module.exports = {
    preset: 'react-native',
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    snapshotSerializers: [
        "enzyme-to-json/serializer"
    ],
    setupFilesAfterEnv: [
        "<rootDir>jest_test_setup.tsx"
    ]
};