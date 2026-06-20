import { modules } from "./content.js";

const state = {
  activeId: modules[0].id,
  completed: new Set(JSON.parse(localStorage.getItem("algorithm-studio-progress") || "[]")),
  activityStep: 0,
};

const galaxyPositions = [
  ["50%", "17%"],
  ["70%", "29%"],
  ["79%", "53%"],
  ["65%", "75%"],
  ["39%", "80%"],
  ["21%", "59%"],
  ["28%", "32%"],
  ["50%", "50%"],
];

const activityData = {
  binaryTarget: 47,
  graph: {
    You: ["Ari", "Bea", "Cam"],
    Ari: ["Dee", "Ezra"],
    Bea: ["Finn"],
    Cam: ["Gia", "Maya"],
    Dee: [],
    Ezra: ["Maya"],
    Finn: [],
    Gia: [],
    Maya: [],
  },
  weightedGraph: {
    A: { B: 4, C: 2 },
    B: { D: 5, E: 10 },
    C: { B: 1, E: 3 },
    D: { F: 2 },
    E: { D: 4, F: 6 },
    F: {},
  },
  stations: [
    { name: "North", covers: ["Design", "Data", "Web"] },
    { name: "River", covers: ["AI", "Security", "Data"] },
    { name: "Market", covers: ["Mobile", "Web"] },
    { name: "Harbor", covers: ["AI", "Systems", "Security"] },
    { name: "Garden", covers: ["Systems", "Mobile"] },
  ],
};

const dom = {
  moduleGrid: document.querySelector("#module-grid"),
  lessonTabs: document.querySelector("#lesson-tabs"),
  lessonKicker: document.querySelector("#lesson-kicker"),
  lessonTitle: document.querySelector("#lesson-title"),
  lessonSummary: document.querySelector("#lesson-summary"),
  lessonMeta: document.querySelector("#lesson-meta"),
  lessonOutcomes: document.querySelector("#lesson-outcomes"),
  activityTitle: document.querySelector("#activity-title"),
  activityRoot: document.querySelector("#activity-root"),
  activityReset: document.querySelector("#activity-reset"),
  quizQuestion: document.querySelector("#quiz-question"),
  quizOptions: document.querySelector("#quiz-options"),
  quizFeedback: document.querySelector("#quiz-feedback"),
  progressPercent: document.querySelector("#progress-percent"),
  progressRing: document.querySelector(".progress-ring"),
  progressSummary: document.querySelector("#progress-summary"),
  missionCount: document.querySelector("#mission-count"),
  xpCount: document.querySelector("#xp-count"),
  missionSignal: document.querySelector("#mission-signal"),
  resetProgress: document.querySelector("#reset-progress"),
};

function saveProgress() {
  localStorage.setItem("algorithm-studio-progress", JSON.stringify([...state.completed]));
}

function activeModule() {
  return modules.find((module) => module.id === state.activeId) || modules[0];
}

function setActiveModule(id) {
  state.activeId = id;
  state.activityStep = 0;
  render();
  document.querySelector("#lesson-player").scrollIntoView({ behavior: "smooth", block: "start" });
}

function markComplete(moduleId) {
  state.completed.add(moduleId);
  saveProgress();
  renderProgress();
  renderNavigation();
}

function renderProgress() {
  const percent = Math.round((state.completed.size / modules.length) * 100);
  dom.progressPercent.textContent = `${percent}%`;
  dom.progressRing.style.setProperty("--progress", `${percent}%`);
  dom.missionCount.textContent = state.completed.size;
  dom.xpCount.textContent = state.completed.size * 125;
  dom.progressSummary.textContent =
    percent === 100
      ? "All missions cleared. The galaxy is humming."
      : `${modules.length - state.completed.size} signal locks remain before full stabilization.`;
}

function renderNavigation() {
  dom.moduleGrid.innerHTML = modules
    .map((module, index) => {
      const [x, y] = galaxyPositions[index] || ["50%", "50%"];
      const classes = [
        "module-card",
        module.id === state.activeId ? "active" : "",
        state.completed.has(module.id) ? "complete" : "",
      ]
        .filter(Boolean)
        .join(" ");

      return `
        <button class="${classes}" style="--x:${x}; --y:${y}" data-module="${module.id}" type="button">
          <span class="module-index">${String(index + 1).padStart(2, "0")} / ${module.level}</span>
          <h3>${module.title}</h3>
          <p>${module.cardSummary}</p>
          <span class="status">${state.completed.has(module.id) ? "Signal locked ✦" : `${module.duration} mission`}</span>
        </button>
      `;
    })
    .join("");

  dom.lessonTabs.innerHTML = modules
    .map(
      (module) => `
        <button class="lesson-tab ${module.id === state.activeId ? "active" : ""} ${state.completed.has(module.id) ? "complete" : ""}" data-module="${module.id}" type="button">
          ${module.title}
        </button>
      `,
    )
    .join("");
}

