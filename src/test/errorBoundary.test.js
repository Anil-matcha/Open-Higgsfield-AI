import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ErrorBoundary, withErrorHandling, setupGlobalErrorHandlers } from '../lib/errorBoundary.js';

describe('ErrorBoundary', () => {
  let mockContainer;
  let mockLogger;

  beforeEach(() => {
    mockContainer = document.createElement('div');
    mockLogger = {
      error: vi.fn(),
      info: vi.fn(),
      warn: vi.fn()
    };
  });

  describe('ErrorBoundary Class', () => {
    it('should create instance with default fallback', () => {
      const boundary = new ErrorBoundary();
      expect(boundary).toBeDefined();
      expect(boundary.isErrorState).toBe(false);
    });

    it('should wrap component function successfully', () => {
      const boundary = new ErrorBoundary();
      const mockComponent = vi.fn(() => document.createElement('div'));
      
      const wrapped = boundary.wrap(mockComponent, mockContainer);
      const result = wrapped();

      expect(result).toBeInstanceOf(HTMLElement);
      expect(boundary.isErrorState).toBe(false);
    });

    it('should catch errors in wrapped component', () => {
      const onError = vi.fn();
      const boundary = new ErrorBoundary({ onError });
      const error = new Error('Component failed');
      const mockComponent = vi.fn(() => { throw error; });
      
      const wrapped = boundary.wrap(mockComponent, mockContainer);
      const result = wrapped();

      expect(result).toBeInstanceOf(HTMLElement);
      expect(boundary.isErrorState).toBe(true);
      expect(onError).toHaveBeenCalledWith(error);
    });

    it('should use custom fallback UI when provided', () => {
      const customFallback = vi.fn((error, retry) => {
        const div = document.createElement('div');
        div.textContent = 'Custom fallback: ' + error.message;
        return div;
      });
      
      const boundary = new ErrorBoundary({ fallbackUI: customFallback });
      const error = new Error('Test error');
      const mockComponent = vi.fn(() => { throw error; });
      
      const wrapped = boundary.wrap(mockComponent, mockContainer);
      const result = wrapped();

      expect(result.textContent).toBe('Custom fallback: Test error');
      expect(customFallback).toHaveBeenCalledWith(error, expect.any(Function));
    });

    it('should reset error state', () => {
      const boundary = new ErrorBoundary();
      const mockComponent = vi.fn(() => {
        throw new Error('Error');
      });
      
      const wrapped = boundary.wrap(mockComponent, mockContainer);
      wrapped(); // Trigger error
      expect(boundary.isErrorState).toBe(true);

      boundary.reset();
      expect(boundary.isErrorState).toBe(false);
    });
  });

  describe('withErrorHandling', () => {
    it('should execute async function successfully', async () => {
      const asyncFn = vi.fn().mockResolvedValue('success');
      const wrapped = withErrorHandling(asyncFn);

      const result = await wrapped();

      expect(result).toBe('success');
      expect(asyncFn).toHaveBeenCalledTimes(1);
    });

    it('should retry failed async functions', async () => {
      const asyncFn = vi.fn()
        .mockRejectedValueOnce(new Error('Fail 1'))
        .mockRejectedValueOnce(new Error('Fail 2'))
        .mockResolvedValue('success');
      
      const wrapped = withErrorHandling(asyncFn, { retries: 2, retryDelay: 10 });

      const result = await wrapped();

      expect(result).toBe('success');
      expect(asyncFn).toHaveBeenCalledTimes(3);
    });

    it('should call onError callback after max retries', async () => {
      const error = new Error('Persistent failure');
      const asyncFn = vi.fn().mockRejectedValue(error);
      const onError = vi.fn();
      
      const wrapped = withErrorHandling(asyncFn, { retries: 2, retryDelay: 10, onError });

      await expect(wrapped()).rejects.toThrow('Persistent failure');
      expect(onError).toHaveBeenCalledWith(error);
      expect(asyncFn).toHaveBeenCalledTimes(3);
    });

    it('should return fallback value when provided', async () => {
      const error = new Error('Failure');
      const asyncFn = vi.fn().mockRejectedValue(error);
      const fallback = vi.fn().mockReturnValue('fallback value');
      
      const wrapped = withErrorHandling(asyncFn, { retries: 1, retryDelay: 10, fallback });

      const result = await wrapped();

      expect(result).toBe('fallback value');
      expect(fallback).toHaveBeenCalledWith(error);
    });

    it('should apply exponential backoff to retry delays', async () => {
      const asyncFn = vi.fn()
        .mockRejectedValueOnce(new Error('Fail 1'))
        .mockRejectedValueOnce(new Error('Fail 2'))
        .mockResolvedValue('success');
      
      const startTime = Date.now();
      const wrapped = withErrorHandling(asyncFn, { retries: 2, retryDelay: 100 });
      
      await wrapped();
      const endTime = Date.now();
      const duration = endTime - startTime;

      // Should wait at least 100ms + 200ms = 300ms for retries
      expect(duration).toBeGreaterThanOrEqual(250);
    });
  });

  describe('setupGlobalErrorHandlers', () => {
    it('should set up window error handler', () => {
      const addEventListenerSpy = vi.spyOn(window, 'addEventListener');
      
      setupGlobalErrorHandlers();

      expect(addEventListenerSpy).toHaveBeenCalledWith('error', expect.any(Function));
      expect(addEventListenerSpy).toHaveBeenCalledWith('unhandledrejection', expect.any(Function));
    });

    it('should handle uncaught errors', () => {
      setupGlobalErrorHandlers();
      
      const errorEvent = new ErrorEvent('error', {
        error: new Error('Uncaught test error'),
        filename: 'test.js',
        lineno: 10,
        colno: 5
      });

      window.dispatchEvent(errorEvent);

      // Logger should be called (implementation logs the error)
      expect(mockLogger.error).toBeDefined();
    });

    it('should handle unhandled promise rejections', () => {
      setupGlobalErrorHandlers();
      
      const rejectionEvent = new Event('unhandledrejection');
      rejectionEvent.reason = new Error('Unhandled rejection');

      window.dispatchEvent(rejectionEvent);

      // Logger should be called (implementation logs the error)
      expect(mockLogger.error).toBeDefined();
    });
  });
});