"use client";

import { createStateContext } from "@/lib/context/createStateContext";
import { exampleReducer } from "../reducers/example.reducer";
import type { ExampleAction, ExampleState } from "../types/example.types";

/**
 * Example feature state context configuration
 * This is a template that can be copied for each feature
 */

const initialState: ExampleState = {
  count: 0,
  items: [],
  isLoading: false,
  error: null,
};

const { StateContext, StateProvider, useStateContext } = createStateContext<
  ExampleState,
  ExampleAction
>(
  {
    initialState,
    featureName: "Example",
    enableCache: true,
    cacheExpiration: 5 * 60 * 1000, // 5 minutes
  },
  exampleReducer,
);

// Export with feature-specific names
export const ExampleProvider = StateProvider;
export const useExampleContext = useStateContext;

