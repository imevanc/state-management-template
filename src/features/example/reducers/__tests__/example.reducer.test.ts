import { exampleReducer } from "../example.reducer";
import { ExampleActionType } from "../../types/example.types";
import type { ExampleState, ExampleItem } from "../../types/example.types";

describe("Example Reducer", () => {
  const initialState: ExampleState = {
    count: 0,
    items: [],
    isLoading: false,
    error: null,
  };

  const mockItem: ExampleItem = {
    id: "1",
    name: "Test Item",
    description: "Test Description",
    createdAt: new Date("2024-01-01"),
  };

  describe("INCREMENT", () => {
    it("should increment count by 1", () => {
      const newState = exampleReducer(initialState, {
        type: ExampleActionType.INCREMENT,
      });

      expect(newState.count).toBe(1);
      expect(newState).not.toBe(initialState); // Should return new object
    });

    it("should increment from any starting value", () => {
      const state = { ...initialState, count: 5 };
      const newState = exampleReducer(state, {
        type: ExampleActionType.INCREMENT,
      });

      expect(newState.count).toBe(6);
    });
  });

  describe("DECREMENT", () => {
    it("should decrement count by 1", () => {
      const state = { ...initialState, count: 5 };
      const newState = exampleReducer(state, {
        type: ExampleActionType.DECREMENT,
      });

      expect(newState.count).toBe(4);
    });

    it("should allow negative values", () => {
      const newState = exampleReducer(initialState, {
        type: ExampleActionType.DECREMENT,
      });

      expect(newState.count).toBe(-1);
    });
  });

  describe("RESET", () => {
    it("should reset count to 0", () => {
      const state = { ...initialState, count: 42 };
      const newState = exampleReducer(state, {
        type: ExampleActionType.RESET,
      });

      expect(newState.count).toBe(0);
    });

    it("should not affect other state properties", () => {
      const state: ExampleState = {
        count: 10,
        items: [mockItem],
        isLoading: true,
        error: "Some error",
      };

      const newState = exampleReducer(state, {
        type: ExampleActionType.RESET,
      });

      expect(newState.count).toBe(0);
      expect(newState.items).toEqual([mockItem]);
      expect(newState.isLoading).toBe(true);
      expect(newState.error).toBe("Some error");
    });
  });

  describe("SET_LOADING", () => {
    it("should set isLoading to true", () => {
      const newState = exampleReducer(initialState, {
        type: ExampleActionType.SET_LOADING,
        payload: true,
      });

      expect(newState.isLoading).toBe(true);
    });

    it("should set isLoading to false", () => {
      const state = { ...initialState, isLoading: true };
      const newState = exampleReducer(state, {
        type: ExampleActionType.SET_LOADING,
        payload: false,
      });

      expect(newState.isLoading).toBe(false);
    });
  });

  describe("SET_ERROR", () => {
    it("should set error message", () => {
      const errorMessage = "Something went wrong";
      const newState = exampleReducer(initialState, {
        type: ExampleActionType.SET_ERROR,
        payload: errorMessage,
      });

      expect(newState.error).toBe(errorMessage);
      expect(newState.isLoading).toBe(false);
    });

    it("should clear error when null is provided", () => {
      const state = { ...initialState, error: "Previous error" };
      const newState = exampleReducer(state, {
        type: ExampleActionType.SET_ERROR,
        payload: null,
      });

      expect(newState.error).toBeNull();
    });

    it("should set isLoading to false", () => {
      const state = { ...initialState, isLoading: true };
      const newState = exampleReducer(state, {
        type: ExampleActionType.SET_ERROR,
        payload: "Error",
      });

      expect(newState.isLoading).toBe(false);
    });
  });

  describe("ADD_ITEM", () => {
    it("should add item to empty array", () => {
      const newState = exampleReducer(initialState, {
        type: ExampleActionType.ADD_ITEM,
        payload: mockItem,
      });

      expect(newState.items).toHaveLength(1);
      expect(newState.items[0]).toEqual(mockItem);
    });

    it("should add item to existing array", () => {
      const existingItem: ExampleItem = {
        id: "2",
        name: "Existing",
        description: "Desc",
        createdAt: new Date("2024-01-02"),
      };
      const state = { ...initialState, items: [existingItem] };

      const newState = exampleReducer(state, {
        type: ExampleActionType.ADD_ITEM,
        payload: mockItem,
      });

      expect(newState.items).toHaveLength(2);
      expect(newState.items).toContain(mockItem);
      expect(newState.items).toContain(existingItem);
    });

    it("should not mutate original array", () => {
      const state = { ...initialState, items: [] };
      const originalArray = state.items;

      const newState = exampleReducer(state, {
        type: ExampleActionType.ADD_ITEM,
        payload: mockItem,
      });

      expect(newState.items).not.toBe(originalArray);
      expect(originalArray).toHaveLength(0);
    });
  });

  describe("REMOVE_ITEM", () => {
    it("should remove item by id", () => {
      const items = [
        mockItem,
        { ...mockItem, id: "2", name: "Item 2" },
        { ...mockItem, id: "3", name: "Item 3" },
      ];
      const state = { ...initialState, items };

      const newState = exampleReducer(state, {
        type: ExampleActionType.REMOVE_ITEM,
        payload: "2",
      });

      expect(newState.items).toHaveLength(2);
      expect(newState.items.find((item) => item.id === "2")).toBeUndefined();
      expect(newState.items.find((item) => item.id === "1")).toBeDefined();
      expect(newState.items.find((item) => item.id === "3")).toBeDefined();
    });

    it("should return same array if id not found", () => {
      const state = { ...initialState, items: [mockItem] };

      const newState = exampleReducer(state, {
        type: ExampleActionType.REMOVE_ITEM,
        payload: "nonexistent",
      });

      expect(newState.items).toHaveLength(1);
      expect(newState.items[0]).toEqual(mockItem);
    });

    it("should handle empty array", () => {
      const newState = exampleReducer(initialState, {
        type: ExampleActionType.REMOVE_ITEM,
        payload: "1",
      });

      expect(newState.items).toHaveLength(0);
    });
  });

  describe("UPDATE_ITEM", () => {
    it("should update item by id", () => {
      const items = [mockItem, { ...mockItem, id: "2", name: "Item 2" }];
      const state = { ...initialState, items };

      const updatedItem: ExampleItem = {
        ...mockItem,
        name: "Updated Name",
        description: "Updated Description",
      };

      const newState = exampleReducer(state, {
        type: ExampleActionType.UPDATE_ITEM,
        payload: updatedItem,
      });

      expect(newState.items).toHaveLength(2);
      expect(newState.items[0]).toEqual(updatedItem);
      expect(newState.items[1].id).toBe("2");
    });

    it("should not modify other items", () => {
      const item1 = mockItem;
      const item2 = { ...mockItem, id: "2", name: "Item 2" };
      const state = { ...initialState, items: [item1, item2] };

      const updatedItem: ExampleItem = {
        ...mockItem,
        name: "Updated",
      };

      const newState = exampleReducer(state, {
        type: ExampleActionType.UPDATE_ITEM,
        payload: updatedItem,
      });

      expect(newState.items[1]).toEqual(item2);
    });

    it("should keep item in same position", () => {
      const items = [
        { ...mockItem, id: "1" },
        { ...mockItem, id: "2" },
        { ...mockItem, id: "3" },
      ];
      const state = { ...initialState, items };

      const updatedItem = { ...items[1], name: "Updated Middle" };

      const newState = exampleReducer(state, {
        type: ExampleActionType.UPDATE_ITEM,
        payload: updatedItem,
      });

      expect(newState.items[0].id).toBe("1");
      expect(newState.items[1].name).toBe("Updated Middle");
      expect(newState.items[2].id).toBe("3");
    });

    it("should return unchanged state if item not found", () => {
      const state = { ...initialState, items: [mockItem] };

      const nonExistentItem: ExampleItem = {
        ...mockItem,
        id: "nonexistent",
      };

      const newState = exampleReducer(state, {
        type: ExampleActionType.UPDATE_ITEM,
        payload: nonExistentItem,
      });

      expect(newState.items).toHaveLength(1);
      expect(newState.items[0]).toEqual(mockItem);
    });
  });

  describe("SET_ITEMS", () => {
    it("should replace all items", () => {
      const existingItems = [mockItem];
      const state = { ...initialState, items: existingItems };

      const newItems: ExampleItem[] = [
        { ...mockItem, id: "2", name: "New 1" },
        { ...mockItem, id: "3", name: "New 2" },
      ];

      const newState = exampleReducer(state, {
        type: ExampleActionType.SET_ITEMS,
        payload: newItems,
      });

      expect(newState.items).toEqual(newItems);
      expect(newState.items).toHaveLength(2);
    });

    it("should set empty array", () => {
      const state = { ...initialState, items: [mockItem] };

      const newState = exampleReducer(state, {
        type: ExampleActionType.SET_ITEMS,
        payload: [],
      });

      expect(newState.items).toEqual([]);
    });
  });

  describe("Default case", () => {
    it("should return current state for unknown action", () => {
      const state = { ...initialState, count: 5 };

      // @ts-expect-error - Testing invalid action type
      const newState = exampleReducer(state, {
        type: "UNKNOWN_ACTION",
      });

      expect(newState).toEqual(state);
    });
  });

  describe("Immutability", () => {
    it("should not mutate original state", () => {
      const state: ExampleState = {
        count: 5,
        items: [mockItem],
        isLoading: false,
        error: null,
      };

      const originalCount = state.count;
      const originalItemsLength = state.items.length;
      const originalIsLoading = state.isLoading;
      const originalError = state.error;

      exampleReducer(state, { type: ExampleActionType.INCREMENT });
      exampleReducer(state, {
        type: ExampleActionType.ADD_ITEM,
        payload: { ...mockItem, id: "2" },
      });
      exampleReducer(state, {
        type: ExampleActionType.SET_ERROR,
        payload: "Error",
      });

      expect(state.count).toBe(originalCount);
      expect(state.items.length).toBe(originalItemsLength);
      expect(state.isLoading).toBe(originalIsLoading);
      expect(state.error).toBe(originalError);
    });
  });
});

