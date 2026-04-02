import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { debounce, throttle, rafThrottle, memoize, batch } from '../lib/performance.js';

describe('Performance Utilities', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  describe('debounce', () => {
    it('should delay function execution until wait period elapses', () => {
      const mockFn = vi.fn();
      const debounced = debounce(mockFn, 100);

      debounced('arg1');
      expect(mockFn).not.toHaveBeenCalled();

      vi.advanceTimersByTime(50);
      expect(mockFn).not.toHaveBeenCalled();

      vi.advanceTimersByTime(50);
      expect(mockFn).toHaveBeenCalledWith('arg1');
    });

    it('should only execute once for multiple calls within wait period', () => {
      const mockFn = vi.fn();
      const debounced = debounce(mockFn, 100);

      debounced('call1');
      debounced('call2');
      debounced('call3');

      vi.advanceTimersByTime(100);

      expect(mockFn).toHaveBeenCalledTimes(1);
      expect(mockFn).toHaveBeenCalledWith('call3');
    });

    it('should support leading edge execution', () => {
      const mockFn = vi.fn();
      const debounced = debounce(mockFn, 100, { leading: true });

      debounced('arg1');
      expect(mockFn).toHaveBeenCalledWith('arg1');

      debounced('arg2');
      vi.advanceTimersByTime(100);
      // With leading: true, function is called immediately and also on trailing edge
      expect(mockFn).toHaveBeenCalledTimes(2);
    });

    it('should support maxWait option', () => {
      const mockFn = vi.fn();
      const debounced = debounce(mockFn, 50, { maxWait: 100 });

      debounced('call1');
      vi.advanceTimersByTime(30);
      debounced('call2');
      vi.advanceTimersByTime(30);
      debounced('call3');
      vi.advanceTimersByTime(50); // Exceeds maxWait

      expect(mockFn).toHaveBeenCalled();
    });

    it('should cancel pending execution', () => {
      const mockFn = vi.fn();
      const debounced = debounce(mockFn, 100);

      debounced('arg1');
      debounced.cancel();

      vi.advanceTimersByTime(100);
      expect(mockFn).not.toHaveBeenCalled();
    });

    it('should flush pending execution immediately', () => {
      const mockFn = vi.fn().mockReturnValue('result');
      const debounced = debounce(mockFn, 100);

      debounced('arg1');
      const result = debounced.flush();

      expect(mockFn).toHaveBeenCalledWith('arg1');
      expect(result).toBe('result');
    });

    it('should track pending state', () => {
      const mockFn = vi.fn();
      const debounced = debounce(mockFn, 100);

      expect(debounced.pending()).toBe(false);
      debounced('arg1');
      expect(debounced.pending()).toBe(true);

      vi.advanceTimersByTime(100);
      expect(debounced.pending()).toBe(false);
    });
  });

  describe('throttle', () => {
    it('should execute immediately on first call', () => {
      const mockFn = vi.fn();
      const throttled = throttle(mockFn, 100);

      throttled('arg1');
      expect(mockFn).toHaveBeenCalledWith('arg1');
    });

    it('should limit execution rate', () => {
      const mockFn = vi.fn();
      const throttled = throttle(mockFn, 100);

      throttled('call1');
      throttled('call2');
      throttled('call3');

      expect(mockFn).toHaveBeenCalledTimes(1);
      expect(mockFn).toHaveBeenCalledWith('call1');
    });

    it('should allow execution after wait period', () => {
      const mockFn = vi.fn();
      const throttled = throttle(mockFn, 100);

      throttled('call1');
      vi.advanceTimersByTime(100);
      throttled('call2');

      expect(mockFn).toHaveBeenCalledTimes(2);
      expect(mockFn).toHaveBeenNthCalledWith(1, 'call1');
      expect(mockFn).toHaveBeenNthCalledWith(2, 'call2');
    });

    it('should support leading: false option', () => {
      const mockFn = vi.fn();
      const throttled = throttle(mockFn, 100, { leading: false });

      throttled('call1');
      expect(mockFn).not.toHaveBeenCalled();

      vi.advanceTimersByTime(100);
      expect(mockFn).toHaveBeenCalledWith('call1');
    });
  });

  describe('rafThrottle', () => {
    it('should throttle using requestAnimationFrame', () => {
      const mockFn = vi.fn();
      global.requestAnimationFrame = vi.fn((cb) => setTimeout(cb, 16));
      global.cancelAnimationFrame = vi.fn();

      const throttled = rafThrottle(mockFn);

      throttled('arg1');
      throttled('arg2');

      expect(global.requestAnimationFrame).toHaveBeenCalledTimes(1);

      vi.advanceTimersByTime(16);
      expect(mockFn).toHaveBeenCalledWith('arg2');
    });

    it('should cancel pending animation frame', () => {
      const mockFn = vi.fn();
      global.requestAnimationFrame = vi.fn((cb) => setTimeout(cb, 16));
      global.cancelAnimationFrame = vi.fn();

      const throttled = rafThrottle(mockFn);
      throttled('arg1');
      throttled.cancel();

      expect(global.cancelAnimationFrame).toHaveBeenCalled();
    });
  });

  describe('memoize', () => {
    it('should cache function results', () => {
      const expensiveFn = vi.fn((x) => x * 2);
      const memoized = memoize(expensiveFn);

      const result1 = memoized(5);
      const result2 = memoized(5);

      expect(result1).toBe(10);
      expect(result2).toBe(10);
      expect(expensiveFn).toHaveBeenCalledTimes(1);
    });

    it('should use different cache for different arguments', () => {
      const expensiveFn = vi.fn((x) => x * 2);
      const memoized = memoize(expensiveFn);

      const result1 = memoized(5);
      const result2 = memoized(10);

      expect(result1).toBe(10);
      expect(result2).toBe(20);
      expect(expensiveFn).toHaveBeenCalledTimes(2);
    });

    it('should support custom cache key resolver', () => {
      const expensiveFn = vi.fn((obj) => obj.value * 2);
      const resolver = (obj) => obj.id;
      const memoized = memoize(expensiveFn, resolver);

      const result1 = memoized({ id: 1, value: 5 });
      const result2 = memoized({ id: 1, value: 10 });

      expect(result1).toBe(10);
      expect(result2).toBe(10); // Uses cached result with same id
      expect(expensiveFn).toHaveBeenCalledTimes(1);
    });

    it('should clear cache', () => {
      const expensiveFn = vi.fn((x) => x * 2);
      const memoized = memoize(expensiveFn);

      memoized(5);
      memoized.clear();
      memoized(5);

      expect(expensiveFn).toHaveBeenCalledTimes(2);
    });

    it('should expose cache Map', () => {
      const expensiveFn = vi.fn((x) => x * 2);
      const memoized = memoize(expensiveFn);

      memoized(5);
      memoized(10);

      expect(memoized.cache.size).toBe(2);
    });
  });

  describe('batch', () => {
    it('should batch multiple calls within wait period', () => {
      const batchFn = vi.fn();
      const batched = batch(batchFn, 50);

      batched('item1');
      batched('item2');
      batched('item3');

      expect(batchFn).not.toHaveBeenCalled();

      vi.advanceTimersByTime(50);

      expect(batchFn).toHaveBeenCalledTimes(1);
      expect(batchFn).toHaveBeenCalledWith(['item1', 'item2', 'item3']);
    });

    it('should execute immediately when wait is 0', () => {
      const batchFn = vi.fn();
      const batched = batch(batchFn, 0);

      batched('item1');
      batched('item2');

      vi.advanceTimersByTime(0);

      expect(batchFn).toHaveBeenCalledWith(['item1', 'item2']);
    });

    it('should flush batched items immediately', () => {
      const batchFn = vi.fn();
      const batched = batch(batchFn, 100);

      batched('item1');
      batched('item2');
      batched.flush();

      expect(batchFn).toHaveBeenCalledWith(['item1', 'item2']);
    });

    it('should cancel pending batch', () => {
      const batchFn = vi.fn();
      const batched = batch(batchFn, 100);

      batched('item1');
      batched('item2');
      batched.cancel();

      vi.advanceTimersByTime(100);

      expect(batchFn).not.toHaveBeenCalled();
    });

    it('should handle empty batch flush', () => {
      const batchFn = vi.fn();
      const batched = batch(batchFn, 100);

      batched.flush();

      expect(batchFn).not.toHaveBeenCalled();
    });
  });
});