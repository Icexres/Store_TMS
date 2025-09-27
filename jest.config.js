// jest.config.js
module.exports = {
  preset: 'ts-jest',  // Use ts-jest for TypeScript
  testEnvironment: 'jsdom',  // Use jsdom to simulate a browser environment
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',  // Use ts-jest for .ts and .tsx files
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  setupFilesAfterEnv: ['@testing-library/jest-dom/extend-expect'],  // Extends jest-dom matchers
};
