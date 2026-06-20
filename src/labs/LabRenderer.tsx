import { useState } from "react";
import { LabGuide } from "./LabGuide";
import type { LabConfig } from "../types/content";

const binaryTarget = 47;
interface Station {
  name: string;
  covers: string[];
}

const graph: Record<string, string[]> = {
  You: ["Ari", "Bea", "Cam"],
  Ari: ["Dee", "Ezra"],
  Bea: ["Finn"],
  Cam: ["Gia", "Maya"],
  Dee: [],
  Ezra: ["Maya"],
  Finn: [],
  Gia: [],
  Maya: [],
};

const weightedGraph: Record<string, Record<string, number>> = {
  A: { B: 4, C: 2 },
  B: { D: 5, E: 10 },
  C: { B: 1, E: 3 },
  D: { F: 2 },
  E: { D: 4, F: 6 },
  F: {},
};

const stations: Station[] = [
  { name: "North", covers: ["Design", "Data", "Web"] },
  { name: "River", covers: ["AI", "Security", "Data"] },
  { name: "Market", covers: ["Mobile", "Web"] },
  { name: "Harbor", covers: ["AI", "Systems", "Security"] },
  { name: "Garden", covers: ["Systems", "Mobile"] },
];

export function LabRenderer({ config }: { config: LabConfig }) {
  const [step, setStep] = useState(0);

  return (
    <div className="activity-panel">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">Interactive lab</p>
          <h3>{config.title}</h3>
        </div>
        <button className="ghost-button" onClick={() => setStep(0)} type="button">
          Rewind lab
        </button>
      </div>
      {renderLab(config, step, () => setStep((current) => current + 1))}
    </div>
  );
}

function renderLab(config: LabConfig, step: number, advance: () => void) {
  switch (config.type) {
    case "binary-search":
      return <BinarySearchLab advance={advance} step={step} />;
    case "selection-sort":
      return <SelectionSortLab advance={advance} step={step} values={config.values ?? []} />;
    case "recursion":
      return <RecursionLab advance={advance} max={config.n ?? 5} step={step} />;
    case "partition":
      return <PartitionLab advance={advance} config={config} step={step} />;
    case "hash-table":
      return <HashTableLab advance={advance} config={config} step={step} />;
    case "bfs":
      return <BfsLab advance={advance} config={config} step={step} />;
    case "dijkstra":
      return <DijkstraLab advance={advance} config={config} step={step} />;
    case "greedy-cover":
      return <GreedyCoverLab advance={advance} step={step} />;
  }
}

function BinarySearchLab({ advance, step }: { advance: () => void; step: number }) {
  const steps = binarySearchSteps();
  const currentStep = steps[Math.min(step, steps.length - 1)];
  const found = currentStep.mid === binaryTarget;

  return (
    <>
      <LabGuide
        action={`Look at the cyan midpoint ${currentStep.mid}. Click “Compare midpoint” to discard half the range.`}
        complete={found}
        insight={`Binary search found ${binaryTarget} by repeatedly halving the possible range.`}
        objective={`Find the hidden target ${binaryTarget} without checking every number.`}
        step={Math.min(step, steps.length - 1)}
        total={steps.length - 1}
      />
      <p>{found ? `Found ${binaryTarget} in ${step + 1} guesses.` : `Check midpoint ${currentStep.mid}.`}</p>
      <div className="number-line" aria-label="Numbers 1 to 64">
        {Array.from({ length: 64 }, (_, index) => {
          const value = index + 1;
          const classes = [
            "num-cell",
            value < currentStep.low || value > currentStep.high ? "out" : "",
            value === currentStep.mid ? "mid" : "",
            found && value === binaryTarget ? "target" : "",
          ].filter(Boolean);
          return (
            <span className={classes.join(" ")} key={value}>
              {value}
            </span>
          );
        })}
      </div>
      <div className="sim-controls">
        <button className="primary-button" disabled={found} onClick={advance} type="button">
          Compare midpoint
        </button>
        <span className="mini-pill">
          Remaining range: {currentStep.low}–{currentStep.high}
        </span>
      </div>
    </>
  );
}

