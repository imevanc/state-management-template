"use client";

import React, {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
} from "react";
import type {
  Action,
  BaseState,
  CacheEntry,
  Reducer,
  StateConfig,
  StateContextValue,
} from "../types/state.types";
import {
  cleanupExpiredCache,
  clearCacheEntries,
  DEFAULT_CACHE_EXPIRATION,
  getCacheValue,
  setCacheValue,
} from "../utils/cache.utils";

/**
 * Factory function to create a typed state context with memoization and caching
 * This is the core template that can be reused for any feature
 */
export function createStateContext<
  S extends BaseState,
  A extends Action = Action,
>(config: StateConfig<S>, reducer: Reducer<S, A>) {
  const {
    initialState,
    featureName,
    enableCache = true,
    cacheExpiration = DEFAULT_CACHE_EXPIRATION,
  } = config;

  // Create the context with undefined default value
  const StateContext = createContext<StateContextValue<S, A> | undefined>(
    undefined,
  );

  // Display name for debugging
  StateContext.displayName = `${featureName}StateContext`;

  /**
   * Provider component with memoization and caching
   */
  function StateProvider({ children }: { children: React.ReactNode }) {
    const [state, dispatch] = useReducer(reducer, initialState);

    // Cache ref to persist across renders
    const cacheRef = useRef<Map<string, CacheEntry<unknown>>>(new Map());


    // Cleanup expired cache entries periodically
    useEffect(() => {
      if (!enableCache) return;

      const interval = setInterval(() => {
        cleanupExpiredCache(cacheRef.current);
      }, cacheExpiration);

      return () => clearInterval(interval);
    }, []);

    // Memoized cache operations
    const getCachedValue = useCallback(<T,>(key: string): T | null => {
      if (!enableCache) return null;
      return getCacheValue<T>(cacheRef.current, key);
    }, []);

    const setCachedValueCallback = useCallback(
      <T,>(key: string, value: T, ttl: number = cacheExpiration): void => {
        if (!enableCache) return;
        setCacheValue<T>(cacheRef.current, key, value, ttl);
      },
      [],
    );

    const clearCache = useCallback((key?: string): void => {
      clearCacheEntries(cacheRef.current, key);
    }, []);

    // Memoize the context value to prevent unnecessary re-renders
    const contextValue = useMemo<StateContextValue<S, A>>(
      () => ({
        state,
        dispatch,
        cache: cacheRef.current,
        getCachedValue,
        setCachedValue: setCachedValueCallback,
        clearCache,
      }),
      [state, getCachedValue, setCachedValueCallback, clearCache],
    );

    return (
      <StateContext.Provider value={contextValue}>
        {children}
      </StateContext.Provider>
    );
  }

  /**
   * Hook to access the state context
   */
  function useStateContext(): StateContextValue<S, A> {
    const context = React.useContext(StateContext);

    if (context === undefined) {
      throw new Error(
        `use${featureName}Context must be used within a ${featureName}Provider`,
      );
    }

    return context;
  }

  return {
    StateContext,
    StateProvider,
    useStateContext,
  };
}
