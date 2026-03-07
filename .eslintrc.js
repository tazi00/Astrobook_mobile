module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint", "react", "react-native", "react-hooks"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
  ],
  rules: {
    "react/react-in-jsx-scope": "off", // Not needed in React 17+
    "@typescript-eslint/no-unused-vars": "error",
    "react-native/no-unused-styles": "error",
    "react-native/no-inline-styles": "warn",
  },
  settings: {
    react: { version: "detect" },
  },
};
