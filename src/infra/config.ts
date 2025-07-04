import { getMockDataset, MockDatasetName } from './mockData/taskDatasets';

export interface DebugConfig {
  enabled: boolean;
  dataset: MockDatasetName;
  showDebugInfo: boolean;
}

export const getDebugConfig = (): DebugConfig => {
  // DEBUG_MODE=false が明示的に設定されている場合は無効化
  const enabled = process.env.DEBUG_MODE === 'false' ? false : 
                  process.env.DEBUG_MODE === 'true' || 
                  (process.env.NODE_ENV === 'test' && process.env.DEBUG_MODE !== 'false');
  const dataset = (process.env.DEBUG_DATASET as MockDatasetName) || 'basic';
  const showDebugInfo = process.env.DEBUG_SHOW_INFO === 'true';

  return {
    enabled,
    dataset,
    showDebugInfo,
  };
};

export const isDebugMode = (): boolean => {
  return getDebugConfig().enabled;
};

export const getDebugDataset = (): MockDatasetName => {
  return getDebugConfig().dataset;
};

export const shouldShowDebugInfo = (): boolean => {
  return getDebugConfig().showDebugInfo;
};