import input from './input';

const solve = () => {
  const lines = parseInput(input);
  const valid = lines.filter(({ result, inputs }) => isValid(result, inputs));

  return valid.reduce((acc, curr) => {
    return acc + curr.result;
  }, 0);
};

function parseInput(input: string): Array<{ result: number; inputs: Array<number> }> {
  return input
    .split('\n')
    .map((line) => line.trim().split(':'))
    .map(([result, numStrs]) => ({
      result: Number(result),
      inputs: numStrs.trim().split(' ').map(Number),
    }));
}

type Operator = '+' | '*';

function isValid(result: number, inputs: Array<number>) {
  function recurse(index: number, value: number, operator: Operator): boolean {
    // Base case: if we've reached the end of the inputs, check if the value is equal to the result
    if (index === inputs.length) {
      return value === result;
    }

    const nextInput = inputs[index];
    const nextValue = operator === '+' ? value + nextInput : value * nextInput;
    const nextIndex = index + 1;

    const addResult = recurse(nextIndex, nextValue, '+');
    const multiplyResult = recurse(nextIndex, nextValue, '*');

    return addResult || multiplyResult;
  }

  return recurse(1, inputs[0], '+') || recurse(1, inputs[0], '*');
}

const result = solve();
console.log(result);
