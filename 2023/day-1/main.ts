import calories from './input';

(() => {
  const singleStringPerElves = calories.split('\n\n');
  const arrofArrs = singleStringPerElves.map((str) => str.split('\n'));
  const nums = arrofArrs.map((calories) => calories.map((str) => +str));
  const sums = nums.map((calories) => calories.reduce((acc, curr) => acc + curr, 0));
  const sortedSums = sums.sort((a, b) => b - a);
  console.log(sortedSums);
  const topThree = sortedSums.slice(0, 3);
  console.log(topThree);
  const topThreeSum = topThree.reduce((acc, curr) => acc + curr, 0);
  console.log(topThreeSum);
})();
