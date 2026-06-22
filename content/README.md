# Editing the Jeopardy Board (Markdown CMS)

All categories and questions live in this `content/` folder. Edit these files to
change the board — no code changes needed.

## Structure

```
content/
  01-upper-extremity/      <- one folder per CATEGORY (= one column)
    _meta.md               <- the category title
    100.md                 <- the 100-point question
    200.md
    300.md
    400.md
    500.md
  02-lower-extremity/
    ...
```

- **Column order** is the folder name order. Prefix folders with `01-`, `02-`, etc.
- The board renders **5 columns** (5 categories) and **5 rows** (100–500). Add or
  rename folders to change categories; the app reads whatever is here.

## Category title (`_meta.md`)

```md
---
title: Upper Extremity
---
```

## A question file (e.g. `300.md`)

```md
---
points: 300
image: /images/upper-extremity-300.png   # see "Images" below
imageAlt: AP radiograph of the elbow
answer: C                                 # the correct letter, A–D
options:
  A: First choice
  B: Second choice
  C: Third choice (correct one here)
  D: Fourth choice
explanation: >                            # optional, shown after reveal
  A short teaching point. Markdown is supported (**bold**, etc.).
---

The question stem goes here in the body. **Markdown is supported**, so you can
bold key terms, add line breaks, etc.
```

## Images

### Easiest way — just drop a file (no editing)

Name your image `<category>-<points>` and drop it into `public/images/`. The
board auto-detects it — you do **not** need to touch any markdown.

```
public/images/
  upper-extremity-100.png
  upper-extremity-200.jpg
  lower-extremity-300.png
  spine-and-pelvis-500.webp
  ...
```

- `<category>` is the folder name **without** the number prefix
  (`01-upper-extremity/` → `upper-extremity`).
- `<points>` is `100`, `200`, `300`, `400`, or `500`.
- Open any question that has no image yet and the placeholder tells you the
  exact filename to use.

Supported formats: `.png`, `.jpg`, `.jpeg`, `.webp`, `.gif`, `.avif`.

### Override — point to a custom path or URL

If you'd rather name files your own way or use a hosted image, set the
question's `image:` field. An explicit `image:` always wins over auto-detection:

```md
image: /images/my-custom-name.png        # custom local file
image: https://example.com/xray.jpg      # hosted URL
```

If an image is missing, the board shows a placeholder so the game still works.
