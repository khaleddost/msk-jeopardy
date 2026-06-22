import Link from "next/link"
import { getCategories } from "@/lib/content"
import { GameBoard } from "@/components/game-board"

export default function Page() {
  const categories = getCategories()

  return (
    <main className="min-h-screen px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <header className="text-center">
          <p className="font-heading text-xs font-bold uppercase tracking-[0.3em] text-muted-foreground">
            Radiology Resident Lecture
          </p>
          <h1 className="text-balance font-heading text-3xl font-bold uppercase tracking-wide text-gold sm:text-4xl lg:text-5xl">
            MSK Acute Trauma Jeopardy
          </h1>
        </header>

        {categories.length === 0 ? (
          <p className="rounded-lg border border-border bg-board/30 p-6 text-center text-muted-foreground">
            No categories found. Add category folders under{" "}
            <code className="text-gold">content/</code> to build the board.
          </p>
        ) : (
          <GameBoard categories={categories} />
        )}
      </div>

      <Link
        href="/references"
        className="fixed bottom-3 right-3 z-10 rounded-md border border-border bg-board/80 px-3 py-1.5 font-heading text-xs font-bold uppercase tracking-wide text-muted-foreground backdrop-blur transition-colors hover:text-gold"
      >
        Image References
      </Link>
    </main>
  )
}
