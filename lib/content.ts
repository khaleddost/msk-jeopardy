import fs from "fs"
import path from "path"
import matter from "gray-matter"

export type OptionId = "A" | "B" | "C" | "D"

export type QuestionOption = {
  id: OptionId
  text: string
}

export type Question = {
  /** Stable id, e.g. "upper-extremity-100" */
  id: string
  points: number
  /** Markdown question stem */
  stem: string
  image?: string
  imageAlt?: string
  /** Suggested filename to drop into public/images/ for auto-detection. */
  imageHint: string
  options: QuestionOption[]
  answer: OptionId
  /** Optional markdown explanation shown after the answer is revealed */
  explanation?: string
}

export type Category = {
  /** Folder name, used as a stable id */
  id: string
  title: string
  questions: Question[]
}

const CONTENT_DIR = path.join(process.cwd(), "content")
const PUBLIC_IMAGES_DIR = path.join(process.cwd(), "public", "images")
const POINT_VALUES = [100, 200, 300, 400, 500]
const IMAGE_EXTS = ["png", "jpg", "jpeg", "webp", "gif", "avif"]

/** Strip a leading numeric ordering prefix, e.g. "01-upper-extremity" -> "upper-extremity". */
function toSlug(folder: string): string {
  return folder.replace(/^\d+[-_]?/, "")
}

/**
 * Auto-detects an image dropped into public/images/ that is named after the
 * question, so no markdown editing is needed. Looks for files named like:
 *   upper-extremity-100.png      (category slug + points)
 *   01-upper-extremity-100.jpg   (full folder name + points)
 * Returns a public URL path (e.g. "/images/upper-extremity-100.png") or undefined.
 */
function findImageByConvention(categoryFolder: string, points: number): string | undefined {
  if (!fs.existsSync(PUBLIC_IMAGES_DIR)) return undefined

  const slug = toSlug(categoryFolder)
  const baseNames = [`${slug}-${points}`, `${categoryFolder}-${points}`]

  for (const base of baseNames) {
    for (const ext of IMAGE_EXTS) {
      const candidate = `${base}.${ext}`
      if (fs.existsSync(path.join(PUBLIC_IMAGES_DIR, candidate))) {
        return `/images/${candidate}`
      }
    }
  }
  return undefined
}

function readMeta(categoryDir: string): { title: string } {
  const metaPath = path.join(categoryDir, "_meta.md")
  if (fs.existsSync(metaPath)) {
    const { data } = matter(fs.readFileSync(metaPath, "utf8"))
    if (typeof data.title === "string" && data.title.trim()) {
      return { title: data.title.trim() }
    }
  }
  // Fall back to a humanized folder name
  const folder = path.basename(categoryDir)
  const title = folder
    .replace(/^\d+[-_]?/, "")
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase())
  return { title }
}

function normalizeOptions(raw: unknown): QuestionOption[] {
  const ids: OptionId[] = ["A", "B", "C", "D"]
  // Supports `options:` as a mapping (A: "...", B: "...") in frontmatter.
  if (raw && typeof raw === "object" && !Array.isArray(raw)) {
    const obj = raw as Record<string, unknown>
    return ids
      .filter((id) => obj[id] != null)
      .map((id) => ({ id, text: String(obj[id]) }))
  }
  // Supports `options:` as a list, mapped to A-D in order.
  if (Array.isArray(raw)) {
    return raw.slice(0, 4).map((text, i) => ({ id: ids[i], text: String(text) }))
  }
  return []
}

function readQuestion(categoryDir: string, categoryId: string, points: number): Question | null {
  const filePath = path.join(categoryDir, `${points}.md`)
  if (!fs.existsSync(filePath)) return null

  let data: Record<string, unknown> = {}
  let content = ""
  try {
    const parsed = matter(fs.readFileSync(filePath, "utf8"))
    data = parsed.data as Record<string, unknown>
    content = parsed.content
  } catch (err) {
    // A malformed frontmatter (e.g. a YAML typo) in one file shouldn't crash the
    // whole board. Surface the problem in the tile instead.
    console.log(`[v0] Failed to parse ${categoryId}/${points}.md:`, (err as Error).message)
    return {
      id: `${categoryId}-${points}`,
      points,
      stem: `⚠️ This question could not be loaded. Check \`content/${categoryId}/${points}.md\` — its frontmatter has a formatting error: ${(err as Error).message}`,
      imageHint: `${toSlug(categoryId)}-${points}.png`,
      options: [],
      answer: "A",
    }
  }

  const answer = String(data.answer ?? "A").trim().toUpperCase() as OptionId

  // An explicit `image:` in frontmatter always wins (supports URLs + custom paths).
  // Otherwise, auto-detect a file dropped into public/images/ named by convention.
  const explicitImage = typeof data.image === "string" ? data.image.trim() : ""
  const image = explicitImage || findImageByConvention(categoryId, points)

  return {
    id: `${categoryId}-${points}`,
    points,
    stem: content.trim(),
    image: image || undefined,
    imageAlt: typeof data.imageAlt === "string" ? data.imageAlt.trim() : undefined,
    imageHint: `${toSlug(categoryId)}-${points}.png`,
    options: normalizeOptions(data.options),
    answer: (["A", "B", "C", "D"].includes(answer) ? answer : "A") as OptionId,
    explanation:
      typeof data.explanation === "string" && data.explanation.trim()
        ? data.explanation.trim()
        : undefined,
  }
}

/**
 * Loads every category (one folder per column) and its 5 point-value
 * questions. Categories are ordered by folder name, so prefix folders
 * with numbers (01-, 02-, ...) to control column order.
 */
export function getCategories(): Category[] {
  if (!fs.existsSync(CONTENT_DIR)) return []

  const categoryDirs = fs
    .readdirSync(CONTENT_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort()

  return categoryDirs.map((folder) => {
    const categoryDir = path.join(CONTENT_DIR, folder)
    const { title } = readMeta(categoryDir)
    const questions = POINT_VALUES.map((points) =>
      readQuestion(categoryDir, folder, points),
    ).filter((q): q is Question => q !== null)

    return { id: folder, title, questions }
  })
}

export { POINT_VALUES }
