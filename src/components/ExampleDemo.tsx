"use client";

import type { ExampleItem } from "@/features/example";
import { useExample } from "@/features/example";

export function ExampleDemo() {
  const {
    count,
    isLoading,
    error,
    increment,
    decrement,
    reset,
    addItem,
    removeItem,
    itemCount,
    sortedItems,
  } = useExample();

  const handleAddItem = () => {
    const newItem: ExampleItem = {
      id: Date.now().toString(),
      name: `Item ${itemCount + 1}`,
      description: `This is example item ${itemCount + 1}`,
      createdAt: new Date(),
    };
    addItem(newItem);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-8 space-y-8">
      <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-lg p-6 border border-zinc-200 dark:border-zinc-800">
        <h2 className="text-2xl font-bold mb-4 text-zinc-900 dark:text-zinc-50">
          Counter Example
        </h2>
        <div className="flex items-center gap-4">
          <button
            onClick={decrement}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            Decrement
          </button>
          <span className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 min-w-[60px] text-center">
            {count}
          </span>
          <button
            onClick={increment}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            Increment
          </button>
          <button
            onClick={reset}
            className="px-4 py-2 bg-zinc-500 text-white rounded-lg hover:bg-zinc-600 transition-colors ml-4"
          >
            Reset
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-lg p-6 border border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
            Items List ({itemCount})
          </h2>
          <button
            type="button"
            onClick={handleAddItem}
            disabled={isLoading}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add Item
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/20 border border-red-300 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="text-center py-8 text-zinc-500">Loading...</div>
        ) : sortedItems.length === 0 ? (
          <div className="text-center py-8 text-zinc-500">
            No items yet. Click "Add Item" to create one.
          </div>
        ) : (
          <div className="space-y-2">
            {sortedItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700"
              >
                <div>
                  <h3 className="font-semibold text-zinc-900 dark:text-zinc-50">
                    {item.name}
                  </h3>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    {item.description}
                  </p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-500 mt-1">
                    Created: {new Date(item.createdAt).toLocaleString()}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => removeItem(item.id)}
                  className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition-colors"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 rounded-lg shadow-lg p-6 border border-blue-200 dark:border-blue-900">
        <h3 className="text-xl font-bold mb-3 text-zinc-900 dark:text-zinc-50">
          ✨ Features Demonstrated
        </h3>
        <ul className="space-y-2 text-sm text-zinc-700 dark:text-zinc-300">
          <li>
            ✅ <strong>Type-safe state management</strong> with TypeScript
          </li>
          <li>
            ✅ <strong>Memoization</strong> - All actions use useCallback
          </li>
          <li>
            ✅ <strong>Caching</strong> - Sorted items are cached with TTL
          </li>
          <li>
            ✅ <strong>Derived state</strong> - Item count computed
            automatically
          </li>
          <li>
            ✅ <strong>Context isolation</strong> - Each feature has its own
            context
          </li>
          <li>
            ✅ <strong>Reusable template</strong> - Copy the example folder for
            new features
          </li>
        </ul>
      </div>
    </div>
  );
}
