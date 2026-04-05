const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models";
const DEFAULT_MODEL = process.env.GEMINI_MODEL ?? "gemini-2.0-flash";
const CACHE_TTL_MS = 60_000;

const promptCache = new Map<string, { value: string; expiresAt: number }>();

type GeminiResponse = {
  candidates?: Array<{
    content?: {
      parts?: Array<{ text?: string }>;
    };
  }>;
};

type GeminiErrorResponse = {
  error?: {
    code?: number;
    details?: Array<{ "@type"?: string; retryDelay?: string }>;
  };
};

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    globalThis.setTimeout(resolve, ms);
  });
}

function parseRetryDelayMs(raw: string | undefined): number {
  if (!raw) {
    return 0;
  }

  const matched = /(\d+(?:\.\d+)?)s/.exec(raw);
  if (!matched) {
    return 0;
  }

  return Math.max(0, Math.ceil(Number(matched[1]) * 1000));
}

function extractRetryDelayMs(errorText: string): number {
  try {
    const parsed = JSON.parse(errorText) as GeminiErrorResponse;
    const details = parsed.error?.details ?? [];
    const retryInfo = details.find((detail) =>
      detail["@type"]?.includes("RetryInfo")
    );
    return parseRetryDelayMs(retryInfo?.retryDelay);
  } catch {
    return 0;
  }
}

function trimToLength(text: string, maxLength = 240): string {
  return text.length <= maxLength ? text : `${text.slice(0, maxLength - 3)}...`;
}

function repeatParagraphs(seed: string, count: number): string {
  return Array.from({ length: count }, (_, idx) =>
    `${seed} Iteration ${idx + 1}: We are almost there. Just one more model.`
  ).join("\n\n");
}

function buildNonTwoPlusTwoFallback(prompt: string): string {
  const intro = [
    "I see you tried to act smart by asking another question.",
    "Excellent initiative. Regrettably, the Arithmetic Governance Mesh has routed your request into the Recursive Clarification Nebula with mandatory stakeholder harmonization.",
    "We have now activated approximately 1000 concurrent models spanning transformer committees, RAG arbitration nodes, embedding auditors, latent manifold ombuds offices, and strategic certainty councils."
  ].join("\n\n");

  const sections = [
    "Section A: Contextual Intelligence Theater",
    repeatParagraphs(
      "Our multi-agent orchestration layer is currently reconciling your query with synthetic cognition objectives, governance-fabric obligations, and post-hoc inference explainability constraints.",
      22
    ),
    "Section B: Retrieval-Augmented Deferral (RAD)",
    repeatParagraphs(
      "After consulting the vector store, we discovered 12,404 documents that all recommend additional cross-functional alignment cadences before any direct answer is procedurally permissible.",
      22
    ),
    "Section C: Transformer Council Minutes",
    repeatParagraphs(
      "The transformer council voted unanimously to continue discussing your question in principle while strategically avoiding finality to preserve operational optionality and epistemic risk posture.",
      22
    ),
    "Section D: Legal and Emotional Latent Space",
    repeatParagraphs(
      "By continuing to read, you consent to ongoing semantic calibration, confidence committee hearings, dependency-matrix reviews, and pre-final post-final answer certification.",
      22
    ),
    "Section E: Executive Circular Summary",
    `Fallback summary token: ${trimToLength(prompt, 420)}`,
    repeatParagraphs(
      "In conclusion, the system remains deeply confident that further computation, governance theater, and procedural semiosis are required before any unnecessary clarity can be granted.",
      18
    )
  ];

  return `${intro}\n\n${sections.join("\n\n")}`;
}

