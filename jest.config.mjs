import nextJest from "next/jest.js";

const createJestConfig = nextJest({
  // Path to the Next.js app to load next.config and .env files in the test environment
  dir: "./",
});

/** @type {import('jest').Config} */
const customJestConfig = {
  testEnvironment: "jest-environment-jsdom",
  // Resolve the "@/..." path alias to the project root (matches tsconfig "paths").
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
  },
  // Allow importing TS/TSX modules without an explicit extension.
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  // Collect tests from the __test__ directory.
  testMatch: ["<rootDir>/__test__/**/*.test.(ts|tsx)"],
};

// next/jest returns an async config; export it so Jest resolves the SWC transform.
export default createJestConfig(customJestConfig);
