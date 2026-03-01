# State Management Template

A production-ready, type-safe state management system built on React Context API with built-in **memoization** and **caching**. This template provides a reusable pattern for creating feature-based state management that scales.

## 🎯 Key Features

- **🔒 Type-Safe**: Full TypeScript support with proper type inference
- **⚡ Performance-Optimized**: Built-in memoization with `useMemo` and `useCallback`
- **💾 Caching System**: Automatic cache with configurable TTL (Time To Live)
- **💿 Persistence**: Optional localStorage integration
- **🧩 Modular**: Feature-based architecture for easy scaling
- **♻️ Reusable**: Template system for rapid feature creation
- **🎨 Clean API**: Intuitive hooks-based interface

## 📁 Project Structure

```
src/
├── lib/                              # Core library
│   ├── types/
│   │   └── state.types.ts            # Base types
│   ├── utils/
│   │   ├── cache.utils.ts            # Cache utilities
│   │   └── storage.utils.ts          # Storage utilities
│   └── context/
│       └── createStateContext.tsx    # Context factory
│
├── features/                         # Feature modules
│   └── example/                      # Example feature
│       ├── context/                  # Context configuration
│       ├── types/                    # Feature types
│       ├── reducers/                 # State reducers
│       ├── hooks/                    # Custom hooks
│       ├── providers/                # Provider components
│       └── index.ts                  # Barrel exports
│
├── providers/
│   └── AppProviders.tsx              # Root provider composition
│
└── components/
    └── ExampleDemo.tsx               # Demo component
```

## 🚀 Quick Start

### 1. Installation

```bash
pnpm install
```

### 2. Run Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see the demo.

### 3. Build for Production

```bash
pnpm build
pnpm start
```

## 📖 Usage

### Basic Example

```typescript
"use client";

import { useExample } from "@/features/example";

export function MyComponent() {
  const { count, increment, decrement, items } = useExample();

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={increment}>Increment</button>
      <button onClick={decrement}>Decrement</button>
    </div>
  );
}
```

## 🎨 Creating a New Feature

See [TEMPLATE.md](./TEMPLATE.md) for a complete guide on creating new features.

### Quick Steps:

1. **Create directory structure**
   ```bash
   mkdir -p src/features/myfeature/{context,types,reducers,hooks,providers}
   ```

2. **Define types** (`types/myfeature.types.ts`)
3. **Create reducer** (`reducers/myfeature.reducer.ts`)
4. **Configure context** (`context/MyFeatureContext.tsx`)
5. **Create hook** (`hooks/useMyFeature.ts`)
6. **Create provider** (`providers/MyFeatureProvider.tsx`)
7. **Add barrel export** (`index.ts`)
8. **Add to AppProviders** (`src/providers/AppProviders.tsx`)

## ⚙️ Configuration

Each feature can be configured with the following options:

```typescript
{
  initialState: YourState,           // Required
  featureName: "YourFeature",        // Required
  enableCache: true,                 // Default: true
  cacheExpiration: 5 * 60 * 1000,   // Default: 5 minutes
  persistToStorage: false,           // Default: false
  storageKeyPrefix: "app_state",     // Default: "app_state"
}
```

## 💡 Core Concepts

### Memoization

All actions and selectors are automatically memoized:

```typescript
// Actions use useCallback
const increment = useCallback(() => {
  dispatch({ type: ActionType.INCREMENT });
}, [dispatch]);

// Selectors use useMemo
const sortedItems = useMemo(() => {
  return [...items].sort((a, b) => b.createdAt - a.createdAt);
}, [items]);
```

### Caching

Built-in caching with TTL:

```typescript
const { getCachedValue, setCachedValue } = useMyFeatureContext();

// Cache computation results
const expensiveResult = useMemo(() => {
  const cached = getCachedValue<Result>("cache_key");
  if (cached) return cached;
  
  const result = expensiveComputation();
  setCachedValue("cache_key", result, 60000); // 1 minute TTL
  return result;
}, [dependencies]);
```

### State Persistence

Enable localStorage persistence:

```typescript
createStateContext(
  {
    initialState,
    featureName: "MyFeature",
    persistToStorage: true, // Enable persistence
  },
  myReducer
);
```

## 📚 Documentation

- [TEMPLATE.md](./TEMPLATE.md) - Complete feature creation guide
- [QUICKSTART.md](./QUICKSTART.md) - Quick reference template

## 🛠️ Tech Stack

- **Next.js 16** - React framework
- **React 19** - UI library
- **TypeScript 5** - Type safety
- **Tailwind CSS 4** - Styling
- **Biome** - Linting & formatting
- **pnpm** - Package manager

## 🎯 Performance Best Practices

1. **Split features**: Keep state close to where it's used
2. **Use selectors**: Only subscribe to needed state slices
3. **Cache computations**: Use built-in caching for expensive operations
4. **Memoize everything**: Actions, selectors, and components
5. **Clean up**: Clear cache when components unmount

## 📊 Example Feature

The template includes a fully-functional example feature demonstrating:

- ✅ Counter with increment/decrement/reset
- ✅ Item list management (add/remove/update)
- ✅ Computed values (item count, sorted items)
- ✅ Caching implementation
- ✅ Loading and error states
- ✅ Type-safe actions and state

## 🔧 Scripts

```bash
pnpm dev            # Start development server
pnpm build          # Build for production
pnpm start          # Start production server
pnpm lint           # Run biome linter
pnpm format         # Format code with biome
pnpm test           # Run all tests
pnpm test:watch     # Run tests in watch mode
pnpm test:coverage  # Generate test coverage report
```

## 🧪 Testing

The template includes a comprehensive test suite with 110+ test cases:

- ✅ **Cache utilities** - All caching functions tested
- ✅ **Storage utilities** - localStorage operations tested
- ✅ **Reducers** - All action types and edge cases tested
- ✅ **Hooks** - Custom hooks with full coverage
- ✅ **Integration tests** - Complex workflows tested

Run tests during development:
```bash
pnpm test:watch
```

See [TESTING.md](./TESTING.md) for complete testing documentation.

## 📝 License

MIT

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

**Built with ❤️ for scalable React applications**

