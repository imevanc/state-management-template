/**
 * Example feature barrel export
 * Import everything you need from this single file
 */

export { useExample } from "./hooks/useExample";
export { ExampleFeatureProvider } from "./providers/ExampleProvider";
export type {
  ExampleAction,
  ExampleItem,
  ExampleState,
} from "./types/example.types";
export { ExampleActionType } from "./types/example.types";
