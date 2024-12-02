import input from './input';

const countDistances = () => {
  const [list1, list2] = splitIntoLists(input);
  list1.sort();
  list2.sort();

  let sum = 0;

  list1.forEach((first, index) => {
    sum += Math.abs(first - list2[index]);
  });

  return sum;
};

const calcSimilarityScore = () => {
  const [list1, list2] = splitIntoLists(input);
  const map = new Map();

  for (const num of list2) {
    map.set(num, (map.get(num) ?? 0) + 1);
  }

  return list1.reduce((acc, curr) => {
    return acc + curr * (map.get(curr) ?? 0);
  }, 0);
};

// Helpers
const splitIntoLists = (input: string) => {
  const splitByNewlines = input.split('\n');
  const list1: Array<number> = [];
  const list2: Array<number> = [];
  splitByNewlines.forEach((str) => {
    const [first, second] = str.split('   ');
    list1.push(+first);
    list2.push(+second);
  });

  return [list1, list2];
};

const score = calcSimilarityScore();
console.log(score);
