import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { logger } from '../lib/logger.js';
import { validatePrompt, validateUrl } from '../lib/validator.js';
import { debounce } from '../lib/performance.js';
import { withErrorHandling } from '../lib/errorBoundary.js';
import { ApiClient } from '../lib/apiClient.js';

describe('Production Readiness Integration', () => {
  let mockFetch;
  let consoleSpy;

  beforeEach(() => {
    vi.useFakeTimers();
    
    mockFetch = vi.fn();
    global.fetch = mockFetch;
    
    global.localStorage = {
      getItem: vi.fn().mockReturnValue('test-token'),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn()
    };
    
    consoleSpy = {
      log: vi.fn(),
      info: vi.fn(),
      warn: vi.fn(),
      error: vi.fn(),
      debug: vi.fn()
    };
    global.console = { ...global.console, ...consoleSpy };
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  describe('Validation + Logging Integration', () => {
    it('should validate prompt and log validation result', () => {
      const prompt = 'Generate an image of a sunset';
      
      const validation = validatePrompt(prompt);
      
      expect(validation.valid).toBe(true);
      expect(validation.value).toBe(prompt);
      
      logger.info('Prompt validated successfully', { 
        promptLength: prompt.length,
        valid: validation.valid 
      });
      
      expect(consoleSpy.info).toHaveBeenCalledWith(
        expect.stringContaining('[INFO] Prompt validated successfully')
      );
    });

    it('should validate prompt and sanitize content', () => {
      const promptWithHtml = '<script>alert("test")</script>Beautiful sunset';
      
      const validation = validatePrompt(promptWithHtml);
      
      // Validator accepts the prompt but sanitizes it
      expect(validation.valid).toBe(true);
      // The sanitized value should have HTML double-escaped
      expect(validation.value).toContain('&amp;lt;script&amp;gt;');
      
      logger.info('Prompt validated and sanitized', {
        originalLength: promptWithHtml.length,
        sanitizedLength: validation.value.length
      });
      
      expect(consoleSpy.info).toHaveBeenCalledWith(
        expect.stringContaining('[INFO] Prompt validated and sanitized')
      );
    });
  });

  describe('Debounce + API Client Integration', () => {
    it('should debounce API calls to prevent excessive requests', async () => {
      const client = new ApiClient('https://api.example.com');
      
      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ success: true })
      });
      
      const debouncedFetch = debounce(async (query) => {
        return client.get(`/search?q=${encodeURIComponent(query)}`);
      }, 300);
      
      // Make multiple rapid calls
      debouncedFetch('test1');
      debouncedFetch('test2');
      debouncedFetch('test3');
      
      // No calls should be made yet
      expect(mockFetch).not.toHaveBeenCalled();
      
      // Advance timer past debounce delay
      vi.advanceTimersByTime(300);
      
      // Wait for async operations
      await vi.runAllTimersAsync();
      
      // Only the last call should have been made
      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('search?q=test3'),
        expect.any(Object)
      );
    });
  });

  describe('Error Handling + Retry Integration', () => {
    it('should handle errors gracefully with logging', async () => {
      const failingOperation = async () => {
        throw new Error('Operation failed');
      };
      
      const stableOperation = withErrorHandling(
        failingOperation,
        { retries: 0, onError: (error) => logger.error('Operation failed', { error: error.message }) }
      );
      
      await expect(stableOperation()).rejects.toThrow('Operation failed');
      
      logger.info('Error handled and logged', {
        operation: 'failingOperation'
      });
      
      expect(consoleSpy.error).toHaveBeenCalled();
      expect(consoleSpy.info).toHaveBeenCalledWith(
        expect.stringContaining('[INFO] Error handled and logged')
      );
    });
  });

  describe('Full Production Pipeline', () => {
    it('should handle complete user input to API call pipeline', async () => {
      const client = new ApiClient('https://api.example.com');
      
      // Simulate user input
      const userInput = 'Create a beautiful landscape';
      
      // Step 1: Validate input
      const validation = validatePrompt(userInput);
      expect(validation.valid).toBe(true);
      
      logger.info('Input validated', { inputLength: userInput.length });
      
      // Step 2: Validate URL
      const apiUrl = 'https://api.example.com/generate';
      const urlValidation = validateUrl(apiUrl);
      expect(urlValidation.valid).toBe(true);
      
      // Step 3: Make API call (no retry needed for this test)
      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ 
          image: 'https://example.com/image.png',
          prompt: validation.value 
        })
      });
      
      const generateImage = async (prompt) => {
        return client.post('/generate', { prompt });
      };
      
      const result = await generateImage(validation.value);
      
      expect(result.data.image).toBe('https://example.com/image.png');
      expect(result.data.prompt).toBe(userInput);
      
      logger.info('Image generation successful', {
        prompt: userInput,
        imageUrl: result.data.image
      });
      
      // Verify all logging occurred
      expect(consoleSpy.info).toHaveBeenCalledWith(
        expect.stringContaining('[INFO] Input validated')
      );
      expect(consoleSpy.info).toHaveBeenCalledWith(
        expect.stringContaining('[INFO] Image generation successful')
      );
    });

    it('should handle validation and sanitization gracefully', () => {
      const inputWithHtml = '<img src=x onerror=alert(1)>Create beautiful art';
      
      const validation = validatePrompt(inputWithHtml);
      
      // Validator accepts but sanitizes the input
      expect(validation.valid).toBe(true);
      expect(validation.value).toContain('&amp;lt;img');
      
      logger.info('Input sanitized successfully', {
        originalLength: inputWithHtml.length,
        sanitized: true
      });
      
      expect(consoleSpy.info).toHaveBeenCalledWith(
        expect.stringContaining('[INFO] Input sanitized successfully')
      );
    });
  });
});