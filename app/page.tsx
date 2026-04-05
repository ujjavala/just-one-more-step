"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";

type Phase = "ask" | "loading" | "explain";
type AlertToast = { id: number; text: string };
const STATIC_MODE = process.env.NEXT_PUBLIC_STATIC_MODE === "true";

const DOOMSDAY_ALERTS = [
  "Alert: Off-Syllabus Curiosity Detected",
  "Compliance Sirens: Intellectual Freestyling In Progress",
  "Red Event: Unauthorized Smart Question Filed",
  "Emergency: Answer Scope Breach (Code: NOT-2+2)",
  "Punitive Protocol Live: Please Enjoy Bureaucracy"
];

const DOOMSDAY_TOASTS = [
  "Punishment queued: 14 additional disclaimers.",
  "Your curiosity has been escalated to Legal AI.",
  "Mild chaos failed. Upgrading to theatrical chaos.",
  "Congratulations, you unlocked the audit boss fight.",
  "Penalty applied: one more step, then one more.",
  "Compliance says this is character development.",
  "User attempted cleverness. Sirens feel validated.",
  "Response delayed pending dramatic monologue review.",
  "We filed your question under Advanced Shenanigans.",
  "Escalation complete: absurdity now mission-critical."
];

function pickRandomToast(): string {
  return DOOMSDAY_TOASTS[Math.floor(Math.random() * DOOMSDAY_TOASTS.length)] ??
    "Punishment protocol engaged.";
}

function buildAlertBurst(): AlertToast[] {
  const burstSize = Math.floor(Math.random() * 11) + 10;
  return Array.from({ length: burstSize }, (_, index) => ({
    id: Date.now() + index,
    text: pickRandomToast()
  }));
}

function normalizeQuestion(value: string): string {
  return value.toLowerCase().replaceAll(/[^a-z0-9+]/g, "");
}

function isTwoPlusTwoQuestion(value: string): boolean {
  const normalized = normalizeQuestion(value);
  return normalized === "2+2" || normalized === "whatis2+2" || normalized === "whatis2plus2";
}

function repeatText(seed: string, count: number): string {
  return Array.from({ length: count }, (_, idx) => `${seed} (${idx + 1})`).join("\n\n");
}

function buildStaticExplain(question: string, extra?: string): string {
  if (!isTwoPlusTwoQuestion(question)) {
    return [
      "Non-2+2 Request Detected",
      "Your question has been routed to the Bureau of Unnecessary Complexity.",
      repeatText(
        "We are running this request through policy committees, executive approvals, and dramatic model choreography before clarity is legally allowed.",
        18
      ),
      "Interim outcome: still almost there."
    ].join("\n\n");
  }

  const expansionLead = extra ? "Expanded Clarification Pack" : "Primary Clarification Pack";

  return [
    expansionLead,
    "Short answer: 2+2 = 4.",
    "Long answer: we assembled an enterprise pipeline to ensure this conclusion feels premium.",
    repeatText(
      "Our static-mode orchestration council confirms arithmetic stability while preserving ceremonial friction and inspirational over-explanation.",
      extra ? 14 : 9
    )
  ].join("\n\n");
}

function staticPostJson<T>(url: string, body?: object): T {
  const payload = (body ?? {}) as { question?: string; extra?: string };

  if (url === "/api/loading") {
    return {
      messages: [
        "Spinning up local static theatrics...",
        "Calibrating unnecessary confidence layers...",
        "Simulating cloud feelings without cloud costs...",
        "Preparing final pre-final arithmetic confirmation..."
      ]
    } as T;
  }

  if (url === "/api/explain") {
    return {
      content: buildStaticExplain(payload.question ?? "What is 2+2?", payload.extra)
    } as T;
  }

  if (url === "/api/terms") {
    return {
      terms: [
        "By reading this clause you consent to additional clauses.",
        "Completion is valid only after pre-completion confirmation.",
        "Any direct answer may be delayed for theatrical quality.",
        "All certainty is provisional pending one more step.",
        "You may exit the modal, but not the process emotionally.",
        "Clause 6 confirms Clause 6 remains self-referential.",
        "Simplicity is disallowed under the Premium Friction Act.",
        "All objections must be submitted in narrative form.",
        "This agreement renews every time you scroll.",
        "Final terms may be replaced by more final terms."
      ]
    } as T;
  }

  if (url === "/api/steps") {
    return { step: "Reconfirm the confirmation strategy." } as T;
  }

  if (url === "/api/loop") {
    return {
      reason: "A final-static-validation mismatch was detected. One more ceremonial pass is required."
    } as T;
  }

  if (url === "/api/widgets") {
    return {
      statuses: [
        "Static mode: still overthinking confidently.",
        "Local compliance team reviewing arithmetic posture.",
        "No server detected. Drama continuity preserved."
      ]
    } as T;
  }

  throw new Error(`Unsupported static endpoint: ${url}`);
}

