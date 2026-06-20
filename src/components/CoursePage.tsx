import { useMemo, useState, type CSSProperties } from "react";
import { AppChrome } from "./AppChrome";
import { LessonPlayer } from "./LessonPlayer";
import type { Course, Lesson, Topic } from "../types/content";

type ProgressStyle = CSSProperties & { "--progress": string };
type GalaxyNodeStyle = CSSProperties & { "--x": string; "--y": string };

interface CoursePageProps {
  course: Course;
  topic: Topic;
}

function getProgressKey(courseId: string) {
  return `knowledge-galaxy:${courseId}:completed`;
}

function readCompleted(courseId: string) {
  try {
    return new Set<string>(JSON.parse(localStorage.getItem(getProgressKey(courseId)) || "[]"));
  } catch {
    return new Set<string>();
  }
}

export function CoursePage({ course, topic }: CoursePageProps) {
  const [activeLessonId, setActiveLessonId] = useState(course.lessons[0]?.id);
  const [completed, setCompleted] = useState<Set<string>>(() => readCompleted(course.id));
  const activeLesson = useMemo<Lesson>(
    () => course.lessons.find((lesson) => lesson.id === activeLessonId) ?? course.lessons[0],
    [activeLessonId, course.lessons],
  );
  const percent = Math.round((completed.size / course.lessons.length) * 100);

  function markComplete(lessonId: string) {
    setCompleted((current) => {
      const next = new Set(current);
      next.add(lessonId);
      localStorage.setItem(getProgressKey(course.id), JSON.stringify([...next]));
      return next;
    });
  }

  function resetProgress() {
    localStorage.removeItem(getProgressKey(course.id));
    setCompleted(new Set());
  }

  return (
    <AppChrome
      actions={
        <>
          <a className="ghost-button" href="#/">
            All topics
          </a>
          <button className="ghost-button" onClick={resetProgress} type="button">
            Reset progress
          </button>
        </>
      }
    >
      <main>
        <section className="course-hero">
          <div>
            <p className="eyebrow">{topic.title}</p>
            <h1>{course.title}</h1>
            <p className="hero-copy">{course.subtitle}</p>
            <p className="source-note">{course.sourceNote}</p>
          </div>
          <aside className="mission-hud">
            <div className="progress-ring" style={{ "--progress": `${percent}%` } as ProgressStyle}>
              <span>{percent}%</span>
            </div>
            <p className="eyebrow">Course signal</p>
            <h2>{completed.size} cleared</h2>
            <p>{course.lessons.length - completed.size} missions remain.</p>
          </aside>
        </section>

        <section className="galaxy-board" aria-label={`${course.title} missions`}>
          <div className="galaxy-core" aria-hidden="true">
            <span>{topic.title.slice(0, 3).toUpperCase()}</span>
          </div>
          <div className="orbit-ring ring-one" aria-hidden="true" />
          <div className="orbit-ring ring-two" aria-hidden="true" />
          <div className="orbit-ring ring-three" aria-hidden="true" />
          <div className="module-grid">
            {course.lessons.map((lesson, index) => (
              <button
                className={[
                  "module-card",
                  lesson.id === activeLesson.id ? "active" : "",
                  completed.has(lesson.id) ? "complete" : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
                key={lesson.id}
                onClick={() => {
                  setActiveLessonId(lesson.id);
                  document.querySelector("#lesson-player")?.scrollIntoView({ behavior: "smooth" });
                }}
                style={getNodeStyle(index)}
                type="button"
              >
                <span className="module-index">
                  {String(index + 1).padStart(2, "0")} / {lesson.level}
                </span>
                <h3>{lesson.title}</h3>
                <p>{lesson.cardSummary}</p>
                <span className="status">
                  {completed.has(lesson.id) ? "Signal locked ✦" : `${lesson.duration} mission`}
                </span>
              </button>
            ))}
          </div>
        </section>

        <LessonPlayer
          activeLesson={activeLesson}
          completed={completed}
          lessons={course.lessons}
          onComplete={markComplete}
          onSelectLesson={setActiveLessonId}
        />
      </main>
    </AppChrome>
  );
}

function getNodeStyle(index: number): GalaxyNodeStyle {
  const positions = [
    ["50%", "17%"],
    ["70%", "29%"],
    ["79%", "53%"],
    ["65%", "75%"],
    ["39%", "80%"],
    ["21%", "59%"],
    ["28%", "32%"],
    ["50%", "50%"],
  ];
  const [x, y] = positions[index] ?? ["50%", "50%"];
  return { "--x": x, "--y": y };
}