function renderLesson() {
  const module = activeModule();
  const moduleIndex = modules.findIndex((item) => item.id === module.id) + 1;
  dom.lessonKicker.textContent = module.kicker;
  dom.lessonTitle.textContent = module.title;
  dom.lessonSummary.textContent = module.summary;
  dom.lessonMeta.textContent = `${module.level} · ${module.duration}`;
  dom.missionSignal.textContent = state.completed.has(module.id)
    ? `Mission ${moduleIndex} is stable. Replay the lab or jump to another node in the galaxy.`
    : `Mission ${moduleIndex} unstable: complete the lab, then clear the boss gate to lock this signal.`;
  dom.lessonOutcomes.innerHTML = module.outcomes
    .map((outcome) => `<div class="outcome-card">${outcome}</div>`)
    .join("");
  dom.activityTitle.textContent = module.activity.title;
  renderActivity(module);
  renderQuiz(module);
}

function renderQuiz(module) {
  dom.quizQuestion.textContent = module.quiz.question;
  dom.quizFeedback.textContent = "";
  dom.quizOptions.innerHTML = module.quiz.options
    .map(
      (option, index) => `
        <button class="choice-button" data-choice="${index}" type="button">${option}</button>
      `,
    )
    .join("");
}

function renderActivity(module) {
  const renderers = {
    "binary-search": renderBinarySearch,
    "selection-sort": renderSelectionSort,
    recursion: renderRecursion,
    partition: renderPartition,
    "hash-table": renderHashTable,
    bfs: renderBfs,
    dijkstra: renderDijkstra,
    "greedy-cover": renderGreedyCover,
  };

  const renderer = renderers[module.activity.type];
  dom.activityRoot.innerHTML = renderer ? renderer(module.activity) : `<p>No activity available yet.</p>`;
}

function renderLabGuide({ objective, action, insight, step, total, complete = false }) {
  const progress = total > 0 ? Math.round((step / total) * 100) : 0;

  return `
    <div class="lab-guide ${complete ? "complete" : ""}">
      <div class="lab-guide-copy">
        <span class="lab-label">${complete ? "Lab complete" : "Your task"}</span>
        <strong>${complete ? "Signal captured. Answer the boss gate below." : objective}</strong>
        <p>${complete ? insight : action}</p>
      </div>
      <div class="lab-progress" aria-label="Lab progress">
        <span style="width:${progress}%"></span>
      </div>
      <span class="mini-pill">${step}/${total} steps</span>
    </div>
  `;
}

function renderBinarySearch() {
  const lowStart = 1;
  const highStart = 64;
  let low = lowStart;
  let high = highStart;
  const steps = [];

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    steps.push({ low, high, mid });
    if (mid === activityData.binaryTarget) break;
    if (mid < activityData.binaryTarget) low = mid + 1;
    else high = mid - 1;
  }

  const step = steps[Math.min(state.activityStep, steps.length - 1)];
  const found = step.mid === activityData.binaryTarget;
  const guide = renderLabGuide({
    objective: `Find the hidden target ${activityData.binaryTarget} without checking every number.`,
    action: `Look at the cyan midpoint ${step.mid}. Click “Compare midpoint” to discard half the range.`,
    insight: `Binary search found ${activityData.binaryTarget} by repeatedly halving the possible range.`,
    step: Math.min(state.activityStep, steps.length - 1),
    total: steps.length - 1,
    complete: found,
  });
  const cells = Array.from({ length: highStart }, (_, index) => {
    const value = index + 1;
    const classes = [
      "num-cell",
      value < step.low || value > step.high ? "out" : "",
      value === step.mid ? "mid" : "",
      found && value === activityData.binaryTarget ? "target" : "",
    ]
      .filter(Boolean)
      .join(" ");
    return `<span class="${classes}">${value}</span>`;
  }).join("");

  return `
    ${guide}
    <p>${found ? `Found ${activityData.binaryTarget} in ${state.activityStep + 1} guesses.` : `Guess ${state.activityStep + 1}: check the midpoint ${step.mid}.`}</p>
    <div class="number-line" aria-label="Numbers 1 to 64">${cells}</div>
    <div class="sim-controls">
      <button class="primary-button" data-action="activity-next" type="button" ${found ? "disabled" : ""}>Compare midpoint</button>
      <span class="mini-pill">Remaining range: ${step.low}–${step.high}</span>
    </div>
  `;
}

