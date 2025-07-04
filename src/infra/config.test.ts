import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { getDebugConfig, isDebugMode, getDebugDataset, shouldShowDebugInfo } from './config';

describe('config', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe('getDebugConfig', () => {
    it('should return default config when no env vars are set', () => {
      delete process.env.DEBUG_MODE;
      delete process.env.DEBUG_DATASET;
      delete process.env.DEBUG_SHOW_INFO;
      delete process.env.NODE_ENV;

      const config = getDebugConfig();
      
      expect(config.enabled).toBe(false);
      expect(config.dataset).toBe('basic');
      expect(config.showDebugInfo).toBe(false);
    });

    it('should enable debug mode when DEBUG_MODE=true', () => {
      process.env.DEBUG_MODE = 'true';
      
      const config = getDebugConfig();
      
      expect(config.enabled).toBe(true);
    });

    it('should enable debug mode when NODE_ENV=test', () => {
      process.env.NODE_ENV = 'test';
      
      const config = getDebugConfig();
      
      expect(config.enabled).toBe(true);
    });

    it('should use custom dataset when DEBUG_DATASET is set', () => {
      process.env.DEBUG_DATASET = 'large-dataset';
      
      const config = getDebugConfig();
      
      expect(config.dataset).toBe('large-dataset');
    });

    it('should show debug info when DEBUG_SHOW_INFO=true', () => {
      process.env.DEBUG_SHOW_INFO = 'true';
      
      const config = getDebugConfig();
      
      expect(config.showDebugInfo).toBe(true);
    });

    it('should return comprehensive config with all env vars set', () => {
      process.env.DEBUG_MODE = 'true';
      process.env.DEBUG_DATASET = 'priority-showcase';
      process.env.DEBUG_SHOW_INFO = 'true';
      
      const config = getDebugConfig();
      
      expect(config.enabled).toBe(true);
      expect(config.dataset).toBe('priority-showcase');
      expect(config.showDebugInfo).toBe(true);
    });
  });

  describe('isDebugMode', () => {
    it('should return false by default', () => {
      delete process.env.DEBUG_MODE;
      delete process.env.NODE_ENV;
      
      expect(isDebugMode()).toBe(false);
    });

    it('should return true when DEBUG_MODE=true', () => {
      process.env.DEBUG_MODE = 'true';
      
      expect(isDebugMode()).toBe(true);
    });

    it('should return true when NODE_ENV=test', () => {
      process.env.NODE_ENV = 'test';
      
      expect(isDebugMode()).toBe(true);
    });
  });

  describe('getDebugDataset', () => {
    it('should return basic by default', () => {
      delete process.env.DEBUG_DATASET;
      
      expect(getDebugDataset()).toBe('basic');
    });

    it('should return custom dataset when set', () => {
      process.env.DEBUG_DATASET = 'large-dataset';
      
      expect(getDebugDataset()).toBe('large-dataset');
    });
  });

  describe('shouldShowDebugInfo', () => {
    it('should return false by default', () => {
      delete process.env.DEBUG_SHOW_INFO;
      
      expect(shouldShowDebugInfo()).toBe(false);
    });

    it('should return true when DEBUG_SHOW_INFO=true', () => {
      process.env.DEBUG_SHOW_INFO = 'true';
      
      expect(shouldShowDebugInfo()).toBe(true);
    });

    it('should return false when DEBUG_SHOW_INFO=false', () => {
      process.env.DEBUG_SHOW_INFO = 'false';
      
      expect(shouldShowDebugInfo()).toBe(false);
    });
  });
});

if (import.meta.vitest) {
  const { test, expect } = import.meta.vitest;
  test("config module exports", () => {
    expect(typeof getDebugConfig).toBe('function');
    expect(typeof isDebugMode).toBe('function');
    expect(typeof getDebugDataset).toBe('function');
    expect(typeof shouldShowDebugInfo).toBe('function');
  });
}