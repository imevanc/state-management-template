import type { BaseState } from "@/lib/types/state.types";

/**
 * Example feature types
 * Customize these for your specific feature needs
 */

export interface ExampleItem {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
}

export interface ExampleState extends BaseState {
  count: number;
  items: ExampleItem[];
  isLoading: boolean;
  error: string | null;
}

// Action types
export enum ExampleActionType {
  INCREMENT = "INCREMENT",
  DECREMENT = "DECREMENT",
  RESET = "RESET",
  SET_LOADING = "SET_LOADING",
  SET_ERROR = "SET_ERROR",
  ADD_ITEM = "ADD_ITEM",
  REMOVE_ITEM = "REMOVE_ITEM",
  UPDATE_ITEM = "UPDATE_ITEM",
  SET_ITEMS = "SET_ITEMS",
}

// Action interfaces
export type ExampleAction =
  | { type: ExampleActionType.INCREMENT }
  | { type: ExampleActionType.DECREMENT }
  | { type: ExampleActionType.RESET }
  | { type: ExampleActionType.SET_LOADING; payload: boolean }
  | { type: ExampleActionType.SET_ERROR; payload: string | null }
  | { type: ExampleActionType.ADD_ITEM; payload: ExampleItem }
  | { type: ExampleActionType.REMOVE_ITEM; payload: string }
  | { type: ExampleActionType.UPDATE_ITEM; payload: ExampleItem }
  | { type: ExampleActionType.SET_ITEMS; payload: ExampleItem[] };
