"use client"

import { Minus, Plus } from "lucide-react"
import { TEAMS, type TeamId } from "@/lib/teams"
import { cn } from "@/lib/utils"

type ScoreboardProps = {
  scores: Record<TeamId, number>
  onAdjust: (teamId: TeamId, delta: number) => void
}

export function Scoreboard({ scores, onAdjust }: ScoreboardProps) {
  const leader = Math.max(...TEAMS.map((t) => scores[t.id]))

  return (
    <section
      aria-label="Team scoreboard"
      className="grid grid-cols-2 gap-3 lg:grid-cols-4"
    >
      {TEAMS.map((team) => {
        const score = scores[team.id]
        const isLeader = score === leader && score > 0
        return (
          <div
            key={team.id}
            className={cn(
              "flex flex-col gap-2 rounded-xl border-2 p-3 transition-shadow",
              isLeader ? team.ring : "border-border",
              isLeader && "ring-2 ring-offset-2 ring-offset-background",
              isLeader && team.ring,
            )}
          >
            <div className="flex items-center justify-between gap-2">
              <span
                className={cn(
                  "rounded-md px-2.5 py-1 font-heading text-sm font-bold uppercase tracking-wide",
                  team.surface,
                )}
              >
                {team.name}
              </span>
              {isLeader && (
                <span className="font-heading text-[10px] font-bold uppercase tracking-wider text-gold">
                  Lead
                </span>
              )}
            </div>

            <div className="flex items-center justify-between gap-2">
              <button
                onClick={() => onAdjust(team.id, -100)}
                aria-label={`Subtract 100 from ${team.name}`}
                className="flex size-8 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                <Minus className="size-4" />
              </button>
              <span
                className={cn(
                  "font-heading text-3xl font-bold tabular-nums",
                  score < 0 ? "text-destructive" : "text-gold",
                )}
              >
                {score}
              </span>
              <button
                onClick={() => onAdjust(team.id, 100)}
                aria-label={`Add 100 to ${team.name}`}
                className="flex size-8 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                <Plus className="size-4" />
              </button>
            </div>
          </div>
        )
      })}
    </section>
  )
}
