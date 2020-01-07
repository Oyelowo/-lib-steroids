module.exports = {
  roots: ["<rootDir>"],
  transform: {
    "^.+\\.ts$": "ts-jest"
  },
  testRegex: "(/__tests__/.*.(test|spec)).(ts?|js?|jsx?|tsx?)$",
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  collectCoverage: false,
  coveragePathIgnorePatterns: ["(tests/.*.mock).(jsx?|tsx?|js?|ts?)$"],
  verbose: true
};


