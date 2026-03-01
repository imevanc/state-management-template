import Image from "next/image";
import { ExampleDemo } from "@/components/ExampleDemo";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-zinc-100 dark:from-black dark:to-zinc-950 font-sans">
      <main className="flex min-h-screen flex-col items-center py-12 px-4">
        <div className="mb-8 text-center">
          <Image
            className="dark:invert mx-auto mb-6"
            src="/next.svg"
            alt="Next.js logo"
            width={180}
            height={37}
            priority
          />
          <h1 className="text-4xl font-bold mb-2 text-zinc-900 dark:text-zinc-50">
            State Management Template
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
            A reusable, performant state management system built on React
            Context API with built-in memoization and caching
          </p>
        </div>

        <ExampleDemo />

        <div className="mt-12 text-center">
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
            Check the{" "}
            <code className="px-2 py-1 bg-zinc-200 dark:bg-zinc-800 rounded">
              TEMPLATE.md
            </code>{" "}
            file for the complete guide
          </p>
          <div className="flex gap-4 justify-center">
            <a
              href="https://github.com"
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
            >
              View on GitHub
            </a>
            <a
              href="https://nextjs.org/docs"
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
            >
              Next.js Documentation
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
