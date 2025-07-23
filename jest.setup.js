// Jest setup file for environment variables and mocks
process.env.NODE_ENV = 'test';

// Mock file system operations
jest.mock('fs/promises');