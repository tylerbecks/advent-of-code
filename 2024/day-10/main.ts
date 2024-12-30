import input from './input';

const findPaths = () => {
  const lines = input.split('\n').map((line) => line.split('').map((str) => Number(str)));
  const points = new Set<string>();

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    for (let j = 0; j < line.length; j++) {
      if (line[j] === 9) {
        const paths = getPaths(lines, i, j);
        for (const path of paths) {
          points.add(`${path},${i},${j}`);
        }
      }
    }
  }

  return points.size;
};

function getPaths(lines: Array<Array<number>>, rowIndex: number, col: number, prevNum = 10): Array<string> {
  const row = lines[rowIndex];
  if (!row) return [];
  if (col < 0 || col >= row.length) return [];
  const currentNum = row[col];
  if (currentNum !== prevNum - 1) return [];
  if (currentNum === 0) return [`${rowIndex},${col}`];

  return [
    ...getPaths(lines, rowIndex + 1, col, currentNum), // down
    ...getPaths(lines, rowIndex - 1, col, currentNum), // up
    ...getPaths(lines, rowIndex, col - 1, currentNum), // left
    ...getPaths(lines, rowIndex, col + 1, currentNum), // right
  ];
}

const result = findPaths();
console.log(result);
