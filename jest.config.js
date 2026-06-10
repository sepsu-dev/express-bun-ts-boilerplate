export default {
  preset: "ts-jest/presets/default-esm",
  testEnvironment: "node",
  clearMocks: true,
  collectCoverage: true,
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        tsconfig: "tsconfig.jest.json",
        useESM: false,
      },
    ],
  },
  extensionsToTreatAsEsm: [".ts"],
  testMatch: ["**/*.spec.ts"],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};
