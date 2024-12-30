import input from './input';

const solve = (input: string) => {
  const disk = diskMapToDisk(input);
  const rearranged = rearrangeDiskByBlock(disk);
  return calcCheckSum(rearranged);
};

function diskMapToDisk(input: string) {
  let disk: Array<string> = [];
  let id = 0;
  for (let i = 0; i < input.length; i++) {
    // Number in the map represents the number of times it should be addded
    const char = Number(input[i]);
    const arr = new Array(char);

    if (i % 2 === 0) {
      disk = disk.concat(arr.fill(id));
      id++;
    } else {
      disk = disk.concat(arr.fill('.'));
    }
  }

  return disk;
}

function rearrangeDiskByBlock(disk: Array<string>) {
  const result = disk.slice();
  let start = 0;
  let end = disk.length - 1;

  while (start < end) {
    const startChar = result[start];
    const endChar = result[end];
    if (startChar !== '.') {
      start++;
      continue;
    }
    if (endChar === '.') {
      end--;
      continue;
    }

    result[start] = endChar;
    result[end] = startChar;
  }

  return result;
}

/**************************************************************
 *  1) Parse input into disk blocks
 **************************************************************/

/**
 * Converts the puzzle’s dense disk-map string (e.g. "12345") into an
 * array of characters, each representing either a file block (digit)
 * or a free block ('.').
 *
 * For "12345", we get:
 *   i=0 => '1' => file ID 0 => length=1 => [ '0' ]
 *   i=1 => '2' => '.' => length=2 => [ '.', '.' ]
 *   i=2 => '3' => file ID 1 => length=3 => [ '1', '1', '1' ]
 *   i=3 => '4' => '.' => length=4 => [ '.', '.', '.', '.' ]
 *   i=4 => '5' => file ID 2 => length=5 => [ '2','2','2','2','2' ]
 *
 * Returns the resulting array.
 */
function diskMapToDisk(input: string): string[] {
  const disk: string[] = [];
  let currentFileID = 0;

  for (let i = 0; i < input.length; i++) {
    const length = Number(input[i]);

    if (i % 2 === 0) {
      // even index => file blocks
      for (let j = 0; j < length; j++) {
        disk.push(String(currentFileID));
      }
      currentFileID++;
    } else {
      // odd index => free blocks
      for (let j = 0; j < length; j++) {
        disk.push('.');
      }
    }
  }

  return disk;
}

/**************************************************************
 *  2) Identify/move files in descending ID order
 **************************************************************/

/**
 * This function finds all *unique* file IDs on the disk (digits),
 * sorts them descending, and returns them as an array of numbers.
 */
function gatherFileIDs(disk: string[]): number[] {
  const set = new Set<number>();
  for (const c of disk) {
    if (c !== '.') {
      set.add(Number(c));
    }
  }
  return Array.from(set).sort((a, b) => b - a); // descending
}

/**
 * Finds where file 'id' is currently located on the disk
 * (assuming it’s contiguous). Returns { start, length }.
 *
 * If the file isn't found, returns { start: -1, length: 0 }.
 */
function findCurrentFilePosition(disk: string[], id: number): { start: number; length: number } {
  const idStr = String(id);
  let start = -1;
  let length = 0;

  for (let i = 0; i < disk.length; i++) {
    if (disk[i] === idStr) {
      if (start === -1) {
        start = i;
        length = 1;
      } else {
        length++;
      }
    }
  }

  return { start, length };
}

/**
 * Finds the leftmost free-space segment of length >= neededLength
 * that lies entirely *before* fileStart (strictly to the left).
 *
 * Returns the index of the start of that segment, or -1 if none.
 */
function findLeftmostFreeBlock(disk: string[], fileStart: number, neededLength: number): number {
  if (fileStart <= 0) return -1;
  if (neededLength <= 0) return -1;

  let i = 0;
  while (i < fileStart) {
    // Skip over any used blocks
    while (i < fileStart && disk[i] !== '.') {
      i++;
    }
    // now disk[i] is '.' or i == fileStart
    if (i >= fileStart) break;

    const segmentStart = i;
    let freeLen = 0;
    while (i < fileStart && disk[i] === '.') {
      freeLen++;
      i++;
    }
    // Now [segmentStart..i-1] is free
    if (freeLen >= neededLength) {
      return segmentStart;
    }
  }
  return -1;
}

/**
 * Moves the entire file (id) in one contiguous block from oldStart..oldStart+length-1
 * to newStart..newStart+length-1, clearing out the old location to '.'.
 *
 * This preserves the file block order exactly (no reversal).
 */
function moveFileBlocks(disk: string[], id: number, oldStart: number, newStart: number, length: number): void {
  const idStr = String(id);

  // 1) Clear the old location
  for (let i = 0; i < length; i++) {
    disk[oldStart + i] = '.';
  }

  // 2) Write the file ID in the new location
  for (let i = 0; i < length; i++) {
    disk[newStart + i] = idStr;
  }
}

/**
 * Rearrange the disk for Part 2:
 *   - Sort file IDs in descending order
 *   - For each file:
 *       1. find its *current* location on the disk
 *       2. look to the left for a free block big enough
 *       3. if found, move the file (all at once)
 *       4. if not found, do nothing
 */
function rearrangeDiskPart2(disk: string[]): string[] {
  const result = disk.slice(); // copy
  const fileIDs = gatherFileIDs(result); // in descending order

  for (const fileID of fileIDs) {
    // Step 1: find where this file is now
    const { start, length } = findCurrentFilePosition(result, fileID);
    if (start === -1 || length === 0) {
      // file not found or empty
      continue;
    }

    // Step 2: find leftmost free block big enough, strictly to the left
    const freeStart = findLeftmostFreeBlock(result, start, length);
    if (freeStart !== -1) {
      // Step 3: move it!
      moveFileBlocks(result, fileID, start, freeStart, length);
    }
  }

  return result;
}

/**************************************************************
 *  3) Compute checksum
 **************************************************************/

/**
 * Checksums the final disk by summing (fileID * index) for each file block.
 */
function calcCheckSum(disk: string[]): number {
  let sum = 0;
  for (let i = 0; i < disk.length; i++) {
    if (disk[i] === '.') continue;
    const id = Number(disk[i]);
    sum += id * i;
  }
  return sum;
}

/**************************************************************
 *  4) End-to-end solver for PART 2
 **************************************************************/

/**
 * Puts it all together:
 *   - Convert input string to disk
 *   - Rearrange with part 2 rules
 *   - Calculate checksum
 */
function solvePart2(input: string): number {
  const disk = diskMapToDisk(input);
  const rearranged = rearrangeDiskPart2(disk);
  return calcCheckSum(rearranged);
}

const result2 = solvePart2(input);
console.log(result2);
