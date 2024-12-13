import input from './input';

const rulesToMap = (rules: Array<Array<string>>) => {
  const map: Map<string, Array<string>> = new Map();
  for (const rule of rules) {
    const [before, after] = rule;
    const existing = map.get(before);
    if (!existing) {
      map.set(before, [after]);
    } else {
      existing.push(after);
    }
  }

  return map;
};

const [rulesStr, updatesStr] = input.split('\n\n');
const rules = rulesStr.split('\n').map((str) => str.trim().split('|'));
const rulesMap = rulesToMap(rules);
const updates = updatesStr.split('\n').map((str) => str.trim().split(','));

function isValid(pages: Array<string>) {
  const hash: Record<string, number> = {};
  for (let i = 0; i < pages.length; i++) {
    const page = pages[i];
    hash[page] = i;
  }

  for (const page of pages) {
    const shoulComebefore = rulesMap.get(page);
    if (!shoulComebefore) continue;
    for (const after of shoulComebefore) {
      if (hash[after] < hash[page]) return false;
    }
  }

  return true;
}

const findIncorrectUpdates = (updates: string[][], rulesMap: Map<string, string[]>): number => {
  // Filter for invalid updates first
  const invalidUpdates = updates.filter((update) => !isValid(update));

  // Sort each invalid update
  const sortedUpdates = invalidUpdates.map((update) => {
    return topologicalSort(update, rulesMap);
  });

  // Calculate sum of middle elements
  return sortedUpdates.reduce((acc, curr) => {
    const middle = curr[Math.floor(curr.length / 2)];
    return acc + +middle;
  }, 0);
};

// Convert rules and pages into a graph representation
const buildGraph = (pages: string[], rulesMap: Map<string, string[]>): Map<string, Set<string>> => {
  const graph = new Map<string, Set<string>>();

  // Initialize graph with all pages
  pages.forEach((page) => {
    graph.set(page, new Set<string>());
  });

  // Add edges based on rules
  pages.forEach((page) => {
    const dependencies = rulesMap.get(page);
    if (dependencies) {
      dependencies.forEach((dep) => {
        if (pages.includes(dep)) {
          const set = graph.get(dep);
          if (set) set.add(page);
        }
      });
    }
  });

  return graph;
};

// Perform Kahn's algorithm for topological sorting
const topologicalSort = (pages: string[], rulesMap: Map<string, string[]>): string[] => {
  const graph = buildGraph(pages, rulesMap);
  const result: string[] = [];
  const noIncoming: string[] = [];

  // Calculate initial in-degree for each node
  const inDegree = new Map<string, number>();
  pages.forEach((page) => {
    inDegree.set(page, 0);
  });

  graph.forEach((edges, _) => {
    edges.forEach((edge) => {
      inDegree.set(edge, (inDegree.get(edge) || 0) + 1);
    });
  });

  // Find nodes with no incoming edges
  inDegree.forEach((degree, page) => {
    if (degree === 0) {
      noIncoming.push(page);
    }
  });

  // Process nodes in topological order
  while (noIncoming.length > 0) {
    const current = noIncoming.shift()!;
    result.push(current);

    const edges = graph.get(current) || new Set();
    edges.forEach((neighbor) => {
      const newDegree = (inDegree.get(neighbor) || 0) - 1;
      inDegree.set(neighbor, newDegree);

      if (newDegree === 0) {
        noIncoming.push(neighbor);
      }
    });
  }

  return result;
};

// Use your existing code to parse input

// Get the answer
const answer = findIncorrectUpdates(updates, rulesMap);
console.log(answer);
