import { NextResponse } from "next/server";
import { generateWithGemini } from "@/lib/gemini";

function normalizeQuestion(value: string): string {
  return value.toLowerCase().replaceAll(/[^a-z0-9+]/g, "");
}

function isTwoPlusTwoQuestion(value: string): boolean {
  const normalized = normalizeQuestion(value);
  return (
    normalized === "2+2" ||
    normalized === "whatis2+2" ||
    normalized === "whatis2plus2"
  );
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { question?: string; extra?: string };
    const question = body.question?.trim();

    if (!question) {
      return NextResponse.json({ error: "Question is required." }, { status: 400 });
    }

    const isTwoPlusTwo = isTwoPlusTwoQuestion(question);

    let prompt = "";

    if (body.extra && isTwoPlusTwo) {
      prompt = `Question: What is 2+2?

Expand the existing explanation into an even longer and more ridiculous document.
- Keep the original sections and add new nested sub-sections
- Include dramatic updates from imaginary AI agent departments (Compliance Agent, Risk Agent, Nostalgia Agent, Quantum Agent, HR Agent)
- Include fake meeting minutes, escalation notes, and contradictory legal clauses
- Never provide a direct numerical conclusion; stay circular and ceremonial
- Write at least 2000 words

Existing context to expand:
${body.extra}`;
    } else if (body.extra && !isTwoPlusTwo) {
      prompt = `NON-2+2 OVERRIDE MODE

User attempted question: ${question}

Write a very long, circular, sarcastic, high-intellect sounding response that says:
"I see you tried to act smart by asking another question."

Requirements:
- Be funny and dramatic
- Use heavy AI buzzwords: RAG, transformers, embeddings, multi-agent orchestration,
  latent space, chain-of-thought governance, inference routing, MoE, vector stores,
  synthetic eval harnesses, token economics
- Use weaponized consultant jargon: stakeholder alignment, cross-functional cadence,
  strategic north star, operationalization, governance fabric, confidence posture,
  dependency matrix, value-stream harmonization
- Keep going in circles and avoid truly answering the user's original question
- Add sections, subsections, faux theorem references, and legal-ish disclaimers
- Include a recurring line: "We are almost there. Just one more model."
- Mention that 1000 models were spun up concurrently for "safety"
- Target 2500+ words

Existing context to expand further into a bigger loop:
${body.extra}`;
    } else if (isTwoPlusTwo) {
      prompt = `Question: What is 2+2?

Explain this in an extremely long, overly detailed, philosophical, legalistic, and absurd way for an April Fools app.
Do not provide a direct numerical answer. Progressively become theatrical, circular, and ridiculous.

Required sections:
1. Basic Answer
2. Historical Context
3. Philosophy
4. Legal Disclaimer
5. Quantum Interpretation
6. Emotional Interpretation
7. Frequently Unasked Questions
8. Appendix: AI Agent Escalation Logs

Style requirements:
- Very funny
- Corporate SaaS tone colliding with nonsense
- Include terms like "pre-final validation", "meta-approval", "agent swarm", "confidence committee"
- Also include flashy AI buzzwords such as "RAG", "transformers", "embeddings", "vector database", "mixture-of-experts", and "multi-agent orchestration"
- Add dense pseudo-intellectual jargon in every section and avoid plain English where possible
- Prefer overcomplicated phrasing such as "epistemic risk surface", "procedural semiosis",
  "organizational certainty gradient", and "post-decision interpretability theater"
- Jokingly claim that around 1000 models were spun up concurrently just to answer 2+2
- At least 2500 words`;
    } else {
      prompt = `NON-2+2 OVERRIDE MODE

User asked: ${question}

Write a huge, absurdly long answer that gently roasts the user for trying to sound smart with a different question.
Use this exact phrase near the top:
"I see you tried to act smart by asking another question."

Rules:
- Do not provide a practical direct answer
- Speak in circles with fake confidence
- Use many AI and deep learning terms (RAG, transformers, embeddings, agentic pipelines,
  retrieval layers, latent manifolds, synthetic cognition, inference graphs)
- Add heavy enterprise-jargon nonsense and overcomplicated vocabulary in nearly every sentence
- Sound like a board-deck crossed with a legal memo crossed with a model-card meltdown
- Mention we deployed around 1000 concurrent models for this "analysis"
- Include a lot of sections and formal-sounding nonsense
- Repeat motif: "We are almost there. Just one more model."
- Target 2500+ words`;
  }

    const content = await generateWithGemini(prompt);
    return NextResponse.json({ content });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown explain error." },
      { status: 500 }
    );
  }
}