function selectionSortSnapshots(values) {
  const array = [...values];
  const snapshots = [{ array: [...array], active: [], sorted: [] }];

  for (let left = 0; left < array.length; left += 1) {
    let smallest = left;
    for (let index = left + 1; index < array.length; index += 1) {
      if (array[index] < array[smallest]) smallest = index;
    }
    [array[left], array[smallest]] = [array[smallest], array[left]];
    snapshots.push({
      array: [...array],
      active: [left, smallest],
      sorted: Array.from({ length: left + 1 }, (_, index) => index),
    });
  }

  return snapshots;
}

function renderSelectionSort(activity) {
  const snapshots = selectionSortSnapshots(activity.values);
  const step = snapshots[Math.min(state.activityStep, snapshots.length - 1)];
  const currentPass = Math.min(state.activityStep, snapshots.length - 1);
  const complete = currentPass >= snapshots.length - 1;
  const guide = renderLabGuide({
    objective: "Sort the bars by repeatedly finding the smallest unsorted value.",
    action: "Click “Run selection pass” to move the next smallest value into the gold sorted zone.",
    insight: "Selection sort is complete: every pass locked one more item into sorted order.",
    step: currentPass,
    total: snapshots.length - 1,
    complete,
  });
  const bars = step.array
    .map((value, index) => {
      const classes = [
        "bar",
        step.active.includes(index) ? "active" : "",
        step.sorted.includes(index) ? "sorted" : "",
      ]
        .filter(Boolean)
        .join(" ");
      return `<div class="${classes}"><span style="height:${value * 11}px"></span>${value}</div>`;
    })
    .join("");

  return `
    ${guide}
    <p>Each click selects the next smallest value and grows the sorted prefix.</p>
    <div class="bars">${bars}</div>
    <div class="sim-controls">
      <button class="primary-button" data-action="activity-next" type="button" ${complete ? "disabled" : ""}>Run selection pass</button>
      <span class="mini-pill">Pass ${currentPass} of ${snapshots.length - 1}</span>
    </div>
  `;
}

function renderRecursion(activity) {
  const maxStep = activity.n * 2;
  const step = Math.min(state.activityStep, maxStep);
  const descending = step <= activity.n;
  const complete = step >= maxStep;
  const guide = renderLabGuide({
    objective: "Follow factorial calls as they stack up, hit a base case, then unwind.",
    action: descending
      ? "Click “Advance call stack” to add the next smaller recursive call."
      : "Click “Advance call stack” to watch waiting calls return in reverse order.",
    insight: "The recursion finished because it reached a base case, then returned through the stack.",
    step,
    total: maxStep,
    complete,
  });
  const rows = [];

  if (descending) {
    for (let n = activity.n; n >= activity.n - step; n -= 1) {
      if (n > 0) rows.push({ label: `factorial(${n})`, status: n === 1 ? "base case soon" : "waiting" });
    }
  } else {
    const unwound = step - activity.n;
    for (let n = unwound + 1; n <= activity.n; n += 1) {
      rows.push({ label: `return from factorial(${n})`, status: n === activity.n ? "final answer" : "unwinding" });
    }
  }

  const stack = rows
    .map((row) => `<div class="stack-row"><strong>${row.label}</strong><span>${row.status}</span></div>`)
    .join("");

  return `
    ${guide}
    <p>${descending ? "Calls are stacking up until the base case is reached." : "Now the calls return in reverse order."}</p>
    <div class="activity-card">${stack || "<p>Ready to climb the call stack.</p>"}</div>
    <div class="sim-controls">
      <button class="primary-button" data-action="activity-next" type="button" ${complete ? "disabled" : ""}>Advance call stack</button>
      <span class="mini-pill">factorial(${activity.n})</span>
    </div>
  `;
}

