import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ApiClient, api } from '../lib/apiClient.js';

describe('API Client', () => {
  let mockFetch;

  beforeEach(() => {
    vi.useFakeTimers();
    mockFetch = vi.fn();
    global.fetch = mockFetch;
    global.localStorage = {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn()
    };
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  describe('ApiClient Class', () => {
    it('should create instance with base URL', () => {
      const client = new ApiClient('https://api.example.com');
      expect(client.baseUrl).toBe('https://api.example.com');
    });

    it('should create instance with empty base URL', () => {
      const client = new ApiClient();
      expect(client.baseUrl).toBe('');
    });
  });

  describe('GET requests', () => {
    it('should make successful GET request', async () => {
      const client = new ApiClient('https://api.example.com');
      const mockResponse = { data: { id: 1, name: 'Test' } };

      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        json: () => Promise.resolve(mockResponse)
      });

      localStorage.getItem.mockReturnValue('test-token');

      const result = await client.get('/users/1');

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.example.com/users/1',
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer test-token'
          })
        })
      );
      expect(result.data).toEqual(mockResponse);
    });

    it('should handle GET request without auth token', async () => {
      const client = new ApiClient('https://api.example.com');
      const mockResponse = { data: 'test' };

      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        json: () => Promise.resolve(mockResponse)
      });

      localStorage.getItem.mockReturnValue(null);

      const result = await client.get('/public/data', { requireAuth: false });

      expect(result.data).toEqual(mockResponse);
    });
  });

  describe('POST requests', () => {
    it('should make successful POST request', async () => {
      const client = new ApiClient('https://api.example.com');
      const postData = { name: 'New User' };
      const mockResponse = { id: 1, ...postData };

      mockFetch.mockResolvedValue({
        ok: true,
        status: 201,
        json: () => Promise.resolve(mockResponse)
      });

      localStorage.getItem.mockReturnValue('test-token');

      const result = await client.post('/users', postData);

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.example.com/users',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(postData),
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer test-token'
          })
        })
      );
      expect(result.data).toEqual(mockResponse);
    });
  });

  describe('PUT requests', () => {
    it('should make successful PUT request', async () => {
      const client = new ApiClient('https://api.example.com');
      const updateData = { name: 'Updated User' };
      const mockResponse = { id: 1, ...updateData };

      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        json: () => Promise.resolve(mockResponse)
      });

      localStorage.getItem.mockReturnValue('test-token');

      const result = await client.put('/users/1', updateData);

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.example.com/users/1',
        expect.objectContaining({
          method: 'PUT',
          body: JSON.stringify(updateData)
        })
      );
      expect(result.data).toEqual(mockResponse);
    });
  });

  describe('DELETE requests', () => {
    it('should make successful DELETE request', async () => {
      const client = new ApiClient('https://api.example.com');
      const mockResponse = { success: true };

      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        json: () => Promise.resolve(mockResponse)
      });

      localStorage.getItem.mockReturnValue('test-token');

      const result = await client.delete('/users/1');

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.example.com/users/1',
        expect.objectContaining({
          method: 'DELETE'
        })
      );
      expect(result.data).toEqual(mockResponse);
    });
  });

  describe('Error handling', () => {
    it('should throw error for HTTP errors', async () => {
      const client = new ApiClient('https://api.example.com');
      const errorResponse = { message: 'Not found' };

      mockFetch.mockResolvedValue({
        ok: false,
        status: 404,
        statusText: 'Not Found',
        json: () => Promise.resolve(errorResponse)
      });

      localStorage.getItem.mockReturnValue('test-token');

      await expect(client.get('/users/999')).rejects.toThrow('Not found');
    });

    it('should retry on server errors', async () => {
      const client = new ApiClient('https://api.example.com');

      mockFetch
        .mockRejectedValueOnce(new Error('Server error'))
        .mockResolvedValue({
          ok: true,
          status: 200,
          json: () => Promise.resolve({ success: true })
        });

      localStorage.getItem.mockReturnValue('test-token');

      const promise = client.get('/data');

      // Advance timers for retry delay
      await vi.advanceTimersByTimeAsync(1000);

      const result = await promise;

      expect(mockFetch).toHaveBeenCalledTimes(2);
      expect(result.data).toEqual({ success: true });
    });

    it('should not retry on client errors (except 429)', async () => {
      const client = new ApiClient('https://api.example.com');

      mockFetch.mockResolvedValue({
        ok: false,
        status: 400,
        statusText: 'Bad Request',
        json: () => Promise.resolve({ message: 'Invalid input' })
      });

      localStorage.getItem.mockReturnValue('test-token');

      await expect(client.post('/data', {})).rejects.toThrow('Invalid input');
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    it('should pass signal to fetch for abort capability', async () => {
      const client = new ApiClient('https://api.example.com');

      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ success: true })
      });

      localStorage.getItem.mockReturnValue('test-token');

      await client.get('/data');

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          signal: expect.any(Object)
        })
      );
    });
  });

  describe('Default API instance', () => {
    it('should export default api instance', () => {
      expect(api).toBeDefined();
      expect(api).toBeInstanceOf(ApiClient);
    });
  });
});