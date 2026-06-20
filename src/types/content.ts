export type TopicStatus = "available" | "planned";

export type LabType =
  | "binary-search"
  | "selection-sort"
  | "recursion"
  | "partition"
  | "hash-table"
  | "bfs"
  | "dijkstra"
  | "greedy-cover";

export interface Topic {
  slug: string;
  title: string;
  eyebrow: string;
  description: string;
  status: TopicStatus;
  estimatedModules: number;
  accent: string;
  courseId?: string;
}

export interface Quiz {
  question: string;
  options: string[];
  answer: number;
  explanation: string;
}

export interface LabConfig {
  type: LabType;
  title: string;
  values?: number[];
  pivot?: number;
  keys?: string[];
  buckets?: number;
  start?: string;
  goal?: string;
  n?: number;
}

export interface Lesson {
  id: string;
  title: string;
  kicker: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  duration: string;
  cardSummary: string;
  summary: string;
  outcomes: string[];
  lab: LabConfig;
  quiz: Quiz;
}

export interface Course {
  id: string;
  topicSlug: string;
  title: string;
  subtitle: string;
  sourceNote: string;
  lessons: Lesson[];
}
