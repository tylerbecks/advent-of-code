import input from './input';

const OPERATORS = ['+', '*'];

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

function evaluate(operator: string, a: number, b: number): number {
  return operator === '+' ? a + b : a * b;
}

function isValid(result: number, inputs: Array<number>) {
  function recurse(index: number, value: number): boolean {
    // Base case: if we've reached the end of the inputs, check if the value is equal to the result
    if (index === inputs.length) {
      return value === result;
    }

    if (index > 0) {
      return OPERATORS.some((operator) => {
        const nextValue = evaluate(operator, value, inputs[index]);
        return recurse(index + 1, nextValue);
      });
    }

    return recurse(1, inputs[0]);
  }

  return recurse(0, 0);
}

const result = solve();
console.log(result);
