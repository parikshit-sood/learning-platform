import type { Course, Topic } from "../types/content";
import { algorithmsCourse } from "./courses/algorithms";

export const topics: Topic[] = [
  {
    slug: "algorithms",
    title: "Algorithms",
    eyebrow: "Available now",
    description:
      "Search, sorting, recursion, hash tables, graph traversal, shortest paths, and greedy strategies.",
    status: "available",
    estimatedModules: algorithmsCourse.lessons.length,
    accent: "#61f7ff",
    courseId: algorithmsCourse.id,
  },
  {
    slug: "distributed-systems",
    title: "Distributed Systems",
    eyebrow: "Planned",
    description:
      "Consensus, replication, partitions, clocks, leader election, fault tolerance, and coordination.",
    status: "planned",
    estimatedModules: 10,
    accent: "#ffd166",
  },
  {
    slug: "data-intensive-apps",
    title: "Data-Intensive Applications",
    eyebrow: "Planned",
    description:
      "Storage engines, indexes, streams, batch processing, transactions, consistency, and scale.",
    status: "planned",
    estimatedModules: 12,
    accent: "#7cffc7",
  },
  {
    slug: "system-design",
    title: "System Design",
    eyebrow: "Planned",
    description:
      "Capacity planning, APIs, caching, queues, databases, observability, and tradeoff thinking.",
    status: "planned",
    estimatedModules: 9,
    accent: "#ff5ca8",
  },
  {
    slug: "machine-learning-systems",
    title: "ML Systems",
    eyebrow: "Planned",
    description:
      "Training pipelines, evaluation, serving, embeddings, retrieval, monitoring, and model operations.",
    status: "planned",
    estimatedModules: 8,
    accent: "#a783ff",
  },
];

export const courses: Course[] = [algorithmsCourse];

export function getTopic(slug: string): Topic | undefined {
  return topics.find((topic) => topic.slug === slug);
}

export function getCourseForTopic(slug: string): Course | undefined {
  return courses.find((course) => course.topicSlug === slug);
}
