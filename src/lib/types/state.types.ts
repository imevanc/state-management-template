/**
 * Base types for the state management system
 */

export interface BaseState {
  [key: string]: unknown;
}

export interface StateConfig<T extends BaseState> {
  /**
   * Initial state for the feature
   */
  initialState: T;
  /**
   * Feature name for debugging and identification
   */
  featureName: string;
  /**
   * Enable caching (default: true)
   */
  enableCache?: boolean;
  /**
   * Cache expiration time in milliseconds (default: 5 minutes)
   */
  cacheExpiration?: number;
}

export interface Action<T = unknown> {
  type: string;
  payload?: T;
}

export type Reducer<S extends BaseState, A extends Action = Action> = (
  state: S,
  action: A,
) => S;

export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

export interface StateContextValue<
  S extends BaseState,
  A extends Action = Action,
> {
  state: S;
  dispatch: React.Dispatch<A>;
  cache: Map<string, CacheEntry<unknown>>;
  getCachedValue: <T>(key: string) => T | null;
  setCachedValue: <T>(key: string, value: T, ttl?: number) => void;
  clearCache: (key?: string) => void;
}

