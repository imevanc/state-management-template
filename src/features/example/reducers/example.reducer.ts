import type { Reducer } from "@/lib/types/state.types";
import type { ExampleAction, ExampleState } from "../types/example.types";
import { ExampleActionType } from "../types/example.types";

/**
 * Example feature reducer
 * Handles all state transitions for the example feature
 */
export const exampleReducer: Reducer<ExampleState, ExampleAction> = (
  state,
  action,
): ExampleState => {
  switch (action.type) {
    case ExampleActionType.INCREMENT:
      return {
        ...state,
        count: state.count + 1,
      };

    case ExampleActionType.DECREMENT:
      return {
        ...state,
        count: state.count - 1,
      };

    case ExampleActionType.RESET:
      return {
        ...state,
        count: 0,
      };

    case ExampleActionType.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload,
      };

    case ExampleActionType.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };

    case ExampleActionType.ADD_ITEM:
      return {
        ...state,
        items: [...state.items, action.payload],
      };

    case ExampleActionType.REMOVE_ITEM:
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.payload),
      };

    case ExampleActionType.UPDATE_ITEM:
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === action.payload.id ? action.payload : item,
        ),
      };

    case ExampleActionType.SET_ITEMS:
      return {
        ...state,
        items: action.payload,
      };

    default:
      return state;
  }
};
