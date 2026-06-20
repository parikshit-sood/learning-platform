import { useEffect, useState } from "react";
import { CoursePage } from "./components/CoursePage";
import { LandingPage } from "./components/LandingPage";
import { getCourseForTopic, getTopic } from "./data/topics";

type Route =
  | { name: "home" }
  | { name: "topic"; slug: string };

function parseRoute(): Route {
  const hash = window.location.hash.replace(/^#/, "");
  const match = hash.match(/^\/topics\/([^/]+)$/);

  if (match) {
    return { name: "topic", slug: match[1] };
  }

  return { name: "home" };
}

export function App() {
  const [route, setRoute] = useState<Route>(() => parseRoute());

  useEffect(() => {
    const handleHashChange = () => setRoute(parseRoute());
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  if (route.name === "topic") {
    const topic = getTopic(route.slug);
    const course = getCourseForTopic(route.slug);

    if (topic && course) {
      return <CoursePage course={course} topic={topic} />;
    }

    return <LandingPage missingTopicSlug={route.slug} />;
  }

  return <LandingPage />;
}
