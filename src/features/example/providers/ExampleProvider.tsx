"use client";

import { ExampleProvider as Provider } from "../context/ExampleContext";

/**
 * Example feature provider wrapper
 * Re-export for easier imports and to allow additional provider composition
 */
export function ExampleFeatureProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Provider>{children}</Provider>;
}