function SelectionSortLab({
  advance,
  step,
  values,
}: {
  advance: () => void;
  step: number;
  values: number[];
}) {
  const snapshots = selectionSortSnapshots(values);
  const currentPass = Math.min(step, snapshots.length - 1);
  const snapshot = snapshots[currentPass];
  const complete = currentPass >= snapshots.length - 1;

  return (
    <>
      <LabGuide
        action="Click “Run selection pass” to move the next smallest value into the gold sorted zone."
        complete={complete}
        insight="Selection sort is complete: every pass locked one more item into sorted order."
        objective="Sort the bars by repeatedly finding the smallest unsorted value."
        step={currentPass}
        total={snapshots.length - 1}
      />
      <div className="bars">
        {snapshot.array.map((value, index) => {
          const classes = [
            "bar",
            snapshot.active.includes(index) ? "active" : "",
            snapshot.sorted.includes(index) ? "sorted" : "",
          ].filter(Boolean);
          return (
            <div className={classes.join(" ")} key={`${value}-${index}`}>
              <span style={{ height: `${value * 11}px` }} />
              {value}
            </div>
          );
        })}
      </div>
      <div className="sim-controls">
        <button className="primary-button" disabled={complete} onClick={advance} type="button">
          Run selection pass
        </button>
        <span className="mini-pill">
          Pass {currentPass} of {snapshots.length - 1}
        </span>
      </div>
    </>
  );
}

function RecursionLab({ advance, max, step }: { advance: () => void; max: number; step: number }) {
  const maxStep = max * 2;
  const currentStep = Math.min(step, maxStep);
  const descending = currentStep <= max;
  const complete = currentStep >= maxStep;
  const rows = buildRecursionRows(max, currentStep, descending);

  return (
    <>
      <LabGuide
        action={
          descending
            ? "Click “Advance call stack” to add the next smaller recursive call."
            : "Click “Advance call stack” to watch waiting calls return in reverse order."
        }
        complete={complete}
        insight="The recursion finished because it reached a base case, then returned through the stack."
        objective="Follow factorial calls as they stack up, hit a base case, then unwind."
        step={currentStep}
        total={maxStep}
      />
      <div className="activity-card">
        {rows.map((row) => (
          <div className="stack-row" key={row.label}>
            <strong>{row.label}</strong>
            <span>{row.status}</span>
          </div>
        ))}
      </div>
      <div className="sim-controls">
        <button className="primary-button" disabled={complete} onClick={advance} type="button">
          Advance call stack
        </button>
        <span className="mini-pill">factorial({max})</span>
      </div>
    </>
  );
}

function PartitionLab({
  advance,
  config,
  step,
}: {
  advance: () => void;
  config: LabConfig;
  step: number;
}) {
  const values = config.values ?? [];
  const pivot = config.pivot ?? values[0] ?? 0;
  const currentStep = Math.min(step, values.length);
  const seen = values.slice(0, currentStep);
  const left = values.filter((value) => value < pivot && seen.includes(value));
  const right = values.filter((value) => value > pivot && seen.includes(value));
  const nextValue = values[currentStep];
  const complete = currentStep >= values.length;

  return (
    <>
      <LabGuide
        action={
          nextValue === undefined
            ? "All values are classified."
            : `Next, classify ${nextValue}: click “Classify value” to send it left or right of the pivot.`
        }
        complete={complete}
        insight="Partitioning created smaller left and right problems for quicksort to handle recursively."
        objective={`Partition every value around pivot ${pivot}.`}
        step={currentStep}
        total={values.length}
      />
      <div className="activity-grid">
        <div className="activity-card">
          <strong>Seen</strong>
          <p>{seen.join(", ") || "None yet"}</p>
        </div>
        <div className="activity-card">
          <strong>Left of pivot</strong>
          <p>{left.join(", ") || "Waiting"}</p>
        </div>
        <div className="activity-card">
          <strong>Pivot</strong>
          <p>{pivot}</p>
        </div>
        <div className="activity-card">
          <strong>Right of pivot</strong>
          <p>{right.join(", ") || "Waiting"}</p>
        </div>
      </div>
      <div className="sim-controls">
        <button className="primary-button" disabled={complete} onClick={advance} type="button">
          Classify value
        </button>
        <span className="mini-pill">
          {currentStep}/{values.length} values classified
        </span>
      </div>
    </>
  );
}

