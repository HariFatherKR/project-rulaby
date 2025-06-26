// Jest setup file for environment variables and mocks
process.env.NODE_ENV = 'test';

// Mock Firebase to avoid initialization in tests
jest.mock('./lib/firebase', () => ({
  db: {
    collection: jest.fn(),
    doc: jest.fn()
  }
}));

// Mock file system operations
jest.mock('fs/promises');