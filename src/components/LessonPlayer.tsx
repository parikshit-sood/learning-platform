import { useState } from "react";
import { LabRenderer } from "../labs/LabRenderer";
import type { Lesson } from "../types/content";

interface LessonPlayerProps {
  activeLesson: Lesson;
  completed: Set<string>;
  lessons: Lesson[];
  onComplete: (lessonId: string) => void;
  onSelectLesson: (lessonId: string) => void;
}

export function LessonPlayer({
  activeLesson,
  completed,
  lessons,
  onComplete,
  onSelectLesson,
}: LessonPlayerProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const isComplete = completed.has(activeLesson.id);

  function answerQuiz(answerIndex: number) {
    setSelectedAnswer(answerIndex);

    if (answerIndex === activeLesson.quiz.answer) {
      onComplete(activeLesson.id);
      burst();
    }
  }

  return (
    <section className="lesson-shell" id="lesson-player" aria-live="polite">
      <aside className="lesson-sidebar" aria-label="Lesson modules">
        <p className="eyebrow">Mission log</p>
        <div className="lesson-tabs">
          {lessons.map((lesson) => (
            <button
              className={[
                "lesson-tab",
                lesson.id === activeLesson.id ? "active" : "",
                completed.has(lesson.id) ? "complete" : "",
              ]
                .filter(Boolean)
                .join(" ")}
              key={lesson.id}
              onClick={() => {
                setSelectedAnswer(null);
                onSelectLesson(lesson.id);
              }}
              type="button"
            >
              {lesson.title}
            </button>
          ))}
        </div>
      </aside>

      <article className="lesson-card">
        <div className="lesson-header">
          <div>
            <p className="eyebrow">{activeLesson.kicker}</p>
            <h2>{activeLesson.title}</h2>
            <p>{activeLesson.summary}</p>
          </div>
          <span className="difficulty-pill">
            {activeLesson.level} · {activeLesson.duration}
          </span>
        </div>

        <div className="mission-signal">
          {isComplete
            ? "Mission stable. Replay the lab or jump to another concept node."
            : "Mission unstable. Complete the lab, then clear the boss gate to lock the signal."}
        </div>

        <div className="outcomes">
          {activeLesson.outcomes.map((outcome) => (
            <div className="outcome-card" key={outcome}>
              {outcome}
            </div>
          ))}
        </div>

        <LabRenderer key={activeLesson.id} config={activeLesson.lab} />

        <div className="quiz-panel">
          <div>
            <p className="eyebrow">Boss gate</p>
            <h3>{activeLesson.quiz.question}</h3>
          </div>
          <div className="quiz-options">
            {activeLesson.quiz.options.map((option, index) => {
              const answered = selectedAnswer !== null || isComplete;
              const correct = index === activeLesson.quiz.answer;
              const selectedWrong = selectedAnswer === index && !correct;

              return (
                <button
                  className={[
                    "choice-button",
                    answered && correct ? "correct" : "",
                    selectedWrong ? "incorrect" : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  disabled={answered}
                  key={option}
                  onClick={() => answerQuiz(index)}
                  type="button"
                >
                  {option}
                </button>
              );
            })}
          </div>
          <p className="feedback" role="status">
            {selectedAnswer === null && !isComplete
              ? ""
              : selectedAnswer === activeLesson.quiz.answer || isComplete
                ? activeLesson.quiz.explanation
                : "Close, but not quite. The highlighted answer shows the key idea."}
          </p>
        </div>
      </article>
    </section>
  );
}

function burst() {
  Array.from({ length: 18 }, (_, index) => {
    const spark = document.createElement("span");
    const angle = (Math.PI * 2 * index) / 18;
    const distance = 65 + Math.random() * 54;
    spark.className = "spark";
    spark.style.left = "50vw";
    spark.style.top = "50vh";
    spark.style.setProperty("--tx", `${Math.cos(angle) * distance}px`);
    spark.style.setProperty("--ty", `${Math.sin(angle) * distance}px`);
    document.body.append(spark);
    spark.addEventListener("animationend", () => spark.remove(), { once: true });
    return spark;
  });
}