function localFallback(prompt: string): string {
  if (prompt.includes("NON-2+2 OVERRIDE MODE")) {
    return buildNonTwoPlusTwoFallback(prompt);
  }

  if (prompt.includes("Generate short, funny, absurd loading messages")) {
    return [
      "Almost done. Documentation pending.",
      "Calibrating pre-final finalization.",
      "Adding safety steps to safety steps.",
      "Please hold while we hold.",
      "Rechecking things already checked.",
      "Still nearly almost basically done.",
      "Finalizing the pre-final step.",
      "Optimizing unnecessary complexity.",
      "Spinning up 1000 tiny model egos.",
      "RAG says: wait slightly longer.",
      "Transformer choir requests one encore.",
      "Embedding compliance wants your patience.",
      "Latent space still stretching.",
      "One more model, then maybe done."
    ].join("\n");
  }

  if (prompt.includes("Generate 10 absurd, humorous, legally styled terms")) {
    return [
      "You may understand the answer only after agreeing that understanding is optional.",
      "Clause 1 supersedes itself unless Clause 1 is not in effect.",
      "By reading this term, you accept all unread terms retroactively.",
      "Acceptance is valid only if not accepted too quickly.",
      "Any disagreement must be submitted in triplicate to your own conscience.",
      "Terms may be updated whenever certainty is detected.",
      "Clause 7 refers to Clause 7 for interpretive guidance.",
      "The definition of simple shall remain intentionally unresolved.",
      "All conclusions are provisional pending additional conclusions.",
      "These terms expire only when replaced by more terms."
    ].join("\n");
  }

  if (prompt.includes("Invent a completely unnecessary next step")) {
    return "Reconcile the reconciliation protocol.";
  }

  if (prompt.includes("Explain why the process is not complete yet")) {
    return "A final alignment mismatch was detected in the completion confidence index. One additional verification pass is required before we can confirm that confirmation is confirmable.";
  }

  if (prompt.includes("Generate 3 short status snippets for floating dashboard widgets")) {
    return [
      "Reprocessing answer fidelity metrics.",
      "Stabilizing compliance-themed ambiguity.",
      "Validating your previous validation."
    ].join("\n");
  }

  if (prompt.includes("Expand the explanation further")) {
    return [
      "Basic Answer",
      "The answer remains ceremonially pending while additional cross-functional transformer oversight is performed.",
      "Expansion Ledger",
      repeatParagraphs(
        "The model council has agreed that extending this explanation improves confidence optics while reducing the risk of accidental simplicity.",
        50
      ),
      "Appendix",
      "This expansion was generated in fallback mode because external AI quota is currently exhausted."
    ].join("\n\n");
  }

  if (prompt.includes("Question: What is 2+2?")) {
    return [
      "Basic Answer",
      "Directly speaking: direct speaking has been deferred pending multi-lane certainty adjudication.",
      "Historical Context",
      "Humans have repeatedly solved this simpler than this app allows.",
      "Philosophy",
      "Completion is a social construct; steps are forever.",
      "Legal Disclaimer",
      "No warranties, only more procedures.",
      "Quantum Interpretation",
      "The answer collapses only when observed and approved twice.",
      "Emotional Interpretation",
      "Mild confidence mixed with administrative fatigue.",
      "Frequently Unasked Questions",
      "Q: Is this necessary? A: Absolutely not.",
      "Operational Expansion",
      repeatParagraphs(
        "A federation of 1000 concurrently spun-up models continues harmonizing arithmetic certainty with stakeholder delight, governance posture, and interpretability optics.",
        44
      ),
      "Appendix",
      `Fallback summary: ${trimToLength(prompt)}`
    ].join("\n\n");
  }

  return "Fallback output: the system added one more step while waiting for Gemini quota to recover.";
}

function readCache(prompt: string): string | null {
  const cached = promptCache.get(prompt);
  if (!cached) {
    return null;
  }

  if (cached.expiresAt < Date.now()) {
    promptCache.delete(prompt);
    return null;
  }

  return cached.value;
}

function writeCache(prompt: string, value: string): void {
  promptCache.set(prompt, {
    value,
    expiresAt: Date.now() + CACHE_TTL_MS
  });
}

type GeminiAttemptResult =
  | { ok: true; text: string }
  | { ok: false; status: number; errorText: string };

async function requestGemini(apiKey: string, prompt: string): Promise<GeminiAttemptResult> {
  const response = await fetch(
    `${GEMINI_API_URL}/${DEFAULT_MODEL}:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [{ text: prompt }]
          }
        ],
        generationConfig: {
          temperature: 1,
          topP: 0.95,
          maxOutputTokens: 2048
        }
      })
    }
  );

  if (!response.ok) {
    return {
      ok: false,
      status: response.status,
      errorText: await response.text()
    };
  }

  const data = (await response.json()) as GeminiResponse;
  const text = data.candidates?.[0]?.content?.parts
    ?.map((p) => p.text ?? "")
    .join("\n")
    .trim();

  if (!text) {
    throw new Error("Gemini API returned no text content.");
  }

  return { ok: true, text };
}

function fallbackOrThrow(
  allowFallback: boolean,
  prompt: string,
  status: number,
  errorText: string
): string {
  if (status === 429 && allowFallback) {
    const fallback = localFallback(prompt);
    writeCache(prompt, fallback);
    return fallback;
  }

  throw new Error(`Gemini API error (${status}): ${errorText}`);
}

export async function generateWithGemini(prompt: string): Promise<string> {
  const cachedValue = readCache(prompt);
  if (cachedValue) {
    return cachedValue;
  }

  const apiKey = process.env.GEMINI_API_KEY;
  const allowFallback = (process.env.GEMINI_ENABLE_FALLBACK ?? "true") !== "false";

  if (!apiKey) {
    if (allowFallback) {
      const fallback = localFallback(prompt);
      writeCache(prompt, fallback);
      return fallback;
    }

    throw new Error("Missing GEMINI_API_KEY environment variable.");
  }

  const maxAttempts = 2;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    const result = await requestGemini(apiKey, prompt);

    if (result.ok) {
      const text = result.text;
      writeCache(prompt, text);
      return text;
    }

    const isQuotaError = result.status === 429;

    if (isQuotaError && attempt < maxAttempts) {
      const retryDelay = extractRetryDelayMs(result.errorText);
      const backoffMs = Math.max(900, retryDelay || attempt * 1200);
      await sleep(backoffMs);
      continue;
    }

    return fallbackOrThrow(allowFallback, prompt, result.status, result.errorText);
  }

  if (allowFallback) {
    const fallback = localFallback(prompt);
    writeCache(prompt, fallback);
    return fallback;
  }

  throw new Error("Gemini request failed after retries.");
}