function renderPartition(activity) {
  const left = activity.values.filter((value) => value < activity.pivot);
  const right = activity.values.filter((value) => value > activity.pivot);
  const step = Math.min(state.activityStep, activity.values.length);
  const seen = activity.values.slice(0, step);
  const nextValue = activity.values[step];
  const complete = step >= activity.values.length;
  const guide = renderLabGuide({
    objective: `Partition every value around pivot ${activity.pivot}.`,
    action:
      nextValue === undefined
        ? "All values are classified."
        : `Next, classify ${nextValue}: click “Classify value” to send it left or right of the pivot.`,
    insight: "Partitioning created smaller left and right problems for quicksort to handle recursively.",
    step,
    total: activity.values.length,
    complete,
  });

  return `
    ${guide}
    <p>Classify each value around pivot <strong>${activity.pivot}</strong>. Smaller goes left, larger goes right.</p>
    <div class="activity-grid">
      <div class="activity-card"><strong>Seen</strong><p>${seen.join(", ") || "None yet"}</p></div>
      <div class="activity-card"><strong>Left of pivot</strong><p>${left.filter((value) => seen.includes(value)).join(", ") || "Waiting"}</p></div>
      <div class="activity-card"><strong>Pivot</strong><p>${activity.pivot}</p></div>
      <div class="activity-card"><strong>Right of pivot</strong><p>${right.filter((value) => seen.includes(value)).join(", ") || "Waiting"}</p></div>
    </div>
    <div class="sim-controls">
      <button class="primary-button" data-action="activity-next" type="button" ${complete ? "disabled" : ""}>Classify value</button>
      <span class="mini-pill">${step}/${activity.values.length} values classified</span>
    </div>
  `;
}

function hashFor(key, buckets) {
  return [...key].reduce((sum, character) => sum + character.charCodeAt(0), 0) % buckets;
}

function renderHashTable(activity) {
  const shownKeys = activity.keys.slice(0, Math.min(state.activityStep, activity.keys.length));
  const buckets = Array.from({ length: activity.buckets }, () => []);
  shownKeys.forEach((key) => buckets[hashFor(key, activity.buckets)].push(key));
  const nextKey = activity.keys[shownKeys.length];
  const complete = shownKeys.length >= activity.keys.length;
  const guide = renderLabGuide({
    objective: "Drop each name into a hash bucket and watch for collisions.",
    action:
      nextKey === undefined
        ? "All keys have been placed."
        : `Next key is ${nextKey}. Click “Hash next key” to compute its bucket.`,
    insight: "The table is loaded. Any bucket with multiple names shows a collision.",
    step: shownKeys.length,
    total: activity.keys.length,
    complete,
  });

  const bucketRows = buckets
    .map(
      (bucket, index) => `
        <div class="bucket-row">
          <strong>Bucket ${index}</strong>
          <span>${bucket.join(" → ") || "empty"}</span>
        </div>
      `,
    )
    .join("");

  return `
    ${guide}
    <p>Names are converted to bucket numbers. When multiple names land together, that is a collision.</p>
    <div class="activity-card">${bucketRows}</div>
    <div class="sim-controls">
      <button class="primary-button" data-action="activity-next" type="button" ${complete ? "disabled" : ""}>Hash next key</button>
      <span class="mini-pill">${shownKeys.length}/${activity.keys.length} keys placed</span>
    </div>
  `;
}

function bfsSnapshots(start, goal) {
  const queue = [start];
  const visited = new Set([start]);
  const parent = {};
  const snapshots = [];

  while (queue.length > 0) {
    const current = queue.shift();
    snapshots.push({ current, queue: [...queue], visited: [...visited], parent: { ...parent } });
    if (current === goal) break;
    for (const neighbor of activityData.graph[current]) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        parent[neighbor] = current;
        queue.push(neighbor);
      }
    }
  }

  return snapshots;
}

function buildPath(parent, start, goal) {
  const path = [goal];
  while (path[0] !== start && parent[path[0]]) path.unshift(parent[path[0]]);
  return path[0] === start ? path : [];
}

