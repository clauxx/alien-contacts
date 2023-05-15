module.exports = function(api) {
  api.cache(false);
  return {
    presets: ['module:metro-react-native-babel-preset'],
    plugins: [
      ["module:react-native-dotenv", {
        "moduleName": "@env",
        "path": ".env",
      }],
      ['react-native-reanimated/plugin'],
      ["babel-plugin-styled-components"],
      [
        "module-resolver",
        {
          extensions: [
            ".js",
            ".jsx",
            ".ts",
            ".tsx",
            ".android.js",
            ".android.tsx",
            ".ios.js",
            ".ios.tsx",
            ".json",
          ],
          root: ["./src"],
          alias: {
            "@": "./src/",
          },
        },
      ],
    ],
  }
}

