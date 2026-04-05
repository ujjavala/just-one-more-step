*This is a submission for the [DEV April Fools Challenge](https://dev.to/challenges/aprilfools-2026)*

## What I Built
I built **JustOneMoreStep**, a deliberately overengineered satire app that treats a tiny question like a mission-critical enterprise initiative.

Ask something like `2+2`, and instead of a normal response, you get a full procedural spectacle:

- absurdly long AI explanations
- rotating AI-generated loading lines
- infinite legal-style terms and escalation loops
- fake progress pipelines and ceremonial "just one more step" gating
- dramatic non-2+2 warning theatrics
- click-based April Fools surprises (panic overlays, chaos toasts, prank label swaps, Konami-mode chaos)

The point is not utility. The point is theatrical overbuild.

It is intentionally useless software pretending to be extremely important software.

## Demo
- Hosted static demo: https://ujjavala.github.io/just-one-more-step/
- Local demo (best experience): `http://localhost:3000`
- Main pages:
  - Home experience: `/`
  - About satire page: `/about`
  - Upcoming services parody page: `/services`

## Code
GitHub repository:

- https://github.com/ujjavala/just-one-more-step

Core API route surface:

- `/api/explain`
- `/api/loading`
- `/api/terms`
- `/api/steps`
- `/api/loop`
- `/api/widgets`

## How I Built It
I used:

- **Next.js 14 (App Router)**
- **React + TypeScript**
- **Google AI (Gemini API)** for long-form explainers, loading text, legal nonsense, step escalation, loop reasons, and widget statuses
- **Custom CSS** for a cinematic neon style, rotating/orbital visuals, pulse/flash effects, and exaggerated motion
- **Lucide React** for icon-heavy UI accents and playful interaction cues

Implementation notes:

- The app intentionally routes one trivial question through multiple AI-driven layers.
- The UI is friction-first by design: terms loops, escalation controls, procedural language, and fake governance UX.
- I added April Fools click-surprise mechanics so users trigger chaotic overlays and achievement-like nonsense.
- The app supports static client fallback mode so the joke still works without server-side AI.

## How I Leveraged Google AI (Detailed)
Gemini is used as a **multi-role narrative engine**, not a single chatbot call.

- `/api/explain`: Generates long circular, philosophical, legal-ish over-explanations.
- `/api/loading`: Generates rotating loading narratives so waiting becomes the product.
- `/api/terms`: Generates absurd compliance clauses for infinite T&C escalation.
- `/api/steps`: Generates unnecessary next-step bureaucracy.
- `/api/loop`: Generates fresh reasons why completion remains unavailable.
- `/api/widgets`: Generates floating dashboard/status micro-chaos.

Reliability layer for consistent satire:

- in-memory prompt cache (`60s` TTL)
- retry with backoff on Gemini quota/rate errors (`429`)
- local fallback generators when API/key calls fail
- client-side static fallback mode for static deployments

That keeps the absurd experience alive even when real-world API limits appear.

## Prize Category
**Best Google AI Usage**

Gemini is everywhere: explanations, loading states, legal text, next-step logic, loop reasons, and widget chatter. I did not ask AI one question. I made it run a micro-enterprise to avoid giving a normal answer.

**Best Ode to Larry Masinter**

The app embraces HTTP-418 teapot energy: procedural refusal, ritualized non-finality, and an intentional anti-completion vibe where every path suggests one more checkpoint before "done" can exist.

**Community Favorite**

This project is designed to make developers laugh, squint, and ask why it exists. It is a love letter to overengineering, compliance theater, and the lived experience of turning a simple problem into a full-stack saga.

If this made you mildly frustrated but genuinely entertained, mission accomplished.
