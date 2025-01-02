import input from './input';

const RUNS = 25;

// Execution time with 25 blinks: 57990.38 ms
const main = (input: string) => {
  const startTime = performance.now();
  let numStrs = input.split(' ');

  for (let x = 1; x <= RUNS; x++) {
    console.log({ x });
    for (let i = 0; i < numStrs.length; i++) {
      const str = numStrs[i];

      if (str === '0') {
        numStrs[i] = '1';
      } else if (str.length % 2 === 0) {
        const firstHalf = str.slice(0, str.length / 2);
        const secondHalf = String(Number(str.slice(str.length / 2)));

        numStrs = [...numStrs.slice(0, i), firstHalf, secondHalf, ...numStrs.slice(i + 1)];
        i++;
      } else {
        numStrs[i] = String(Number(str) * 2024);
      }
    }
  }

  const endTime = performance.now();
  const executionTime = endTime - startTime;

  console.log(`Execution time: ${executionTime.toFixed(2)} ms`);

  return numStrs;
};

// const result = main(input);

// console.log(result);
// console.log(result.length);

const RUNS_2 = 75;

// Execution time with 25 blinks: 25.32 ms
// Note: This is much faster, but not nearly fast enough for 75 iterations, we need to move onto a memoized depth first approach below
function solveOptimizedWithLinkedList(input: string) {
  const startTime = performance.now();
  let root = toList(input);

  for (let x = 1; x <= RUNS_2; x++) {
    console.log(`Run ${x}`);

    let current: Node | null = root;

    while (current !== null) {
      const { val } = current;

      if (val === '0') {
        // Same as: if (str === '0') { numStrs[i] = '1'; }
        current.val = '1';

        // Move on
        current = current.next;
      } else if (val.length % 2 === 0) {
        // Same as array-based splitting:
        // 1) Remove old node
        // 2) Insert two new nodes in its place
        // 3) Skip the newly inserted second node

        const firstVal = val.slice(0, val.length / 2);
        const secondVal = String(Number(val.slice(val.length / 2)));

        const firstNode = new Node(firstVal);
        const secondNode = new Node(secondVal);

        // Step 1: link 'firstNode' with current.prev
        firstNode.prev = current.prev;
        if (current.prev) {
          current.prev.next = firstNode;
        } else {
          // If current was the head
          root = firstNode;
        }

        // Step 2: link 'secondNode' after 'firstNode'
        firstNode.next = secondNode;
        secondNode.prev = firstNode;

        // Step 3: link 'secondNode' with current.next
        secondNode.next = current.next;
        if (current.next) {
          current.next.prev = secondNode;
        }

        // We’ve effectively replaced the “current” node with two new nodes.
        // The original node is now out of the list (no references point to it).

        // === Important Part ===
        // "Skip" the newly inserted second node in this same pass
        // by jumping to secondNode.next:
        current = secondNode.next;
      } else {
        // Same as: numStrs[i] = String(Number(str) * 2024)
        current.val = String(Number(val) * 2024);

        // Move on
        current = current.next;
      }
    }
  }

  const endTime = performance.now();
  const executionTime = endTime - startTime;

  console.log(`Execution time: ${executionTime.toFixed(2)} ms`);

  return getLength(root);
}

function toList(input: string) {
  const numStrs = input.split(' ');
  const root = new Node(numStrs[0]);
  let current = root;

  for (let i = 1; i < numStrs.length; i++) {
    const next = new Node(numStrs[i]);
    current.next = next;
    next.prev = current;
    current = next;
  }

  return root;
}

function getLength(root: Node) {
  let length = 0;
  let current: Node | null = root;

  while (current !== null) {
    length++;
    current = current.next;
  }

  return length;
}

class Node {
  val: string;
  next: Node | null = null;
  prev: Node | null = null;

  constructor(val: string) {
    this.val = val;
  }
}

// const result2 = solveOptimizedWithLinkedList(input);
// console.log(result2);

const memo = new Map<string, number>();

// Execution time with 25 blinks: 3.65 ms
const solveDepthFirstMemoized = (input: string) => {
  const startTime = performance.now();
  // Map the number and blinks to num stones it produces
  const stones = input.split(' ');
  let count = 0;

  for (const stone of stones) {
    count += calcStones(stone);
  }

  const endTime = performance.now();
  const executionTime = endTime - startTime;

  console.log(`Execution time: ${executionTime.toFixed(2)} ms`);

  return count;
};

function calcStones(stone: string, blink = 1): number {
  const key = `${stone},${blink}`;
  const cachedVal = memo.get(key);
  if (cachedVal) {
    console.log('found match', { key, cachedVal });
    return cachedVal;
  }

  if (blink === RUNS_2 + 1) {
    return 1;
  }

  // Change 0 to 1
  if (stone === '0') {
    const numStones = calcStones('1', blink + 1);
    memo.set(key, numStones);
    return numStones;
  }

  // Split in half
  if (stone.length % 2 === 0) {
    const first = stone.slice(0, stone.length / 2);
    const second = String(Number(stone.slice(stone.length / 2)));
    const numStones = calcStones(first, blink + 1) + calcStones(second, blink + 1);

    memo.set(key, numStones);
    return numStones;
  }

  // Else, multiply by 2024
  const newNum = String(Number(stone) * 2024);
  const numStones = calcStones(newNum, blink + 1);
  memo.set(key, numStones);

  return numStones;
}

const result = solveDepthFirstMemoized(input);
console.log(result);
