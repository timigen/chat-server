module.exports = {
    roots: ['<rootDir>'],
    transform: {
      "^.+\\.ts?$": "ts-jest"
    },
    testPathIgnorePatterns: [
      "/node_modules/"
    ],
    testMatch: [
        "**/*.test.ts"
    ],
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  }