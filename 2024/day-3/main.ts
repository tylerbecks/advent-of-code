import input from './input';

const multiplyExpression = (exp: RegExpExecArray): number => {
  const numPair = exp.toString().replace('mul(', '').replace(')', '').split(',').map(Number);
  return numPair[0] * numPair[1];
};

const multipleRegex = /mul\(\d{1,3},\d{1,3}\)/g;

const main = () => {
  const matches = input.matchAll(multipleRegex);
  const nums = matches.map(multiplyExpression);

  return nums.reduce((acc, curr) => {
    return acc + curr;
  }, 0);
};

// const result = main();
// console.log(result);
function processCorruptedMemory() {
  let sum = 0;
  let enabled = true; // Start with multiplications enabled
  let position = 0;

  // Find all relevant instructions
  while (position < input.length) {
    // Check for do() or don't() instructions
    if (input.slice(position).match(/^do\(\)/)) {
      enabled = true;
      position += 4; // Length of "do()"
      continue;
    }
    if (input.slice(position).match(/^don't\(\)/)) {
      enabled = false;
      position += 6; // Length of "don't()"
      continue;
    }

    // Check for mul instruction
    const mulMatch = /^mul\((\d{1,3}),(\d{1,3})\)/.exec(input.slice(position));
    if (mulMatch) {
      if (enabled) {
        const x = parseInt(mulMatch[1]);
        const y = parseInt(mulMatch[2]);
        sum += x * y;
      }
      position += mulMatch[0].length;
    } else {
      position++; // Move forward one character if no match
    }
  }

  return sum;
}

const result2 = processCorruptedMemory();
console.log(result2);