function HashTableLab({
  advance,
  config,
  step,
}: {
  advance: () => void;
  config: LabConfig;
  step: number;
}) {
  const keys = config.keys ?? [];
  const bucketCount = config.buckets ?? 5;
  const shownKeys = keys.slice(0, Math.min(step, keys.length));
  const buckets = Array.from({ length: bucketCount }, () => [] as string[]);
  shownKeys.forEach((key) => buckets[hashFor(key, bucketCount)].push(key));
  const nextKey = keys[shownKeys.length];
  const complete = shownKeys.length >= keys.length;

  return (
    <>
      <LabGuide
        action={
          nextKey === undefined
            ? "All keys have been placed."
            : `Next key is ${nextKey}. Click “Hash next key” to compute its bucket.`
        }
        complete={complete}
        insight="The table is loaded. Any bucket with multiple names shows a collision."
        objective="Drop each name into a hash bucket and watch for collisions."
        step={shownKeys.length}
        total={keys.length}
      />
      <div className="activity-card">
        {buckets.map((bucket, index) => (
          <div className="bucket-row" key={index}>
            <strong>Bucket {index}</strong>
            <span>{bucket.join(" → ") || "empty"}</span>
          </div>
        ))}
      </div>
      <div className="sim-controls">
        <button className="primary-button" disabled={complete} onClick={advance} type="button">
          Hash next key
        </button>
        <span className="mini-pill">
          {shownKeys.length}/{keys.length} keys placed
        </span>
      </div>
    </>
  );
}

function BfsLab({
  advance,
  config,
  step,
}: {
  advance: () => void;
  config: LabConfig;
  step: number;
}) {
  const start = config.start ?? "You";
  const goal = config.goal ?? "Maya";
  const snapshots = bfsSnapshots(start, goal);
  const snapshot = snapshots[Math.min(step, snapshots.length - 1)];
  const path = snapshot.current === goal ? buildPath(snapshot.parent, start, goal) : [];
  const complete = path.length > 0;

  return (
    <>
      <LabGuide
        action="Click “Explore next layer” to visit the next queued node. The queue keeps closer nodes first."
        complete={complete}
        insight={`BFS found the shortest unweighted path: ${path.join(" → ")}.`}
        objective={`Find ${goal} using the fewest friend hops from ${start}.`}
        step={Math.min(step, snapshots.length - 1)}
        total={snapshots.length - 1}
      />
      <p>
        {path.length
          ? `Found path: ${path.join(" → ")}`
          : `Exploring ${snapshot.current}. Queue next: ${snapshot.queue.join(", ") || "empty"}.`}
      </p>
      <div className="graph-board">
        {Object.keys(graph).map((node) => {
          const classes = [
            "node",
            node === snapshot.current ? "active" : "",
            snapshot.visited.includes(node) ? "done" : "",
          ].filter(Boolean);
          return (
            <span className={classes.join(" ")} key={node}>
              {node}
            </span>
          );
        })}
      </div>
      <div className="sim-controls">
        <button className="primary-button" disabled={complete} onClick={advance} type="button">
          Explore next layer
        </button>
        <span className="mini-pill">Goal: {goal}</span>
      </div>
    </>
  );
}

function DijkstraLab({
  advance,
  config,
  step,
}: {
  advance: () => void;
  config: LabConfig;
  step: number;
}) {
  const start = config.start ?? "A";
  const goal = config.goal ?? "F";
  const snapshots = dijkstraSnapshots(start);
  const snapshot = snapshots[Math.min(step, snapshots.length - 1)];
  const path = snapshot.visited.includes(goal) ? buildPath(snapshot.previous, start, goal) : [];
  const complete = path.length > 0;

  return (
    <>
      <LabGuide
        action="Click “Relax cheapest node” to lock the next lowest-cost node and improve its neighbors."
        complete={complete}
        insight={`Dijkstra found the cheapest route: ${path.join(" → ")} with cost ${snapshot.distances[goal]}.`}
        objective={`Find the cheapest weighted route from ${start} to ${goal}.`}
        step={Math.min(step, snapshots.length - 1)}
        total={snapshots.length - 1}
      />
      <div className="activity-card">
        {Object.entries(snapshot.distances).map(([node, distance]) => (
          <div className="stat-row" key={node}>
            <strong>
              {node}
              {node === snapshot.current ? " ← current" : ""}
            </strong>
            <span>{distance === Infinity ? "∞" : distance}</span>
          </div>
        ))}
      </div>
      <div className="sim-controls">
        <button className="primary-button" disabled={complete} onClick={advance} type="button">
          Relax cheapest node
        </button>
        <span className="mini-pill">Goal: {goal}</span>
      </div>
    </>
  );
}

