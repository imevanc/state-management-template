"use client";

import { useCallback, useMemo } from "react";
import { useExampleContext } from "../context/ExampleContext";
import type { ExampleItem } from "../types/example.types";
import { ExampleActionType } from "../types/example.types";

/**
 * Custom hook for the Example feature
 * Provides memoized actions and selectors
 */
export function useExample() {
  const { state, dispatch, getCachedValue, setCachedValue, clearCache } =
    useExampleContext();

  // Memoized actions
  const increment = useCallback(() => {
    dispatch({ type: ExampleActionType.INCREMENT });
  }, [dispatch]);

  const decrement = useCallback(() => {
    dispatch({ type: ExampleActionType.DECREMENT });
  }, [dispatch]);

  const reset = useCallback(() => {
    dispatch({ type: ExampleActionType.RESET });
  }, [dispatch]);

  const addItem = useCallback(
    (item: ExampleItem) => {
      dispatch({ type: ExampleActionType.ADD_ITEM, payload: item });
    },
    [dispatch],
  );

  const removeItem = useCallback(
    (id: string) => {
      dispatch({ type: ExampleActionType.REMOVE_ITEM, payload: id });
    },
    [dispatch],
  );

  const updateItem = useCallback(
    (item: ExampleItem) => {
      dispatch({ type: ExampleActionType.UPDATE_ITEM, payload: item });
    },
    [dispatch],
  );

  const setItems = useCallback(
    (items: ExampleItem[]) => {
      dispatch({ type: ExampleActionType.SET_ITEMS, payload: items });
    },
    [dispatch],
  );

  const setLoading = useCallback(
    (isLoading: boolean) => {
      dispatch({ type: ExampleActionType.SET_LOADING, payload: isLoading });
    },
    [dispatch],
  );

  const setError = useCallback(
    (error: string | null) => {
      dispatch({ type: ExampleActionType.SET_ERROR, payload: error });
    },
    [dispatch],
  );

  // Memoized selectors
  const itemCount = useMemo(() => state.items.length, [state.items.length]);

  const getItemById = useCallback(
    (id: string): ExampleItem | undefined => {
      // Try to get from cache first
      const cacheKey = `item_${id}`;
      const cachedItem = getCachedValue<ExampleItem>(cacheKey);

      if (cachedItem) {
        return cachedItem;
      }

      // If not in cache, find in state and cache it
      const item = state.items.find((item) => item.id === id);
      if (item) {
        setCachedValue(cacheKey, item);
      }

      return item;
    },
    [state.items, getCachedValue, setCachedValue],
  );

  // Example of a computed value with caching
  const sortedItems = useMemo(() => {
    const cacheKey = "sorted_items";
    const cached = getCachedValue<ExampleItem[]>(cacheKey);

    if (cached && cached.length === state.items.length) {
      return cached;
    }

    const sorted = [...state.items].sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
    );

    setCachedValue(cacheKey, sorted, 60000); // Cache for 1 minute

    return sorted;
  }, [state.items, getCachedValue, setCachedValue]);

  return {
    // State
    count: state.count,
    items: state.items,
    isLoading: state.isLoading,
    error: state.error,

    // Actions
    increment,
    decrement,
    reset,
    addItem,
    removeItem,
    updateItem,
    setItems,
    setLoading,
    setError,

    // Selectors
    itemCount,
    getItemById,
    sortedItems,

    // Cache control
    clearCache,
  };
}
