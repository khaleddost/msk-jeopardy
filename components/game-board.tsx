"use client"

import { useState } from "react"
import { RotateCcw } from "lucide-react"
import type { Category, Question } from "@/lib/content"
import { INITIAL_SCORES, type TeamId } from "@/lib/teams"
import { Scoreboard } from "@/components/scoreboard"
import { QuestionModal } from "@/components/question-modal"
import { cn } from "@/lib/utils"

const POINT_VALUES = [100, 200, 300, 400, 500]

type ActiveQuestion = {
  categoryTitle: string
  question: Question
}

type GameBoardProps = {
  categories: Category[]
}

export function GameBoard({ categories }: GameBoardProps) {
  const [scores, setScores] = useState<Record<TeamId, number>>({
    ...INITIAL_SCORES,
  })
  const [completed, setCompleted] = useState<Record<string, boolean>>({})
  const [active, setActive] = useState<ActiveQuestion | null>(null)

  function adjustScore(teamId: TeamId, delta: number) {
    setScores((prev) => ({ ...prev, [teamId]: prev[teamId] + delta }))
  }

  function completeActive() {
    if (active) {
      setCompleted((prev) => ({ ...prev, [active.question.id]: true }))
    }
    setActive(null)
  }

  function resetGame() {
    setScores({ ...INITIAL_SCORES })
    setCompleted({})
    setActive(null)
  }

  const answeredCount = Object.keys(completed).length
  const totalQuestions = categories.reduce(
    (sum, c) => sum + c.questions.length,
    0,
  )

  return (
    <div className="flex flex-col gap-6">
      {/* Scoreboard */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-4">
          <h2 className="font-heading text-sm font-bold uppercase tracking-[0.2em] text-muted-foreground">
            Scoreboard
          </h2>
          <span className="font-heading text-xs font-bold uppercase tracking-wider text-muted-foreground">
            {`${answeredCount}/${totalQuestions} answered`}
          </span>
        </div>
        <Scoreboard scores={scores} onAdjust={adjustScore} />
      </div>

      {/* Board */}
      <div
        className="grid gap-2 sm:gap-3"
        style={{
          gridTemplateColumns: `repeat(${categories.length}, minmax(0, 1fr))`,
        }}
      >
        {/* Category headers */}
        {categories.map((category) => (
          <div
            key={category.id}
            className="flex min-h-16 items-center justify-center rounded-lg bg-board px-2 py-3 text-center"
          >
            <h3 className="text-balance font-heading text-sm font-bold uppercase leading-tight tracking-wide text-gold sm:text-base">
              {category.title}
            </h3>
          </div>
        ))}

        {/* Question tiles, row by row (100 -> 500) */}
        {POINT_VALUES.map((points) =>
          categories.map((category) => {
            const question = category.questions.find((q) => q.points === points)
            if (!question) {
              return (
                <div
                  key={`${category.id}-${points}-empty`}
                  className="flex aspect-[5/3] items-center justify-center rounded-lg border border-dashed border-border/60 text-xs text-muted-foreground"
                >
                  —
                </div>
              )
            }
            const isDone = completed[question.id]
            return (
              <button
                key={question.id}
                onClick={() =>
                  !isDone &&
                  setActive({ categoryTitle: category.title, question })
                }
                disabled={isDone}
                className={cn(
                  "flex aspect-[5/3] items-center justify-center rounded-lg transition-all",
                  isDone
                    ? "cursor-default border border-border/40 bg-board/30"
                    : "bg-board hover:scale-[1.03] hover:bg-board-hover focus-visible:scale-[1.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold",
                )}
              >
                <span
                  className={cn(
                    "font-heading font-bold tabular-nums",
                    "text-2xl sm:text-3xl lg:text-4xl",
                    isDone ? "text-muted-foreground/40" : "text-gold",
                  )}
                >
                  {isDone ? "" : points}
                </span>
              </button>
            )
          }),
        )}
      </div>

      {/* Controls */}
      <div className="flex justify-center">
        <button
          onClick={resetGame}
          className="flex items-center gap-2 rounded-lg border border-border px-4 py-2 font-heading text-sm font-bold uppercase tracking-wide text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        >
          <RotateCcw className="size-4" />
          New Game
        </button>
      </div>

      {active && (
        <QuestionModal
          categoryTitle={active.categoryTitle}
          question={active.question}
          onAward={adjustScore}
          onComplete={completeActive}
          onClose={() => setActive(null)}
        />
      )}
    </div>
  )
}
