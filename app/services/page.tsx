import Link from "next/link";

const UPCOMING = [
  {
    name: "0+0 Precision Suite",
    note: "For users who demand certainty at the speed of unnecessary compliance."
  },
  {
    name: "1+1 Enterprise Edition",
    note: "Includes premium dashboards, confidence councils, and ceremonial loading bars."
  },
  {
    name: "3-1 Executive Advisory",
    note: "A strategic subtraction journey, delivered with quarterly optimism."
  }
];

export default function ServicesPage() {
  return (
    <main>
      <div className="main-wrap about-wrap">
        <section className="hero about-hero">
          <p className="label">UPCOMING SERVICES</p>
          <h1 className="brand">Soon We Will Answer Even More Dangerous Questions</h1>
          <p className="tagline about-lead">
            Today we heroically specialize in 2+2. Tomorrow, with proper venture funding, we will
            scale into bold new frontiers like 0+0 and 1+1.
          </p>
          <p className="fine">
            We are currently accepting encouragement, investor decks, and emotionally supportive term
            sheets.
          </p>
        </section>

        <section className="panel about-grid">
          {UPCOMING.map((service) => (
            <article className="about-card" key={service.name}>
              <p className="label">COMING SOON</p>
              <h2>{service.name}</h2>
              <p>{service.note}</p>
            </article>
          ))}
        </section>

        <section className="panel about-manifesto">
          <p className="label">ROLLOUT PLAN</p>
          <p>
            Phase 1: secure $1 trillion in venture funding before lunch.
            Phase 2: hire two more whiteboards.
            Phase 3: announce a roadmap full of words like "synergy", "agentic", and "velocity".
          </p>
          <p>
            Long-term ambition: venture-fund Elon Musk, then politely teach him how to scale 2+2.
            The moment funding lands, we will proudly overcomplicate arithmetic at global scale.
          </p>
          <div className="btn-row">
            <Link href="/about" className="btn btn-secondary">
              Meet Our Team Of 1
            </Link>
            <Link href="/" className="btn btn-primary">
              Back To JustOneMoreStep
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
