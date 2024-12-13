import input from './input';

type Direction = 'up' | 'down' | 'left' | 'right';

const moves = {
  up: [-1, 0],
  down: [1, 0],
  left: [0, -1],
  right: [0, 1],
};

const turns: Record<Direction, Direction> = {
  up: 'right',
  right: 'down',
  down: 'left',
  left: 'up',
};

const calculateDistinctSteps = () => {
  const rows = input.split('\n');
  const guardPath = getGuardPath(rows);

  console.log(guardPath);

  let count = 0;
  for (const row of guardPath) {
    count += (row.match(/X/g) || []).length;
  }

  return count;
};

function getGuardPath(rowsInput: Array<string>) {
  const rows = rowsInput.slice();
  let rowNum = findRow(rows);
  let col = findCol(rows[rowNum]);

  let direction: Direction = 'up';
  while (true) {
    const turn = turns[direction];
    const [rowMove, colMove] = moves[direction];
    const nextRowNum = rowNum + rowMove;
    const nextCol = col + colMove;
    const row = rows[nextRowNum];

    if (!row) break;

    const char = row[nextCol];
    if (!char) break;

    if (char === '#') {
      direction = turn;
    } else {
      rowNum = nextRowNum;
      col = nextCol;
      const newRow = row.slice(0, col) + 'X' + row.slice(col + 1);
      rows[rowNum] = newRow;
    }
  }

  return rows;
}

function findRow(rows: Array<string>) {
  for (const row of rows) {
    if (row.includes('^')) {
      return rows.indexOf(row);
    }
  }

  throw new Error('did not find row');
}

function findCol(row: string) {
  return row.indexOf('^');
}

// const result = calculateDistinctSteps();
// console.log(result);

function solvePart2() {
  const rows = input.split('\n');
  const roadBlocks = new Set<string>();

  const guardRow = findRow(rows);
  const guardCol = findCol(rows[guardRow]);

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    for (let j = 0; j < row.length; j++) {
      if (i === guardRow && j === guardCol) continue;
      const newRows = rows.slice();
      newRows[i] = row.slice(0, j) + '#' + row.slice(j + 1);

      if (isInLoop(newRows)) {
        // console.log('✅ ADDING');
        roadBlocks.add(`${i},${j}`);
      } else {
        // console.log('❌ NOT ADDING');
      }
    }
  }

  return roadBlocks.size;
}

function isInLoop(rowsInput: Array<string>) {
  console.log('----------isInLOop----------');
  const rows = rowsInput.slice();
  let rowNum = findRow(rows);
  let col = findCol(rows[rowNum]);
  const turnsTaken = new Set<string>();

  let direction: Direction = 'up';
  while (true) {
    const turn = turns[direction];
    const [rowMove, colMove] = moves[direction];
    const nextRowNum = rowNum + rowMove;
    const nextCol = col + colMove;
    const row = rows[nextRowNum];

    if (!row) break;

    const char = row[nextCol];
    if (!char) break;

    if (char === '#') {
      const turnForCache = `${rowNum},${col},${direction}`;
      if (turnsTaken.has(turnForCache)) {
        return true;
      }
      turnsTaken.add(turnForCache);
      direction = turn;
    } else {
      rowNum = nextRowNum;
      col = nextCol;
      const newRow = row.slice(0, col) + 'X' + row.slice(col + 1);
      rows[rowNum] = newRow;
    }
  }

  console.log('made it');

  return false;
}

const result2 = solvePart2();
console.log(result2);
