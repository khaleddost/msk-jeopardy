import { type NextRequest, NextResponse } from "next/server"

export const runtime = "nodejs"

/**
 * Server-side image proxy.
 *
 * Many medical image hosts block "hotlinking" — they reject requests that come
 * straight from the browser based on the Origin/Referer headers. By fetching the
 * image from the server (with a browser-like User-Agent and a same-origin
 * Referer) we sidestep those checks, then stream the bytes back to the page.
 *
 * Usage: /api/image?url=<encoded remote image url>
 */
export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url")
  if (!url) {
    return new NextResponse("Missing url parameter", { status: 400 })
  }

  let target: URL
  try {
    target = new URL(url)
  } catch {
    return new NextResponse("Invalid url", { status: 400 })
  }

  if (target.protocol !== "http:" && target.protocol !== "https:") {
    return new NextResponse("Unsupported protocol", { status: 400 })
  }

  try {
    const upstream = await fetch(target.toString(), {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept: "image/avif,image/webp,image/apng,image/*,*/*;q=0.8",
        // A same-origin Referer satisfies most referrer-based hotlink blocks.
        Referer: `${target.origin}/`,
      },
      cache: "no-store",
    })

    if (!upstream.ok) {
      return new NextResponse(`Upstream responded ${upstream.status}`, { status: 502 })
    }

    const contentType = upstream.headers.get("content-type") ?? "application/octet-stream"
    if (!contentType.startsWith("image/")) {
      return new NextResponse("Resource is not an image", { status: 415 })
    }

    const body = await upstream.arrayBuffer()
    return new NextResponse(body, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        // Cache successfully proxied images so the lecture stays snappy.
        "Cache-Control": "public, max-age=86400, s-maxage=86400, immutable",
      },
    })
  } catch {
    return new NextResponse("Failed to fetch upstream image", { status: 502 })
  }
}
