"use client";

import type React from "react";
import { ExampleFeatureProvider } from "@/features/example";

/**
 * Root providers component
 * Compose all feature providers here
 *
 * Add new providers as you create new features:
 * <ExampleFeatureProvider>
 *   <AnotherFeatureProvider>
 *     <YetAnotherFeatureProvider>
 *       {children}
 *     </YetAnotherFeatureProvider>
 *   </AnotherFeatureProvider>
 * </ExampleFeatureProvider>
 */
export function AppProviders({ children }: { children: React.ReactNode }) {
  return <ExampleFeatureProvider>{children}</ExampleFeatureProvider>;
}
