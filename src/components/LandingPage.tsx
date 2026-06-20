import type { CSSProperties } from "react";
import { AppChrome } from "./AppChrome";
import { topics } from "../data/topics";

interface LandingPageProps {
  missingTopicSlug?: string;
}

export function LandingPage({ missingTopicSlug }: LandingPageProps) {
  return (
    <AppChrome actions={<span className="source-note">Build your personal learning universe</span>}>
      <main>
        <section className="landing-hero">
          <div>
            <p className="eyebrow">Interactive knowledge platform</p>
            <h1>Pick a topic. Learn through missions, labs, and boss gates.</h1>
            <p className="hero-copy">
              This platform is designed to grow across many domains: algorithms today, distributed
              systems and data-intensive applications next.
            </p>
          </div>
          <aside className="mission-hud">
            <p className="eyebrow">Platform map</p>
            <h2>{topics.length} topics</h2>
            <p>Each topic can ship as a course with reusable lessons, labs, quizzes, and progress.</p>
          </aside>
        </section>

        {missingTopicSlug ? (
          <div className="notice-card" role="status">
            Topic <strong>{missingTopicSlug}</strong> is not available yet. Choose one below.
          </div>
        ) : null}

        <section className="topic-section" aria-labelledby="topic-title">
          <div className="section-heading">
            <p className="eyebrow">Choose a topic</p>
            <h2 id="topic-title">Learning constellations</h2>
            <p>
              Available topics open into interactive courses. Planned topics are visible so the
              platform roadmap feels tangible rather than hidden in a backlog cave.
            </p>
          </div>

          <div className="topic-grid">
            {topics.map((topic) => (
              <a
                className={`topic-card ${topic.status}`}
                href={topic.status === "available" ? `#/topics/${topic.slug}` : "#/"}
                key={topic.slug}
                style={{ "--topic-accent": topic.accent } as CSSProperties}
                aria-disabled={topic.status === "planned"}
              >
                <span className="topic-status">{topic.eyebrow}</span>
                <h3>{topic.title}</h3>
                <p>{topic.description}</p>
                <span className="status">
                  {topic.status === "available"
                    ? `${topic.estimatedModules} modules · Start`
                    : `${topic.estimatedModules} modules · Coming soon`}
                </span>
              </a>
            ))}
          </div>
        </section>
      </main>
    </AppChrome>
  );
}