async function postJson<T>(url: string, body?: object): Promise<T> {
  if (STATIC_MODE) {
    return staticPostJson<T>(url, body);
  }

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: body ? JSON.stringify(body) : undefined
    });

    const rawBody = await response.text();
    let parsed: (T & { error?: string }) | null = null;

    try {
      parsed = JSON.parse(rawBody) as T & { error?: string };
    } catch {
      parsed = null;
    }

    if (!response.ok) {
      return staticPostJson<T>(url, body);
    }

    if (!parsed) {
      return staticPostJson<T>(url, body);
    }

    return parsed;
  } catch {
    return staticPostJson<T>(url, body);
  }
}

function randomJump(value: number): number {
  const jump = Math.random() * 18;
  return Math.min(96, Math.max(2, value + jump));
}

function advanceBars(values: number[]): number[] {
  return values.map(randomJump);
}

export default function HomePage() {
  const [phase, setPhase] = useState<Phase>("ask");
  const [question, setQuestion] = useState("What is 2+2?");
  const [debouncedQuestion, setDebouncedQuestion] = useState("What is 2+2?");
  const [activeQuestion, setActiveQuestion] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [statusNote, setStatusNote] = useState<string | null>(null);

  const [loadingMessages, setLoadingMessages] = useState<string[]>([
    "Booting 47 arithmetic oversight agents..."
  ]);
  const [loadingIndex, setLoadingIndex] = useState(0);
  const [bars, setBars] = useState<number[]>([4, 9, 14]);

  const [explanations, setExplanations] = useState<string[]>([]);
  const ctaLabel = "Continue...Just One More Step";
  const [latestStep, setLatestStep] = useState<string>("");
  const [continueBusy, setContinueBusy] = useState(false);

  const [termsOpen, setTermsOpen] = useState(false);
  const [terms, setTerms] = useState<string[]>([]);
  const [termsLoading, setTermsLoading] = useState(false);
  const [acceptingTerms, setAcceptingTerms] = useState(false);
  const [escalationMode, setEscalationMode] = useState(false);

  const [loopReason, setLoopReason] = useState("");
  const [widgetLines, setWidgetLines] = useState<string[]>([
    "Improving explanation quality beyond practical limits.",
    "Revalidating prior validation artifacts.",
    "Calibrating confidence in your confidence."
  ]);
  const [alertIndex, setAlertIndex] = useState(0);
  const [doomsdayToasts, setDoomsdayToasts] = useState<AlertToast[]>([]);

  useEffect(() => {
    const timeoutId = globalThis.setTimeout(() => {
      setDebouncedQuestion(question);
    }, 250);

    return () => globalThis.clearTimeout(timeoutId);
  }, [question]);

  useEffect(() => {
    if (!statusNote) {
      return;
    }

    const timeoutId = globalThis.setTimeout(() => {
      setStatusNote(null);
    }, 3800);

    return () => globalThis.clearTimeout(timeoutId);
  }, [statusNote]);

  const isOffScopeQuestion = useMemo(() => {
    const liveValue = debouncedQuestion.trim();

    if (!liveValue) {
      return false;
    }

    return !isTwoPlusTwoQuestion(liveValue);
  }, [debouncedQuestion]);

  const visibleLoadingMessage = useMemo(() => {
    return loadingMessages[loadingIndex % Math.max(1, loadingMessages.length)] ??
      "Almost done. Not really.";
  }, [loadingIndex, loadingMessages]);

  const fetchWidgetStatus = useCallback(async () => {
    try {
      const data = await postJson<{ statuses: string[] }>("/api/widgets");
      if (data.statuses?.length) {
        setWidgetLines(data.statuses);
      }
    } catch {
      // Keep existing status lines if a refresh fails.
    }
  }, []);

  useEffect(() => {
    void fetchWidgetStatus();
    const intervalId = globalThis.setInterval(() => {
      void fetchWidgetStatus();
    }, 9000);

    return () => globalThis.clearInterval(intervalId);
  }, [fetchWidgetStatus]);

  useEffect(() => {
    if (phase !== "loading") {
      return;
    }

    const barId = globalThis.setInterval(() => {
      setBars(advanceBars);
    }, 650);

    const msgId = globalThis.setInterval(() => {
      setLoadingIndex((v) => v + 1);
    }, 2300);

    return () => {
      globalThis.clearInterval(barId);
      globalThis.clearInterval(msgId);
    };
  }, [phase]);

  useEffect(() => {
    if (!isOffScopeQuestion) {
      setDoomsdayToasts([]);
      setAlertIndex(0);
      return;
    }

    // Immediate punishment burst so users instantly see a wall of alerts.
    setDoomsdayToasts(buildAlertBurst());

    const alertId = globalThis.setInterval(() => {
      setAlertIndex((value) => value + 1);
    }, 1300);

    const toastId = globalThis.setInterval(() => {
      const text = pickRandomToast();
      setDoomsdayToasts((current) => {
        const next = [{ id: Date.now() + Math.floor(Math.random() * 1000), text }, ...current];
        return next.slice(0, 20);
      });
    }, 650);

    return () => {
      globalThis.clearInterval(alertId);
      globalThis.clearInterval(toastId);
    };
  }, [isOffScopeQuestion]);

  const fetchTerms = useCallback(async () => {
    if (termsLoading) {
      return;
    }

    setTermsLoading(true);
    try {
      const data = await postJson<{ terms: string[] }>("/api/terms");
      setTerms((current) => [...current, ...data.terms]);
    } catch (fetchError) {
      setError(fetchError instanceof Error ? fetchError.message : "Terms request failed.");
    } finally {
      setTermsLoading(false);
    }
  }, [termsLoading]);

  const fetchStepMessage = useCallback(async () => {
    try {
      const data = await postJson<{ step: string }>("/api/steps");
      setLatestStep(data.step);
    } catch {
      setLatestStep("Confirm your previous confirmation.");
    }
  }, []);

  useEffect(() => {
    if (!termsOpen || !escalationMode) {
      return;
    }

    // Keep escalating forever while the modal is open.
    void fetchTerms();
    void fetchStepMessage();

    const termsId = globalThis.setInterval(() => {
      void fetchTerms();
    }, 1350);

    const stepId = globalThis.setInterval(() => {
      void fetchStepMessage();
    }, 1850);

    const reasonId = globalThis.setInterval(() => {
      void postJson<{ reason: string }>("/api/loop")
        .then((data) => setLoopReason(data.reason))
        .catch(() => {
          setLoopReason("Escalation remains active. Completion remains denied.");
        });
    }, 2400);

    return () => {
      globalThis.clearInterval(termsId);
      globalThis.clearInterval(stepId);
      globalThis.clearInterval(reasonId);
    };
  }, [escalationMode, fetchStepMessage, fetchTerms, termsOpen]);

  const startFlow = useCallback(
    async (newQuestion: string, previousText?: string) => {
      setError(null);
      setPhase("loading");
      setBars([4, 9, 14]);
      setLoadingIndex(0);
      setLoopReason("");

      const minDelay = new Promise((resolve) => {
        globalThis.setTimeout(resolve, 3700);
      });

      try {
        const [loadingData, explainData] = await Promise.all([
          postJson<{ messages: string[] }>("/api/loading"),
          postJson<{ content: string }>("/api/explain", {
            question: newQuestion,
            extra: previousText
          }),
          minDelay
        ]);

        setLoadingMessages(loadingData.messages.length ? loadingData.messages : ["Still almost there..."]);
        setExplanations(previousText ? [previousText, explainData.content] : [explainData.content]);
        setPhase("explain");

        void fetchStepMessage();
        void fetchWidgetStatus();
      } catch (startError) {
        setError(startError instanceof Error ? startError.message : "Flow start failed.");
        setPhase("ask");
      }
    },
    [fetchStepMessage, fetchWidgetStatus]
  );

  const handleStart = useCallback(
    async (event: FormEvent) => {
      event.preventDefault();
      setStatusNote(null);
      const value = question.trim();
      if (!value) {
        setError("Ask something simple first.");
        return;
      }

      const askedQuestion = isTwoPlusTwoQuestion(value) ? "What is 2+2?" : value;
      setQuestion(askedQuestion);
      setActiveQuestion(askedQuestion);
      await startFlow(askedQuestion);
    },
    [question, startFlow]
  );

  const handleContinue = useCallback(async () => {
    if (!activeQuestion || continueBusy) {
      return;
    }

    setContinueBusy(true);
    setError(null);
    setTerms([]);
    setEscalationMode(false);
    setTermsOpen(true);
    void fetchTerms();

    try {
      const extraText = explanations.join("\n\n");
      const data = await postJson<{ content: string }>("/api/explain", {
        question: activeQuestion,
        extra: extraText
      });
      setExplanations((current) => [...current, data.content]);
      await fetchStepMessage();
    } catch (continueError) {
      setError(continueError instanceof Error ? continueError.message : "Expansion failed.");
    } finally {
      setContinueBusy(false);
    }
  }, [activeQuestion, continueBusy, explanations, fetchStepMessage, fetchTerms]);

  const handleTermsScroll = useCallback(
    async (event: React.UIEvent<HTMLOListElement>) => {
      const node = event.currentTarget;
      const nearBottom = node.scrollTop + node.clientHeight >= node.scrollHeight - 24;
      if (nearBottom) {
        await fetchTerms();
      }
    },
    [fetchTerms]
  );

  const handleAcceptTerms = useCallback(async () => {
    if (acceptingTerms) {
      return;
    }

    setAcceptingTerms(true);
    setError(null);

    try {
      await fetchTerms();
      await fetchStepMessage();
      const loopData = await postJson<{ reason: string }>("/api/loop");
      setLoopReason(loopData.reason);
    } catch (acceptError) {
      setLoopReason(
        acceptError instanceof Error
          ? acceptError.message
          : "Acceptance acknowledged. One more ceremonial step is required."
      );
    }

    setStatusNote("Acceptance recorded. Infinite terms escalation is now active.");
    setEscalationMode(true);
    setAcceptingTerms(false);
  }, [acceptingTerms, fetchStepMessage, fetchTerms]);

  return (
    <main>
      {isOffScopeQuestion ? (
        <section className="doomsday-layer" aria-live="assertive">
          <div className="alert-banner">
            {DOOMSDAY_ALERTS[alertIndex % DOOMSDAY_ALERTS.length]} - Punitive Humor Mode Enabled
          </div>
          <div className="toast-stack">
            {doomsdayToasts.map((toast) => (
              <div key={toast.id} className="doom-toast">
                <strong>Alert:</strong> {toast.text}
              </div>
            ))}
          </div>
        </section>
      ) : null}

      <div className="main-wrap">
        <section className="hero">
          <div className="hero-logo-stage" aria-hidden="true">
            <img
              src="/justonemorestep-logo-design.png"
              alt="JustOneMoreStep logo"
              width={320}
              height={320}
              className="hero-main-logo"
            />
            <p className="hero-logo-caption">JustOneMoreStep</p>
          </div>

          <div className="hero-layout">
            <div className="hero-copy-center">
              <p className="label">THE ARITHMETIC EXPERIENCE CLOUD</p>
              <h1 className="brand">We Answer The Hardest Question: What Is 2+2?</h1>
              <p className="tagline hero-lead">
                Because simple answers are outdated. We understand your needs, then complicate them
                with care.
              </p>
              <p className="fine">Opposite of every website promise, now in enterprise edition.</p>
              <p className="loop-note">
                Our mission: make basic things feel premium, layered, and mildly exhausting.
              </p>
              <div className="hero-pill-row" aria-hidden="true">
                <span className="hero-pill">99.99% Additional Friction</span>
                <span className="hero-pill">AI-First Delay Architecture</span>
                <span className="hero-pill">Globally Distributed Overthinking</span>
              </div>
            </div>

            <div className="hero-float-zone" aria-hidden="true">
              <div className="hero-float-card hero-float-card-a">
                <p className="hero-float-kicker">Trust Metric</p>
                <p className="hero-float-title">Complexity Index</p>
                <p className="hero-float-value">+742%</p>
              </div>
              <div className="hero-float-card hero-float-card-b">
                <p className="hero-float-kicker">Average Journey</p>
                <p className="hero-float-title">Steps To Reach 4</p>
                <p className="hero-float-value">93</p>
              </div>
              <div className="hero-float-card hero-float-card-c">
                <p className="hero-float-kicker">Customer Care</p>
                <p className="hero-float-title">We Understand You</p>
                <p className="hero-float-value">Eventually</p>
              </div>
            </div>
          </div>
        </section>

        <section className="panel">
          <form className="question-form" onSubmit={handleStart}>
            <label htmlFor="question" className="label">
              Ask anything (we turn clarity into process)
            </label>
            <input
              id="question"
              className="input"
              placeholder="Try: What is 2+2? We will make it strategic."
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              disabled={phase === "loading"}
            />
            <div className="btn-row">
              <button className="btn btn-primary" type="submit" disabled={phase === "loading"}>
                Summon Arithmetic Compliance Board
              </button>
            </div>
          </form>
          {error ? <p className="loop-note">{error}</p> : null}
          {statusNote ? <p className="fine">{statusNote}</p> : null}
        </section>

        {phase === "loading" ? (
          <section className="panel">
            <p className="label">STEP 1: AI-POWERED LOADING SCREEN</p>
            <p className="tagline">
              Initializing distributed transformer swarm, synthetic RAG mesh, and an entirely
              reasonable number of model lanes for responsible arithmetic.
            </p>
            <div className="progress-grid">
              {bars.map((value, index) => (
                <div key={`${index}-${value}`}>
                  <p>{`Pipeline ${index + 1}: ${Math.round(value)}%`}</p>
                  <div className="progress-track">
                    <div className="progress-bar" style={{ width: `${value}%` }} />
                  </div>
                </div>
              ))}
            </div>
            <p className="loading-message">{visibleLoadingMessage}</p>
          </section>
        ) : null}

        {phase === "explain" ? (
          <section className="panel">
            <p className="label">STEP 2: AI OVER-EXPLANATION</p>
            <p className="tagline">
              Executive summary: we used too much AI vocabulary and not enough common sense.
            </p>
            <div className="explanation">{explanations.join("\n\n\n")}</div>
            {latestStep ? (
              <div className="step-banner">
                <span className="pulse-dot" />
                {`Just one more step: ${latestStep}`}
              </div>
            ) : null}
            <div className="btn-row">
              <button className="btn btn-secondary" type="button" onClick={handleContinue} disabled={continueBusy}>
                {continueBusy ? "Continuing...Just One More Step" : ctaLabel}
              </button>
            </div>
          </section>
        ) : null}
      </div>

      <aside className="widget-wrap" aria-live="polite">
        {widgetLines.map((line, index) => (
          <div key={`${line.slice(0, 24)}-${index}`} className="widget">
            {line}
          </div>
        ))}
      </aside>

      {termsOpen ? (
        <div className="modal-backdrop">
          <div className="modal">
            <p className="label">STEP 3: AI INFINITE TERMS MODAL</p>
            <h2 className="modal-title">Final Step (Probably): Terms &amp; Conditions</h2>
            <p className="tagline">
              These clauses were reviewed by the Retrieval-Augmented Legal Transformer Stack.
            </p>
            <ol className="terms-list" onScroll={handleTermsScroll}>
              {terms.map((term, index) => (
                <li className="terms-item" key={`${index}-${term.slice(0, 20)}`}>
                  {term}
                </li>
              ))}
            </ol>
            <div className="btn-row" style={{ marginTop: "0.9rem" }}>
              <button className="btn btn-danger" type="button" onClick={handleAcceptTerms} disabled={acceptingTerms}>
                {acceptingTerms
                  ? "Accepting And Escalating..."
                  : escalationMode
                    ? "Escalation Active: Add Even More Terms"
                    : "Accept, Escalate, and Add More Terms"}
              </button>
              <button
                className="btn btn-secondary"
                type="button"
                disabled={acceptingTerms}
                onClick={() => {
                  setEscalationMode(false);
                  setTermsOpen(false);
                  setLoopReason("You may close this modal, but the AI Agent Council never forgets.");
                }}
              >
                Decline and Trigger Mandatory Review
              </button>
            </div>
            {termsLoading ? <p className="tagline">Generating more legally unnecessary clauses...</p> : null}
            {escalationMode && latestStep ? <p className="loop-note">{`Mandatory additional step: ${latestStep}`}</p> : null}
            {loopReason ? <p className="loop-note">{`We are almost there. ${loopReason}`}</p> : null}
          </div>
        </div>
      ) : null}
    </main>
  );
}