function GreedyCoverLab({ advance, step }: { advance: () => void; step: number }) {
  const universe = ["Design", "Data", "Web", "AI", "Security", "Mobile", "Systems"];
  const chosen = chooseGreedyStations(step, universe);
  const covered = new Set(chosen.flatMap((station) => station.covers));
  const nextStation = chooseGreedyStations(step + 1, universe).at(-1);
  const complete = universe.every((topic) => covered.has(topic));

  return (
    <>
      <LabGuide
        action={
          nextStation
            ? `Click “Choose best station” to pick ${nextStation.name}, the station covering the most uncovered topics right now.`
            : "All topics are covered."
        }
        complete={complete}
        insight="The greedy strategy quickly covered every topic by making the best local choice available."
        objective="Cover every topic by choosing useful stations one at a time."
        step={covered.size}
        total={universe.length}
      />
      <div className="cover-board">
        {universe.map((topic) => (
          <span className={`city-chip ${covered.has(topic) ? "covered" : ""}`} key={topic}>
            {topic}
          </span>
        ))}
      </div>
      <div className="cover-board">
        {stations.map((station) => (
          <div className={`set-card ${chosen.includes(station) ? "active" : ""}`} key={station.name}>
            <strong>{station.name}</strong>
            <small>{station.covers.join(", ")}</small>
          </div>
        ))}
      </div>
      <div className="sim-controls">
        <button className="primary-button" disabled={complete} onClick={advance} type="button">
          Choose best station
        </button>
        <span className="mini-pill">
          {covered.size}/{universe.length} topics covered
        </span>
      </div>
    </>
  );
}

function binarySearchSteps() {
  let low = 1;
  let high = 64;
  const steps = [];

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    steps.push({ high, low, mid });
    if (mid === binaryTarget) break;
    if (mid < binaryTarget) low = mid + 1;
    else high = mid - 1;
  }

  return steps;
}

function selectionSortSnapshots(values: number[]) {
  const array = [...values];
  const snapshots = [{ array: [...array], active: [] as number[], sorted: [] as number[] }];

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

function buildRecursionRows(max: number, step: number, descending: boolean) {
  if (descending) {
    return Array.from({ length: step + 1 }, (_, index) => max - index)
      .filter((value) => value > 0)
      .map((value) => ({
        label: `factorial(${value})`,
        status: value === 1 ? "base case soon" : "waiting",
      }));
  }

  const unwound = step - max;
  return Array.from({ length: max - unwound }, (_, index) => unwound + index + 1).map((value) => ({
    label: `return from factorial(${value})`,
    status: value === max ? "final answer" : "unwinding",
  }));
}

function hashFor(key: string, buckets: number) {
  return [...key].reduce((sum, character) => sum + character.charCodeAt(0), 0) % buckets;
}

function bfsSnapshots(start: string, goal: string) {
  const queue = [start];
  const visited = new Set([start]);
  const parent: Record<string, string> = {};
  const snapshots = [];

  while (queue.length > 0) {
    const current = queue.shift() as string;
    snapshots.push({ current, parent: { ...parent }, queue: [...queue], visited: [...visited] });
    if (current === goal) break;
    for (const neighbor of graph[current] ?? []) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        parent[neighbor] = current;
        queue.push(neighbor);
      }
    }
  }

  return snapshots;
}

function dijkstraSnapshots(start: string) {
  const distances = Object.fromEntries(Object.keys(weightedGraph).map((node) => [node, Infinity]));
  const previous: Record<string, string> = {};
  const visited = new Set<string>();
  const snapshots = [];
  distances[start] = 0;

  while (visited.size < Object.keys(weightedGraph).length) {
    const current = Object.keys(distances)
      .filter((node) => !visited.has(node))
      .sort((first, second) => distances[first] - distances[second])[0];

    if (!current || distances[current] === Infinity) break;
    visited.add(current);

    for (const [neighbor, cost] of Object.entries(weightedGraph[current])) {
      const candidate = distances[current] + cost;
      if (candidate < distances[neighbor]) {
        distances[neighbor] = candidate;
        previous[neighbor] = current;
      }
    }

    snapshots.push({
      current,
      distances: { ...distances },
      previous: { ...previous },
      visited: [...visited],
    });
  }

  return snapshots;
}

function buildPath(parent: Record<string, string>, start: string, goal: string) {
  const path = [goal];
  while (path[0] !== start && parent[path[0]]) path.unshift(parent[path[0]]);
  return path[0] === start ? path : [];
}

function chooseGreedyStations(limit: number, universe: string[]) {
  const chosen: Station[] = [];
  const covered = new Set<string>();

  while (chosen.length < limit && covered.size < universe.length) {
    const next = stations
      .filter((station) => !chosen.includes(station))
      .sort(
        (stationA, stationB) =>
          stationB.covers.filter((topic) => !covered.has(topic)).length -
          stationA.covers.filter((topic) => !covered.has(topic)).length,
      )[0];

    if (!next) break;
    chosen.push(next);
    next.covers.forEach((topic) => covered.add(topic));
  }

  return chosen;
}
