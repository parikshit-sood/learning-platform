export const modules = [
  {
    id: "search-complexity",
    title: "Search & Complexity",
    kicker: "Module 01",
    level: "Beginner",
    duration: "12 min",
    cardSummary: "Use binary search to feel how algorithms shrink work.",
    summary:
      "Algorithms are recipes with tradeoffs. Binary search shows the core idea beautifully: when data is ordered, each question can cut the remaining search space in half.",
    outcomes: [
      "Explain why sorted data unlocks binary search.",
      "Compare linear and logarithmic growth.",
      "Predict how many guesses a search may need.",
    ],
    activity: {
      type: "binary-search",
      title: "Binary search mission",
      prompt: "Find the hidden number between 1 and 64 by following the midpoint strategy.",
    },
    quiz: {
      question: "Why does binary search usually beat checking every item?",
      options: [
        "It discards about half of the remaining possibilities after each comparison.",
        "It checks every item faster because computers prefer sorted lists.",
        "It guesses randomly until it gets lucky.",
      ],
      answer: 0,
      explanation: "Exactly. Halving the search space gives binary search logarithmic growth.",
    },
  },
  {
    id: "arrays-selection-sort",
    title: "Lists & Sorting",
    kicker: "Module 02",
    level: "Beginner",
    duration: "14 min",
    cardSummary: "Watch selection sort build order one smallest item at a time.",
    summary:
      "Data structures shape what feels easy or expensive. Selection sort is intentionally simple: repeatedly find the smallest unsorted value and move it into place.",
    outcomes: [
      "Describe the difference between access and insertion costs.",
      "Trace selection sort by hand.",
      "Recognize quadratic growth in nested passes.",
    ],
    activity: {
      type: "selection-sort",
      title: "Selection sort visualizer",
      values: [7, 3, 9, 2, 6, 4],
    },
    quiz: {
      question: "What is the main repeated action in selection sort?",
      options: [
        "Find the smallest unsorted item and place it next.",
        "Split the list into halves until one item remains.",
        "Use a hash function to find the destination bucket.",
      ],
      answer: 0,
      explanation: "Right. Selection sort slowly grows a sorted prefix from the front.",
    },
  },
  {
    id: "recursion-stack",
    title: "Recursion & Stack",
    kicker: "Module 03",
    level: "Beginner",
    duration: "10 min",
    cardSummary: "Step through calls as they stack up and unwind.",
    summary:
      "Recursion solves a problem by reducing it to a smaller version of itself. The safety rails are a base case and progress toward that base case.",
    outcomes: [
      "Identify base and recursive cases.",
      "Visualize how function calls wait on the call stack.",
      "Spot recursion that never moves toward a stop condition.",
    ],
    activity: {
      type: "recursion",
      title: "Call stack climber",
      n: 5,
    },
    quiz: {
      question: "What keeps recursive code from running forever?",
      options: [
        "A base case that eventually returns without another recursive call.",
        "A faster processor.",
        "A list that is already sorted.",
      ],
      answer: 0,
      explanation: "Yep. A recursive function needs a stop sign it can actually reach.",
    },
  },
  {
    id: "quicksort-divide",
    title: "Divide & Conquer",
    kicker: "Module 04",
    level: "Intermediate",
    duration: "15 min",
    cardSummary: "Partition a list around a pivot and see quicksort’s shape.",
    summary:
      "Divide-and-conquer turns one problem into smaller independent problems. Quicksort does this by choosing a pivot, partitioning around it, then sorting each side.",
    outcomes: [
      "Choose a pivot and partition values.",
      "Explain average versus worst-case behavior.",
      "Connect recursion to divide-and-conquer strategies.",
    ],
    activity: {
      type: "partition",
      title: "Pivot partition lab",
      values: [8, 3, 10, 1, 6, 14, 4],
      pivot: 6,
    },
    quiz: {
      question: "What does quicksort need after choosing a pivot?",
      options: [
        "A partition step that moves smaller values to one side and larger values to the other.",
        "A queue so it can search neighbors level by level.",
        "A cache so every value has a permanent lookup key.",
      ],
      answer: 0,
      explanation: "Exactly. Partitioning creates the smaller subproblems.",
    },
  },
  {
    id: "hash-tables",
    title: "Hash Tables",
    kicker: "Module 05",
    level: "Intermediate",
    duration: "13 min",
    cardSummary: "Drop keys into buckets and see collisions happen.",
    summary:
      "Hash tables trade a little structure for fast lookups. A hash function maps a key to a bucket; good distribution keeps buckets short and operations quick.",
    outcomes: [
      "Explain what a hash function does.",
      "Recognize collisions and load factor pressure.",
      "Name practical uses like caches and duplicate checks.",
    ],
    activity: {
      type: "hash-table",
      title: "Bucket drop simulator",
      keys: ["Ada", "Linus", "Grace", "Katherine", "Edsger", "Radia"],
      buckets: 5,
    },
    quiz: {
      question: "What is a collision in a hash table?",
      options: [
        "Two keys mapping to the same bucket.",
        "A sorted list becoming unsorted.",
        "A graph edge with no weight.",
      ],
      answer: 0,
      explanation: "Right. Collisions are normal; the design challenge is handling them well.",
    },
  },
  {
    id: "breadth-first-search",
    title: "Graph Search",
    kicker: "Module 06",
    level: "Intermediate",
    duration: "16 min",
    cardSummary: "Use a queue to find the fewest-hop path through a graph.",
    summary:
      "Graphs model relationships. Breadth-first search explores neighbors in waves, which makes it ideal for shortest paths in unweighted graphs.",
    outcomes: [
      "Represent a graph as neighbors.",
      "Use a queue to explore level by level.",
      "Recover a shortest unweighted path.",
    ],
    activity: {
      type: "bfs",
      title: "Friend network search",
      start: "You",
      goal: "Maya",
    },
    quiz: {
      question: "Why does breadth-first search use a queue?",
      options: [
        "A queue preserves first-in, first-out order so closer nodes are explored first.",
        "A queue automatically sorts weighted edges.",
        "A queue prevents the graph from having cycles.",
      ],
      answer: 0,
      explanation: "Bullseye. FIFO order keeps the search expanding in distance layers.",
    },
  },
  {
    id: "dijkstra",
    title: "Weighted Paths",
    kicker: "Module 07",
    level: "Intermediate",
    duration: "18 min",
    cardSummary: "Relax weighted edges to find the cheapest route.",
    summary:
      "When edges have costs, fewest hops may not be cheapest. Dijkstra’s algorithm repeatedly locks in the currently cheapest unsettled node and improves its neighbors.",
    outcomes: [
      "Track tentative distances.",
      "Explain edge relaxation.",
      "Know why negative weights require different tools.",
    ],
    activity: {
      type: "dijkstra",
      title: "Route cost planner",
      start: "A",
      goal: "F",
    },
    quiz: {
      question: "What does relaxing an edge mean?",
      options: [
        "Checking whether a route through the current node improves a neighbor’s known cost.",
        "Removing all expensive edges before the algorithm starts.",
        "Changing a weighted graph into an unweighted graph.",
      ],
      answer: 0,
      explanation: "Correct. Relaxation is the moment a cheaper path is discovered.",
    },
  },
  {
    id: "greedy-np",
    title: "Greedy Choices",
    kicker: "Module 08",
    level: "Intermediate",
    duration: "15 min",
    cardSummary: "Pick useful approximations when perfect is too expensive.",
    summary:
      "Greedy algorithms make the best local move available. They can be exact for some problems and practical approximations for problems where exhaustive search explodes.",
    outcomes: [
      "Define a greedy strategy.",
      "Use set cover as an approximation example.",
      "Recognize when exact search may be unrealistic.",
    ],
    activity: {
      type: "greedy-cover",
      title: "Station cover challenge",
    },
    quiz: {
      question: "Why use an approximation algorithm for some hard problems?",
      options: [
        "A good-enough answer may arrive quickly when the exact answer is too costly.",
        "Approximation algorithms always produce the perfect answer.",
        "They only work when there is no input data.",
      ],
      answer: 0,
      explanation: "Yes. Practical speed can matter more than mathematical perfection.",
    },
  },
];
