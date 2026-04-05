import Link from "next/link";

export default function AboutPage() {
  return (
    <main>
      <div className="main-wrap about-wrap">
        <section className="hero about-hero">
          <p className="label">ABOUT JUSTONEMORESTEP</p>
          <h1 className="brand">A Bold Vision For Making Simple Things Heroic</h1>
          <p className="tagline about-lead">
            We asked one dangerous question: what if "2+2" deserved the same treatment as a global,
            mission-critical digital transformation strategy? The result is a platform that lovingly
            overthinks everything.
          </p>
          <p className="fine">
            We dislike oversmartness. We prefer disciplined curiosity inside clearly labeled fences.
          </p>
          <p className="loop-note">
            Ask what we dictate and you get polished chaos. Ask anything else and you unlock
            theatrical consequences.
          </p>
          <div className="hero-pill-row" aria-hidden="true">
            <span className="hero-pill">Human-ish</span>
            <span className="hero-pill">AI-Dependent</span>
            <span className="hero-pill">Mildly Inspirational</span>
          </div>
        </section>

        <section className="panel about-grid">
          <article className="about-card">
            <p className="label">OUR GREATNESS</p>
            <h2>We Turn Arithmetic Into A Lifestyle</h2>
            <p>
              Other apps give answers. We deliver a journey. We believe true innovation is adding at
              least nine extra steps between you and obvious information.
            </p>
          </article>

          <article className="about-card">
            <p className="label">OUR INTENT</p>
            <h2>We Understand Your AI Dependency</h2>
            <p>
              Why trust your own brain when you can assemble a cinematic network of retrieval layers,
              transformers, and confidence rituals to verify what your calculator already knows?
            </p>
          </article>

          <article className="about-card">
            <p className="label">OUR PROMISE</p>
            <h2>Complexity, But Inspirational</h2>
            <p>
              We promise to keep things premium, dramatic, and deeply unnecessary. Because in this era,
              if it was easy, was it even enterprise?
            </p>
          </article>
        </section>

        <section className="panel about-manifesto">
          <p className="label">THE MANIFESTO</p>
          <p>
            We are not here to replace human intelligence. We are here to gently delay it while a
            magnificent AI orchestra warms up. JustOneMoreStep celebrates the modern condition:
            over-automation, over-explanation, and overconfidence, all wrapped in good humor.
          </p>
          <p>
            If this page made you feel seen, mildly attacked, and weirdly motivated, our mission is
            complete.
          </p>
          <p className="label" style={{ marginTop: "0.9rem" }}>
            MEET THE TEAM
          </p>
          <p>
            Our impressive global team currently consists of 1 person, 17 browser tabs, and one
            determined coffee mug. We call this a lean, AI-native operating model.
          </p>
          <div className="btn-row">
            <Link href="/services" className="btn btn-secondary">
              Explore Upcoming Services
            </Link>
            <Link href="/" className="btn btn-primary">
              Return To The Main Experience
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