function renderBfs(activity) {
  const snapshots = bfsSnapshots(activity.start, activity.goal);
  const step = snapshots[Math.min(state.activityStep, snapshots.length - 1)];
  const path = step.current === activity.goal ? buildPath(step.parent, activity.start, activity.goal) : [];
  const complete = path.length > 0;
  const guide = renderLabGuide({
    objective: `Find ${activity.goal} using the fewest friend hops from ${activity.start}.`,
    action: `Click “Explore next layer” to visit the next queued node. The queue keeps closer nodes first.`,
    insight: `BFS found the shortest unweighted path: ${path.join(" → ")}.`,
    step: Math.min(state.activityStep, snapshots.length - 1),
    total: snapshots.length - 1,
    complete,
  });
  const nodes = Object.keys(activityData.graph)
    .map((node) => {
      const classes = [
        "node",
        node === step.current ? "active" : "",
        step.visited.includes(node) ? "done" : "",
      ]
        .filter(Boolean)
        .join(" ");
      return `<span class="${classes}">${node}</span>`;
    })
    .join("");

  return `
    ${guide}
    <p>${path.length ? `Found path: ${path.join(" → ")}` : `Exploring ${step.current}. Queue next: ${step.queue.join(", ") || "empty"}.`}</p>
    <div class="graph-board">${nodes}</div>
    <div class="sim-controls">
      <button class="primary-button" data-action="activity-next" type="button" ${complete ? "disabled" : ""}>Explore next layer</button>
      <span class="mini-pill">Goal: ${activity.goal}</span>
    </div>
  `;
}

function dijkstraSnapshots(start) {
  const graph = activityData.weightedGraph;
  const distances = Object.fromEntries(Object.keys(graph).map((node) => [node, Infinity]));
  const previous = {};
  const visited = new Set();
  const snapshots = [];
  distances[start] = 0;

  while (visited.size < Object.keys(graph).length) {
    const current = Object.keys(distances)
      .filter((node) => !visited.has(node))
      .sort((a, b) => distances[a] - distances[b])[0];

    if (!current || distances[current] === Infinity) break;
    visited.add(current);

    for (const [neighbor, cost] of Object.entries(graph[current])) {
      const candidate = distances[current] + cost;
      if (candidate < distances[neighbor]) {
        distances[neighbor] = candidate;
        previous[neighbor] = current;
      }
    }

    snapshots.push({ current, distances: { ...distances }, previous: { ...previous }, visited: [...visited] });
  }

  return snapshots;
}

function renderDijkstra(activity) {
  const snapshots = dijkstraSnapshots(activity.start);
  const step = snapshots[Math.min(state.activityStep, snapshots.length - 1)];
  const path = step.visited.includes(activity.goal)
    ? buildPath(step.previous, activity.start, activity.goal)
    : [];
  const complete = path.length > 0;
  const guide = renderLabGuide({
    objective: `Find the cheapest weighted route from ${activity.start} to ${activity.goal}.`,
    action: `Click “Relax cheapest node” to lock the next lowest-cost node and improve its neighbors.`,
    insight: `Dijkstra found the cheapest route: ${path.join(" → ")} with cost ${step.distances[activity.goal]}.`,
    step: Math.min(state.activityStep, snapshots.length - 1),
    total: snapshots.length - 1,
    complete,
  });
  const rows = Object.entries(step.distances)
    .map(
      ([node, distance]) => `
        <div class="stat-row">
          <strong>${node}${node === step.current ? " ← current" : ""}</strong>
          <span>${distance === Infinity ? "∞" : distance}</span>
        </div>
      `,
    )
    .join("");

  return `
    ${guide}
    <p>${path.length ? `Cheapest route: ${path.join(" → ")} with cost ${step.distances[activity.goal]}.` : `Lock in ${step.current}, then relax its outgoing edges.`}</p>
    <div class="activity-card">${rows}</div>
    <div class="sim-controls">
      <button class="primary-button" data-action="activity-next" type="button" ${complete ? "disabled" : ""}>Relax cheapest node</button>
      <span class="mini-pill">Goal: ${activity.goal}</span>
    </div>
  `;
}

