import input from './input';

const ROCK = 'A';
const PAPER = 'B';
const SCISSORS = 'C';

const points = {
  X: 1, // => Rock
  Y: 2, // => Paper
  Z: 3, // => Scissorss
};

const first = () => {
  const pairs = input.split('\n').map((str) => str.split(' '));
  const scores = pairs.map(([theirs, ours]) => {
    let score = points[ours];
    // draw

    if (ours === 'X') {
      if (theirs === SCISSORS) {
        return score + 6;
      } else if (theirs === ROCK) {
        return score + 3;
      } else {
        return score;
      }
    }

    if (ours === 'Y') {
      if (theirs === ROCK) {
        return score + 6;
      } else if (theirs === PAPER) {
        return score + 3;
      } else {
        return score;
      }
    }

    // ours is 'Z'
    if (theirs === PAPER) {
      return score + 6;
    } else if (theirs === SCISSORS) {
      return score + 3;
    } else {
      return score;
    }
  });

  const sum = scores.reduce((acc, curr) => acc + curr, 0);
  console.log(sum);
};

const LOSE = 'X';
const TIE = 'Y';
const WIN = 'Z';

const POINTS_2 = {
  ROCK: 1,
  PAPER: 2,
  SCISSORS: 3,
};

const second = () => {
  const pairs = input.split('\n').map((str) => str.split(' '));
  const scores = pairs.map(([theirs, ours]) => {
    if (ours === LOSE) {
      if (theirs === ROCK) {
        return POINTS_2.SCISSORS;
      } else if (theirs === SCISSORS) {
        return POINTS_2.PAPER;
      } else {
        return POINTS_2.ROCK;
      }
    }

    if (ours === TIE) {
      if (theirs === ROCK) {
        return POINTS_2.ROCK + 3;
      } else if (theirs === SCISSORS) {
        return POINTS_2.SCISSORS + 3;
      } else {
        return POINTS_2.PAPER + 3;
      }
    }

    // ours === WIN
    if (theirs === ROCK) {
      return POINTS_2.PAPER + 6;
    } else if (theirs === SCISSORS) {
      return POINTS_2.ROCK + 6;
    } else {
      return POINTS_2.SCISSORS + 6;
    }
  });

  const sum = scores.reduce((acc, curr) => acc + curr, 0);
  console.log(sum);
};

second();
