import { renderHook, act } from "@testing-library/react";
import { useExample } from "../useExample";
import { ExampleFeatureProvider } from "../../providers/ExampleProvider";
import type { ExampleItem } from "../../types/example.types";

describe("useExample Hook", () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <ExampleFeatureProvider>{children}</ExampleFeatureProvider>
  );

  describe("Initial State", () => {
    it("should provide initial state", () => {
      const { result } = renderHook(() => useExample(), { wrapper });

      expect(result.current.count).toBe(0);
      expect(result.current.items).toEqual([]);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
      expect(result.current.itemCount).toBe(0);
    });
  });

  describe("Counter Actions", () => {
    it("should increment count", () => {
      const { result } = renderHook(() => useExample(), { wrapper });

      act(() => {
        result.current.increment();
      });

      expect(result.current.count).toBe(1);

      act(() => {
        result.current.increment();
      });

      expect(result.current.count).toBe(2);
    });

    it("should decrement count", () => {
      const { result } = renderHook(() => useExample(), { wrapper });

      act(() => {
        result.current.increment();
        result.current.increment();
        result.current.increment();
      });

      expect(result.current.count).toBe(3);

      act(() => {
        result.current.decrement();
      });

      expect(result.current.count).toBe(2);
    });

    it("should reset count to 0", () => {
      const { result } = renderHook(() => useExample(), { wrapper });

      act(() => {
        result.current.increment();
        result.current.increment();
        result.current.increment();
      });

      expect(result.current.count).toBe(3);

      act(() => {
        result.current.reset();
      });

      expect(result.current.count).toBe(0);
    });
  });

  describe("Item Management", () => {
    const mockItem: ExampleItem = {
      id: "1",
      name: "Test Item",
      description: "Test Description",
      createdAt: new Date("2024-01-01"),
    };

    it("should add item", () => {
      const { result } = renderHook(() => useExample(), { wrapper });

      act(() => {
        result.current.addItem(mockItem);
      });

      expect(result.current.items).toHaveLength(1);
      expect(result.current.items[0]).toEqual(mockItem);
      expect(result.current.itemCount).toBe(1);
    });

    it("should add multiple items", () => {
      const { result } = renderHook(() => useExample(), { wrapper });

      const item2: ExampleItem = { ...mockItem, id: "2", name: "Item 2" };
      const item3: ExampleItem = { ...mockItem, id: "3", name: "Item 3" };

      act(() => {
        result.current.addItem(mockItem);
        result.current.addItem(item2);
        result.current.addItem(item3);
      });

      expect(result.current.items).toHaveLength(3);
      expect(result.current.itemCount).toBe(3);
    });

    it("should remove item by id", () => {
      const { result } = renderHook(() => useExample(), { wrapper });

      const item2: ExampleItem = { ...mockItem, id: "2", name: "Item 2" };

      act(() => {
        result.current.addItem(mockItem);
        result.current.addItem(item2);
      });

      expect(result.current.items).toHaveLength(2);

      act(() => {
        result.current.removeItem("1");
      });

      expect(result.current.items).toHaveLength(1);
      expect(result.current.items[0].id).toBe("2");
      expect(result.current.itemCount).toBe(1);
    });

    it("should update item", () => {
      const { result } = renderHook(() => useExample(), { wrapper });

      act(() => {
        result.current.addItem(mockItem);
      });

      const updatedItem: ExampleItem = {
        ...mockItem,
        name: "Updated Name",
        description: "Updated Description",
      };

      act(() => {
        result.current.updateItem(updatedItem);
      });

      expect(result.current.items[0].name).toBe("Updated Name");
      expect(result.current.items[0].description).toBe("Updated Description");
    });

    it("should set all items at once", () => {
      const { result } = renderHook(() => useExample(), { wrapper });

      const newItems: ExampleItem[] = [
        mockItem,
        { ...mockItem, id: "2", name: "Item 2" },
        { ...mockItem, id: "3", name: "Item 3" },
      ];

      act(() => {
        result.current.setItems(newItems);
      });

      expect(result.current.items).toEqual(newItems);
      expect(result.current.itemCount).toBe(3);
    });
  });

  describe("Loading and Error States", () => {
    it("should set loading state", () => {
      const { result } = renderHook(() => useExample(), { wrapper });

      act(() => {
        result.current.setLoading(true);
      });

      expect(result.current.isLoading).toBe(true);

      act(() => {
        result.current.setLoading(false);
      });

      expect(result.current.isLoading).toBe(false);
    });

    it("should set error state", () => {
      const { result } = renderHook(() => useExample(), { wrapper });

      const errorMessage = "Something went wrong";

      act(() => {
        result.current.setError(errorMessage);
      });

      expect(result.current.error).toBe(errorMessage);

      act(() => {
        result.current.setError(null);
      });

      expect(result.current.error).toBeNull();
    });
  });

  describe("Computed Selectors", () => {
    it("should compute itemCount", () => {
      const { result } = renderHook(() => useExample(), { wrapper });

      expect(result.current.itemCount).toBe(0);

      act(() => {
        result.current.addItem({
          id: "1",
          name: "Item",
          description: "Desc",
          createdAt: new Date(),
        });
      });

      expect(result.current.itemCount).toBe(1);
    });

    it("should return sorted items by createdAt desc", () => {
      const { result } = renderHook(() => useExample(), { wrapper });

      const item1: ExampleItem = {
        id: "1",
        name: "First",
        description: "Desc",
        createdAt: new Date("2024-01-01"),
      };

      const item2: ExampleItem = {
        id: "2",
        name: "Second",
        description: "Desc",
        createdAt: new Date("2024-01-03"),
      };

      const item3: ExampleItem = {
        id: "3",
        name: "Third",
        description: "Desc",
        createdAt: new Date("2024-01-02"),
      };

      act(() => {
        result.current.setItems([item1, item2, item3]);
      });

      const sorted = result.current.sortedItems;

      expect(sorted[0].id).toBe("2"); // Most recent
      expect(sorted[1].id).toBe("3");
      expect(sorted[2].id).toBe("1"); // Oldest
    });

    it("should get item by id", () => {
      const { result } = renderHook(() => useExample(), { wrapper });

      const item: ExampleItem = {
        id: "test-id",
        name: "Test",
        description: "Desc",
        createdAt: new Date(),
      };

      act(() => {
        result.current.addItem(item);
      });

      const foundItem = result.current.getItemById("test-id");

      expect(foundItem).toEqual(item);
    });

    it("should return undefined for non-existent id", () => {
      const { result } = renderHook(() => useExample(), { wrapper });

      const foundItem = result.current.getItemById("nonexistent");

      expect(foundItem).toBeUndefined();
    });
  });

  describe("Action Memoization", () => {
    it("should memoize action functions", () => {
      const { result, rerender } = renderHook(() => useExample(), { wrapper });

      const { increment, decrement, reset } = result.current;

      rerender();

      expect(result.current.increment).toBe(increment);
      expect(result.current.decrement).toBe(decrement);
      expect(result.current.reset).toBe(reset);
    });
  });

  describe("Cache Integration", () => {
    it("should cache getItemById results", () => {
      const { result } = renderHook(() => useExample(), { wrapper });

      const item: ExampleItem = {
        id: "cache-test",
        name: "Test",
        description: "Desc",
        createdAt: new Date(),
      };

      act(() => {
        result.current.addItem(item);
      });

      // First call should cache
      const firstResult = result.current.getItemById("cache-test");
      // Second call should return cached value
      const secondResult = result.current.getItemById("cache-test");

      expect(firstResult).toEqual(item);
      expect(secondResult).toEqual(item);
    });

    it("should clear cache", () => {
      const { result } = renderHook(() => useExample(), { wrapper });

      act(() => {
        result.current.addItem({
          id: "1",
          name: "Item",
          description: "Desc",
          createdAt: new Date(),
        });
      });

      // This should cache the item
      result.current.getItemById("1");

      // Clear cache
      act(() => {
        result.current.clearCache();
      });

      // Cache should be cleared, but item should still be accessible
      const item = result.current.getItemById("1");
      expect(item).toBeDefined();
    });
  });

  describe("Integration Tests", () => {
    it("should handle complex workflow", () => {
      const { result } = renderHook(() => useExample(), { wrapper });

      // Start loading
      act(() => {
        result.current.setLoading(true);
      });

      expect(result.current.isLoading).toBe(true);

      // Add items
      act(() => {
        result.current.addItem({
          id: "1",
          name: "Item 1",
          description: "Desc 1",
          createdAt: new Date("2024-01-01"),
        });
        result.current.addItem({
          id: "2",
          name: "Item 2",
          description: "Desc 2",
          createdAt: new Date("2024-01-02"),
        });
      });

      // Stop loading
      act(() => {
        result.current.setLoading(false);
      });

      expect(result.current.isLoading).toBe(false);
      expect(result.current.itemCount).toBe(2);

      // Increment counter
      act(() => {
        result.current.increment();
        result.current.increment();
      });

      expect(result.current.count).toBe(2);

      // Update an item
      act(() => {
        result.current.updateItem({
          id: "1",
          name: "Updated Item 1",
          description: "Updated Desc",
          createdAt: new Date("2024-01-01"),
        });
      });

      expect(result.current.items[0].name).toBe("Updated Item 1");

      // Remove an item
      act(() => {
        result.current.removeItem("2");
      });

      expect(result.current.itemCount).toBe(1);
    });
  });
});