function renderGreedyCover() {
  const universe = ["Design", "Data", "Web", "AI", "Security", "Mobile", "Systems"];
  const chosen = [];
  const coveredForChoice = new Set();

  while (chosen.length < state.activityStep && coveredForChoice.size < universe.length) {
    const nextStation = activityData.stations
      .filter((station) => !chosen.includes(station))
      .sort(
        (stationA, stationB) =>
          stationB.covers.filter((topic) => !coveredForChoice.has(topic)).length -
          stationA.covers.filter((topic) => !coveredForChoice.has(topic)).length,
      )[0];

    if (!nextStation) break;
    chosen.push(nextStation);
    nextStation.covers.forEach((topic) => coveredForChoice.add(topic));
  }

  const covered = new Set(chosen.flatMap((station) => station.covers));
  const remainingTopics = universe.filter((topic) => !covered.has(topic));
  const complete = remainingTopics.length === 0;
  const nextStation = activityData.stations
    .filter((station) => !chosen.includes(station))
    .sort(
      (stationA, stationB) =>
        stationB.covers.filter((topic) => !covered.has(topic)).length -
        stationA.covers.filter((topic) => !covered.has(topic)).length,
    )[0];
  const guide = renderLabGuide({
    objective: "Cover every topic by choosing useful stations one at a time.",
    action: nextStation
      ? `Click “Choose best station” to pick ${nextStation.name}, the station covering the most uncovered topics right now.`
      : "All topics are covered.",
    insight: "The greedy strategy quickly covered every topic by making the best local choice available.",
    step: covered.size,
    total: universe.length,
    complete,
  });
  const chips = universe
    .map((topic) => `<span class="city-chip ${covered.has(topic) ? "covered" : ""}">${topic}</span>`)
    .join("");
  const sets = activityData.stations
    .map(
      (station) => `
        <div class="set-card ${chosen.includes(station) ? "active" : ""}">
          <strong>${station.name}</strong>
          <small>${station.covers.join(", ")}</small>
        </div>
      `,
    )
    .join("");

  return `
    ${guide}
    <p>Greedy set cover repeatedly picks a station that covers many still-uncovered topics.</p>
    <div class="cover-board">${chips}</div>
    <div class="cover-board">${sets}</div>
    <div class="sim-controls">
      <button class="primary-button" data-action="activity-next" type="button" ${complete ? "disabled" : ""}>Choose best station</button>
      <span class="mini-pill">${covered.size}/${universe.length} topics covered</span>
    </div>
  `;
}

function handleNavigation(event) {
  const button = event.target.closest("[data-module]");
  if (!button) return;
  setActiveModule(button.dataset.module);
}

function handleActivity(event) {
  if (!event.target.closest("[data-action='activity-next']")) return;
  state.activityStep += 1;
  renderActivity(activeModule());
}

function handleQuiz(event) {
  const button = event.target.closest("[data-choice]");
  if (!button) return;

  const module = activeModule();
  const choice = Number(button.dataset.choice);
  const buttons = [...dom.quizOptions.querySelectorAll(".choice-button")];
  buttons.forEach((optionButton) => {
    optionButton.disabled = true;
    if (Number(optionButton.dataset.choice) === module.quiz.answer) {
      optionButton.classList.add("correct");
    }
  });

  if (choice === module.quiz.answer) {
    dom.quizFeedback.textContent = module.quiz.explanation;
    burst(button);
    markComplete(module.id);
  } else {
    button.classList.add("incorrect");
    dom.quizFeedback.textContent = "Close, but not quite. The highlighted answer shows the key idea.";
  }
}

function burst(anchor) {
  const rect = anchor.getBoundingClientRect();
  const originX = rect.left + rect.width / 2;
  const originY = rect.top + rect.height / 2;

  Array.from({ length: 18 }, (_, index) => {
    const spark = document.createElement("span");
    const angle = (Math.PI * 2 * index) / 18;
    const distance = 55 + Math.random() * 46;
    spark.className = "spark";
    spark.style.left = `${originX}px`;
    spark.style.top = `${originY}px`;
    spark.style.setProperty("--tx", `${Math.cos(angle) * distance}px`);
    spark.style.setProperty("--ty", `${Math.sin(angle) * distance}px`);
    document.body.append(spark);
    spark.addEventListener("animationend", () => spark.remove(), { once: true });
    return spark;
  });
}

function resetActivity() {
  state.activityStep = 0;
  renderActivity(activeModule());
}

function resetProgress() {
  state.completed.clear();
  saveProgress();
  render();
}

function render() {
  renderNavigation();
  renderProgress();
  renderLesson();
}

dom.moduleGrid.addEventListener("click", handleNavigation);
dom.lessonTabs.addEventListener("click", handleNavigation);
dom.activityRoot.addEventListener("click", handleActivity);
dom.activityReset.addEventListener("click", resetActivity);
dom.quizOptions.addEventListener("click", handleQuiz);
dom.resetProgress.addEventListener("click", resetProgress);

render();
