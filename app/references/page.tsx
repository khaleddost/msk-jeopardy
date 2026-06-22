import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { getCategories } from "@/lib/content"

export const metadata = {
  title: "Image References — MSK Acute Trauma Jeopardy",
  description: "Source links for every radiology image used in the game.",
}

export default function ReferencesPage() {
  const categories = getCategories()

  return (
    <main className="min-h-screen px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-4xl flex-col gap-6">
        <header className="flex flex-col gap-3">
          <Link
            href="/"
            className="inline-flex w-fit items-center gap-2 font-heading text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-gold"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back to the board
          </Link>
          <h1 className="text-balance font-heading text-2xl font-bold uppercase tracking-wide text-gold sm:text-3xl">
            Image References
          </h1>
          <p className="text-pretty leading-relaxed text-muted-foreground">
            Source links for every radiograph used in the game, grouped by category and point value.
          </p>
        </header>

        <div className="flex flex-col gap-6">
          {categories.map((category) => (
            <section
              key={category.id}
              className="rounded-lg border border-border bg-board/30 p-4 sm:p-5"
            >
              <h2 className="mb-3 font-heading text-lg font-bold uppercase tracking-wide text-foreground">
                {category.title}
              </h2>
              <ul className="flex flex-col gap-2">
                {category.questions.map((q) => (
                  <li
                    key={q.id}
                    className="flex flex-col gap-1 border-t border-border/60 pt-2 first:border-t-0 first:pt-0 sm:flex-row sm:items-baseline sm:gap-3"
                  >
                    <span className="shrink-0 font-mono text-sm font-bold text-gold sm:w-14">
                      {q.points}
                    </span>
                    {q.image ? (
                      <a
                        href={q.image}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="break-all text-sm leading-relaxed text-muted-foreground underline decoration-border underline-offset-2 transition-colors hover:text-gold"
                      >
                        {q.image}
                      </a>
                    ) : (
                      <span className="text-sm italic text-muted-foreground/60">
                        No image link
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </main>
  )
}
