export default {
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },

  moduleNameMapper: {
    "\\.(css|less|sass|scss)$": "identity-obj-proxy",
    "^.+\\.svg$": "jest-transformer-svg",
    "^@/(.*)$": "<rootDir>/src/$1",
    "^js-confetti$": "<rootDir>/node_modules/js-confetti/dist/js-confetti.browser.js",
  },

  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
};