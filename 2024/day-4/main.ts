import input from './input';
// const input = `SXXX
// XAXX
// XXMX
// XXXX`;

const rows = input.split('\n');
const XMAS = ['X', 'M', 'A', 'S'];

const forward = (i: number, j: number) => {
  const row = rows[i];
  let curr = 0;
  for (let x = j; curr < 4 && x < row.length; curr++) {
    const char = rows[i][x];
    if (char !== XMAS[curr]) return false;
    x++;
  }
  return curr === 4;
};

const backward = (i: number, j: number) => {
  let curr = 0;
  for (let x = j; curr < 4 && x >= 0; curr++) {
    const char = rows[i][x];
    if (char && char !== XMAS[curr]) return false;
    x--;
  }
  return curr === 4;
};

const down = (i: number, j: number) => {
  let curr = 0;
  for (let x = i; curr < 4 && x < rows.length; curr++) {
    const char = rows[x][j];
    if (char !== XMAS[curr]) return false;
    x++;
  }

  return curr === 4;
};

const up = (i: number, j: number) => {
  let curr = 0;
  for (let x = i; curr < 4 && x >= 0; curr++) {
    const char = rows[x][j];
    if (char !== XMAS[curr]) return false;
    x--;
  }

  return curr === 4;
};

const downRight = (i: number, j: number) => {
  let i2 = i;
  let j2 = j;
  for (let curr = 0; curr < 4; curr++) {
    const row = rows[i2];
    if (!row) return false;
    const char = row[j2];
    if (char !== XMAS[curr]) return false;
    i2++;
    j2++;
  }

  return true;
};

const downLeft = (i: number, j: number) => {
  let i2 = i;
  let j2 = j;
  for (let curr = 0; curr < 4; curr++) {
    const row = rows[i2];
    if (!row) return false;
    const char = row[j2];
    if (char !== XMAS[curr]) return false;
    i2++;
    j2--;
  }

  return true;
};

const upRight = (i: number, j: number) => {
  let i2 = i;
  let j2 = j;
  for (let curr = 0; curr < 4; curr++) {
    const row = rows[i2];
    if (!row) return false;
    const char = row[j2];
    if (char !== XMAS[curr]) return false;
    i2--;
    j2++;
  }

  return true;
};

const upLeft = (i: number, j: number) => {
  let i2 = i;
  let j2 = j;
  for (let curr = 0; curr < 4; curr++) {
    const row = rows[i2];
    if (!row) return false;
    const char = row[j2];

    if (char !== XMAS[curr]) return false;
    i2--;
    j2--;
  }

  return true;
};

const main = () => {
  let count = 0;
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    for (let j = 0; j < row.length; j++) {
      if (forward(i, j)) count++;
      if (backward(i, j)) count++;
      if (down(i, j)) count++;
      if (up(i, j)) count++;
      if (downRight(i, j)) count++;
      if (downLeft(i, j)) count++;
      if (upRight(i, j)) count++;
      if (upLeft(i, j)) count++;
    }
  }

  return count;
};

// const result = main();
// console.log({ result });

const isCross = (i: number, j: number) => {
  const rowAbove = rows[i - 1];
  const rowBelow = rows[i + 1];

  const char = rows[i][j];
  if (char !== 'A') return false;

  if (!rowAbove) return false;
  if (!rowBelow) return false;

  // Check left
  const topLeft = rowAbove[j - 1];
  const bottomRight = rowBelow[j + 1];
  if (!isValidChar(topLeft)) return false;
  if (!isValidChar(bottomRight)) return false;
  if (topLeft === 'M' && bottomRight !== 'S') return false;
  if (topLeft === 'S' && bottomRight !== 'M') return false;

  // Check right
  const topRight = rowAbove[j + 1];
  const bottomLeft = rowBelow[j - 1];
  if (!isValidChar(topRight)) return false;
  if (!isValidChar(bottomLeft)) return false;
  if (topRight === 'M' && bottomLeft !== 'S') return false;
  if (topRight === 'S' && bottomLeft !== 'M') return false;

  return true;
};

const isValidChar = (char: string) => !!char && (char === 'S' || char === 'M');

const main2 = () => {
  let count = 0;
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    for (let j = 0; j < row.length; j++) {
      if (isCross(i, j)) {
        count++;
      }
    }
  }

  return count;
};

const result2 = main2();
console.log(result2);
