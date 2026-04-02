import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { logger } from '../lib/logger.js';

describe('Logger Utilities', () => {
  let consoleSpy;
  let localStorageMock;

  beforeEach(() => {
    // Mock console methods
    consoleSpy = {
      log: vi.fn(),
      warn: vi.fn(),
      error: vi.fn(),
      info: vi.fn(),
      debug: vi.fn()
    };
    global.console = { ...global.console, ...consoleSpy };

    // Mock localStorage
    localStorageMock = {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn()
    };
    global.localStorage = localStorageMock;

    // Setup localStorage to return empty array by default
    localStorageMock.getItem.mockReturnValue('[]');
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Basic logging methods', () => {
    it('should filter debug messages by default', () => {
      logger.debug('Test debug message', { userId: 123 });

      expect(consoleSpy.debug).not.toHaveBeenCalled();
    });

    it('should log info messages', () => {
      logger.info('Test info message', { action: 'login' });

      expect(consoleSpy.info).toHaveBeenCalledWith(
        expect.stringContaining('[INFO] Test info message')
      );
    });

    it('should log warning messages', () => {
      const testError = new Error('Test error');
      logger.warn('Test warning', { code: 'WARN001' }, testError);

      expect(consoleSpy.warn).toHaveBeenCalledWith(
        expect.stringContaining('[WARN] Test warning')
      );
    });

    it('should log error messages', () => {
      const testError = new Error('Test error');
      logger.error('Test error message', { errorCode: 'ERR001' }, testError);

      expect(consoleSpy.error).toHaveBeenCalledWith(
        expect.stringContaining('[ERROR] Test error message')
      );
    });

    it('should log fatal messages', () => {
      const testError = new Error('Fatal error');
      logger.fatal('Test fatal message', { severity: 'high' }, testError);

      expect(consoleSpy.error).toHaveBeenCalledWith(
        expect.stringContaining('[FATAL] Test fatal message')
      );
    });
  });

  describe('Scoped logging', () => {
    it('should create scoped loggers', () => {
      const scopedLogger = logger.scope('API', { service: 'user-service' });

      expect(typeof scopedLogger.debug).toBe('function');
      expect(typeof scopedLogger.info).toBe('function');
      expect(typeof scopedLogger.warn).toBe('function');
      expect(typeof scopedLogger.error).toBe('function');
      expect(typeof scopedLogger.fatal).toBe('function');
    });

    it('should include scope in logged messages', () => {
      const scopedLogger = logger.scope('API', { service: 'user-service' });

      scopedLogger.info('User authenticated', { userId: 123 });

      expect(consoleSpy.info).toHaveBeenCalledWith(
        expect.stringContaining('[INFO] User authenticated')
      );
    });
  });

  describe('Log storage and retrieval', () => {
    it('should store logs in localStorage', () => {
      logger.info('Test message for storage', { test: true });

      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'app_logs',
        expect.stringContaining('Test message for storage')
      );
    });

    it('should retrieve logs with filters', () => {
      const mockLogs = JSON.stringify([
        { level: 'INFO', message: 'Info log', timestamp: Date.now() },
        { level: 'ERROR', message: 'Error log', timestamp: Date.now() }
      ]);
      localStorageMock.getItem.mockReturnValue(mockLogs);

      const logs = logger.getLogs({ level: 'ERROR' });

      expect(logs).toHaveLength(1);
      expect(logs[0].level).toBe('ERROR');
    });

    it('should handle empty log storage', () => {
      localStorageMock.getItem.mockReturnValue(null);

      const logs = logger.getLogs();

      expect(logs).toEqual([]);
    });
  });

  describe('Sensitive data filtering', () => {
    it('should filter sensitive data from context', () => {
      logger.info('Login attempt', {
        username: 'testuser',
        password: 'secret123',
        apiKey: 'sk-123456',
        token: 'jwt-token-here',
        email: 'user@example.com'
      });

      const loggedCall = consoleSpy.info.mock.calls[0];
      const loggedString = loggedCall[0]; // The logged message is the first argument

      expect(loggedString).not.toContain('secret123');
      expect(loggedString).not.toContain('sk-123456');
      expect(loggedString).not.toContain('jwt-token-here');
      expect(loggedString).toContain('user@example.com'); // Email should not be filtered
    });
  });
});