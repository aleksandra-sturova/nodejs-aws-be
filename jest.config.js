module.exports = {
  resetMocks: true,
  collectCoverage: false,
  testEnvironment: 'node',
  testPathIgnorePatterns: ['/.serverless/', '/.webpack/', '/node_modules/', '/data/', '/constants/'],
  testMatch: ['**/**/*.test.js'],
  roots: ['<rootDir>'],
};
