# CODING AGENTS: READ THIS FIRST

This is a **handoff bundle** from Claude Design (claude.ai/design).

A user mocked up designs in HTML/CSS/JS using an AI design tool, then exported this bundle so a coding agent can implement the designs for real.

## What you should do — IMPORTANT

**Read `torsdagslopet/project/Mobil-skjermer.dc.html` and `torsdagslopet/project/Web-skjermer.dc.html` in full.** Read it top to bottom — don't skim. Then **follow its imports**: open every file it pulls in (shared components, CSS, scripts) so you understand how the pieces fit together before you start implementing.

**If anything is ambiguous, ask the user to confirm before you start implementing.** It's much cheaper to clarify scope up front than to build the wrong thing.

## About the design files

The design medium is **HTML/CSS/JS** — these are prototypes, not production code. Your job is to **recreate them pixel-perfectly** in whatever technology makes sense for the target codebase (React, Vue, native, whatever fits). Match the visual output; don't copy the prototype's internal structure unless it happens to fit.

**Don't render these files in a browser or take screenshots unless the user asks you to.** Everything you need — dimensions, colors, layout rules — is spelled out in the source. Read the HTML and CSS directly; a screenshot won't tell you anything they don't.

## Before implementing
The design is a re-design of the existing `torsdagslopet` project. Before you start implementing, **familiarize yourself with the existing project** so you understand what you're building and how it differs from the current version.

## Bundle contents

- `torsdagslopet/README.md` — this file
- `torsdagslopet/project/` — the `torsdagslopet` project files (HTML prototypes, assets, components)
