import { Suspense } from "react";

import { Converter } from "@/app/components/Converter";

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      <main className="mx-auto max-w-5xl p-2 sm:px-6 sm:py-12">
        <Suspense fallback={<div className="text-center text-sm text-zinc-500 dark:text-zinc-400">Loading converter...</div>}>
          <Converter />
        </Suspense>

        <footer className="mt-12 text-center text-xs text-zinc-400 dark:text-zinc-600">
          Purely client-side · No data sent anywhere ·
          <br />
          <a href="https://s33g.uk" target="_blank" rel="noopener noreferrer" className="hover:text-zinc-600 dark:hover:text-zinc-400">seeg</a>
        </footer>
      </main>
    </div>
  );
}

