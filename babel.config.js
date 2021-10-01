module.exports = {
  presets: [
    ["module:metro-react-native-babel-preset", {
      "runtime": "automatic"
    }]
  ],
  plugins: [
    ["@babel/plugin-transform-react-jsx", {
      "runtime": "automatic"
    }]
  ]
};
