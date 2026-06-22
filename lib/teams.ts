export type TeamId = "red" | "blue" | "green" | "yellow"

export type Team = {
  id: TeamId
  name: string
  /** Tailwind classes for the team's solid color surface */
  surface: string
  /** Tailwind ring color class */
  ring: string
  /** Tailwind text color class */
  text: string
}

export const TEAMS: Team[] = [
  {
    id: "red",
    name: "Red Team",
    surface: "bg-team-red text-white",
    ring: "ring-team-red",
    text: "text-team-red",
  },
  {
    id: "blue",
    name: "Blue Team",
    surface: "bg-team-blue text-white",
    ring: "ring-team-blue",
    text: "text-team-blue",
  },
  {
    id: "green",
    name: "Green Team",
    surface: "bg-team-green text-white",
    ring: "ring-team-green",
    text: "text-team-green",
  },
  {
    id: "yellow",
    name: "Yellow Team",
    surface: "bg-team-yellow text-[oklch(0.24_0.1_264)]",
    ring: "ring-team-yellow",
    text: "text-team-yellow",
  },
]

export const INITIAL_SCORES: Record<TeamId, number> = {
  red: 0,
  blue: 0,
  green: 0,
  yellow: 0,
}
