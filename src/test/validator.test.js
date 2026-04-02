import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  validatePrompt,
  validateUrl,
  validateFile,
  sanitizeString
} from '../lib/validator.js';

describe('Validator Utilities', () => {
  describe('validatePrompt', () => {
    it('should validate valid prompts', () => {
      const result = validatePrompt('A beautiful landscape');
      expect(result.valid).toBe(true);
      expect(result.value).toBe('A beautiful landscape');
    });

    it('should reject empty prompts', () => {
      const result = validatePrompt('');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('required');
    });

    it('should reject prompts that are too long', () => {
      const longPrompt = 'a'.repeat(5000);
      const result = validatePrompt(longPrompt);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('exceed');
    });
  });

  describe('validateUrl', () => {
    it('should validate valid URLs', () => {
      const result = validateUrl('https://example.com');
      expect(result.valid).toBe(true);
      expect(result.value).toBe('https://example.com');
    });

    it('should reject invalid URLs', () => {
      const result = validateUrl('javascript:alert("xss")');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('Invalid URL');
    });

    it('should handle null/undefined input', () => {
      const result = validateUrl(null);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('required');
    });
  });

  describe('validateFile', () => {
    it('should validate valid image files', () => {
      const validFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      Object.defineProperty(validFile, 'size', { value: 1024 * 1024 }); // 1MB
      const result = validateFile(validFile);
      expect(result.valid).toBe(true);
    });

    it('should reject files that are too large', () => {
      const largeFile = new File(['test'], 'large.jpg', { type: 'image/jpeg' });
      Object.defineProperty(largeFile, 'size', { value: 50 * 1024 * 1024 }); // 50MB
      const result = validateFile(largeFile);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('exceed');
    });

    it('should reject invalid file types', () => {
      const invalidFile = new File(['test'], 'test.exe', { type: 'application/exe' });
      const result = validateFile(invalidFile);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('type must be');
    });
  });

  describe('sanitizeString', () => {
    it('should sanitize safe strings', () => {
      const result = sanitizeString('Hello World 123');
      expect(result).toBe('Hello World 123');
    });

    it('should escape HTML characters', () => {
      const result = sanitizeString('<script>alert("xss")</script>');
      expect(result).toContain('&amp;lt;script&amp;gt;');
      expect(result).toContain('&amp;gt;');
    });
  });
});