module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es6: true,
    node: true,
    "jest/globals": true
  },
  plugins: ["jest", "@typescript-eslint"],
  extends: [
    "airbnb-base",
    "prettier",
    "prettier/@typescript-eslint",
    "plugin:@typescript-eslint/recommended"
  ],
  globals: {
    Atomics: "readonly",
    SharedArrayBuffer: "readonly"
  },
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 2018
  },
  settings: {
    "import/resolver": {
      node: {
        extensions: [".js", ".jsx", ".ts", ".tsx"]
      }
    }
  },
  rules: {
    "@typescript-eslint/interface-name-prefix": [
      "error",
      { prefixWithI: "always" }
    ],
    "import/prefer-default-export": 0,
    "class-methods-use-this": 0,
    // "no-restricted-syntax": 0,
    "jest/no-disabled-tests": "warn",
    "jest/no-focused-tests": "error",
    "jest/no-identical-title": "error",
    "jest/prefer-to-have-length": "warn",
    "jest/valid-expect": "error"
  }
};
