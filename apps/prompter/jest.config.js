const nextJest = require('next/jest')

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './apps/prompter',
})

// Add any custom config to be passed to Jest
const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/apps/prompter/jest.setup.js'],
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/apps/prompter/$1',
  },
  rootDir: '../../',
  testPathIgnorePatterns: ['/node_modules/', '/.next/', '/games/'],
  testMatch: [
    '<rootDir>/apps/prompter/**/__tests__/**/*.{js,jsx,ts,tsx}',
    '<rootDir>/apps/prompter/**/*.{spec,test}.{js,jsx,ts,tsx}',
  ],
  collectCoverageFrom: [
    'apps/prompter/app/**/*.{js,jsx,ts,tsx}',
    'apps/prompter/components/**/*.{js,jsx,ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!**/.next/**',
    '!**/*.test.{js,jsx,ts,tsx}',
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
}

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig)
