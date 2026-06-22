"use client"

import { useState } from "react"

type QuestionImageProps = {
  src?: string
  alt?: string
  /** Suggested filename to drop into public/images/ when no image is set. */
  dropName?: string
}

const PLACEHOLDER = "/images/placeholder.png"

export function QuestionImage({ src, alt, dropName }: QuestionImageProps) {
  const [errored, setErrored] = useState(false)
  const isExternal = !!src && /^https?:\/\//.test(src)
  // External hosts often block hotlinking, so fetch them through our server-side
  // proxy. Local files (e.g. /images/...) are served directly.
  const display = isExternal ? `/api/image?url=${encodeURIComponent(src!)}` : src
  const resolved = !src || errored ? PLACEHOLDER : display
  const isPlaceholder = resolved === PLACEHOLDER

  return (
    <figure className="relative overflow-hidden rounded-lg border border-border bg-black/40">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={resolved || "/placeholder.svg"}
        alt={alt || "Radiology image for this question"}
        referrerPolicy="no-referrer"
        onError={() => setErrored(true)}
        className="mx-auto max-h-[48vh] w-full object-contain"
      />
      {isPlaceholder && (
        <figcaption className="absolute inset-x-0 bottom-0 bg-black/70 px-3 py-2 text-center text-xs text-muted-foreground">
          {!src && dropName
            ? `No image yet — drop a file named ${dropName} into public/images/ (no editing needed).`
            : isExternal
              ? `Could not load image from ${src} — the host may block hotlinking. Try downloading it into public/images instead.`
              : `Missing image — add it at public${src}`}
        </figcaption>
      )}
    </figure>
  )
}
