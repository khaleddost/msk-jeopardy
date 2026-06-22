"use client"

import { useEffect, useRef, useState } from "react"
import ReactMarkdown from "react-markdown"
import { Check, X } from "lucide-react"
import type { Question } from "@/lib/content"
import { TEAMS, type TeamId } from "@/lib/teams"
import { QuestionImage } from "@/components/question-image"
import { cn } from "@/lib/utils"

type QuestionModalProps = {
  categoryTitle: string
  question: Question
  onAward: (teamId: TeamId, delta: number) => void
  onComplete: () => void
  onClose: () => void
}

export function QuestionModal({
  categoryTitle,
  question,
  onAward,
  onComplete,
  onClose,
}: QuestionModalProps) {
  const [questionShown, setQuestionShown] = useState(false)
  const [revealed, setRevealed] = useState(false)
  const [selected, setSelected] = useState<string | null>(null)
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    closeRef.current?.focus()
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose()
    }
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [onClose])

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${categoryTitle} for ${question.points} points`}
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/70 p-4 backdrop-blur-sm sm:items-center"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="my-4 w-full max-w-5xl rounded-xl border border-border bg-popover text-popover-foreground shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between gap-4 border-b border-border px-5 py-3">
          <div className="flex items-baseline gap-3">
            <span className="font-heading text-lg font-semibold uppercase tracking-wide text-gold">
              {categoryTitle}
            </span>
            <span className="rounded-md bg-gold px-2 py-0.5 font-heading text-sm font-bold text-primary-foreground">
              {question.points}
            </span>
          </div>
          <button
            ref={closeRef}
            onClick={onClose}
            aria-label="Close question"
            className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            <X className="size-5" />
          </button>
        </div>

        {!questionShown ? (
          /* Stage 1: image only — click to reveal the question */
          <div className="p-5">
            <button
              type="button"
              onClick={() => setQuestionShown(true)}
              aria-label="Show the question and answer choices"
              className="group block w-full cursor-pointer rounded-lg transition-transform hover:scale-[1.01] focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
            >
              <QuestionImage
                src={question.image}
                alt={question.imageAlt}
                dropName={question.imageHint}
              />
            </button>
            <p className="mt-4 text-center font-heading text-sm font-bold uppercase tracking-wide text-gold">
              Click the image to reveal the question
            </p>
          </div>
        ) : (
        <div className="grid gap-6 p-5 md:grid-cols-2">
          {/* Image */}
          <QuestionImage src={question.image} alt={question.imageAlt} dropName={question.imageHint} />

          {/* Question + options */}
          <div className="flex flex-col gap-4">
            <div className="prose-stem text-pretty text-lg leading-relaxed">
              <ReactMarkdown>{question.stem}</ReactMarkdown>
            </div>

            <ul className="flex flex-col gap-2">
              {question.options.map((opt) => {
                const isCorrect = revealed && opt.id === question.answer
                const isWrongPick =
                  revealed && selected === opt.id && opt.id !== question.answer
                return (
                  <li key={opt.id}>
                    <button
                      onClick={() => !revealed && setSelected(opt.id)}
                      disabled={revealed}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-lg border border-border px-3 py-2.5 text-left transition-colors",
                        !revealed &&
                          "hover:border-gold/70 hover:bg-accent disabled:cursor-default",
                        selected === opt.id && !revealed && "border-gold bg-accent",
                        isCorrect &&
                          "border-success bg-success/20 text-foreground",
                        isWrongPick && "border-destructive bg-destructive/20",
                      )}
                    >
                      <span
                        className={cn(
                          "flex size-7 shrink-0 items-center justify-center rounded-md border border-border font-heading text-sm font-bold",
                          isCorrect && "border-success bg-success text-white",
                          isWrongPick &&
                            "border-destructive bg-destructive text-white",
                        )}
                      >
                        {isCorrect ? <Check className="size-4" /> : opt.id}
                      </span>
                      <span className="leading-snug">{opt.text}</span>
                    </button>
                  </li>
                )
              })}
            </ul>

            {revealed && question.explanation && (
              <div className="prose-stem rounded-lg border border-border bg-accent/40 p-3 text-sm leading-relaxed">
                <p className="mb-1 font-heading text-xs font-bold uppercase tracking-wider text-gold">
                  Teaching point
                </p>
                <ReactMarkdown>{question.explanation}</ReactMarkdown>
              </div>
            )}
          </div>
        </div>
        )}

        {/* Footer / scoring — only after the question is shown */}
        {questionShown && (
        <div className="flex flex-col gap-4 border-t border-border px-5 py-4">
          {!revealed ? (
            <button
              onClick={() => setRevealed(true)}
              className="mx-auto rounded-lg bg-gold px-6 py-2.5 font-heading text-base font-bold uppercase tracking-wide text-primary-foreground transition-transform hover:scale-[1.02]"
            >
              Reveal Answer
            </button>
          ) : (
            <>
              <p className="text-center text-sm text-muted-foreground">
                {`Award or deduct ${question.points} points`}
              </p>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {TEAMS.map((team) => (
                  <div
                    key={team.id}
                    className="flex flex-col gap-1.5 rounded-lg border border-border p-2"
                  >
                    <span
                      className={cn(
                        "rounded-md py-1 text-center font-heading text-sm font-bold uppercase tracking-wide",
                        team.surface,
                      )}
                    >
                      {team.name}
                    </span>
                    <div className="flex gap-1.5">
                      <button
                        onClick={() => onAward(team.id, question.points)}
                        className="flex-1 rounded-md bg-success/90 py-1.5 font-heading text-sm font-bold text-white transition-colors hover:bg-success"
                      >
                        {`+${question.points}`}
                      </button>
                      <button
                        onClick={() => onAward(team.id, -question.points)}
                        className="flex-1 rounded-md bg-destructive/90 py-1.5 font-heading text-sm font-bold text-white transition-colors hover:bg-destructive"
                      >
                        {`-${question.points}`}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <button
                onClick={onComplete}
                className="mx-auto rounded-lg border border-gold bg-transparent px-6 py-2 font-heading text-sm font-bold uppercase tracking-wide text-gold transition-colors hover:bg-gold hover:text-primary-foreground"
              >
                Done — Close Tile
              </button>
            </>
          )}
        </div>
        )}
      </div>
    </div>
  )
}
