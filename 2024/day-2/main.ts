// import input from './input';

const input = '40 44 45 47 48 50 50';

const isSafe = (report: Array<number>) => {
  const isIncreasing = report[0] < report[1];
  for (let i = 1; i < report.length; i++) {
    const prevNum = report[i - 1];
    const num = report[i];
    const diff = Math.abs(num - prevNum);
    if (diff > 3 || diff < 1) return false;

    const isCurrIncreasing = num > prevNum;
    if (isIncreasing && !isCurrIncreasing) return false;
    if (!isIncreasing && isCurrIncreasing) return false;
  }

  return true;
};

const getSubsets = (report: Array<number>, index1: number, index2: number) => {
  const first = [...report.slice(0, index1), ...report.slice(index1 + 1)];
  const second = [...report.slice(0, index2), ...report.slice(index2 + 1)];
  return [first, second];
};

const isSafeWithTolerance = (report: Array<number>) => {
  const isIncreasing = report[0] < report[1];
  for (let i = 1; i < report.length; i++) {
    const prevNum = report[i - 1];
    const num = report[i];
    const diff = Math.abs(num - prevNum);
    const diffSizeWrong = diff > 3 || diff < 1;

    const isCurrIncreasing = num > prevNum;
    const isInconsistent = (isIncreasing && !isCurrIncreasing) || (!isIncreasing && isCurrIncreasing);

    if (isInconsistent || diffSizeWrong) {
      const [first, second] = getSubsets(report, i - 1, i);
      console.log({ first, second, isInconsistent, diffSizeWrong, i, i1: i - 1 });
      return isSafe(first) || isSafe(second);
    }
  }

  return true;
};

const calcSafeReports = () => {
  const lines = input.split('\n');
  const reports = lines.map((reportStr) => reportStr.split(' ').map(Number));
  return reports.reduce((acc, curr) => {
    const safe = isSafeWithTolerance(curr);
    return safe ? acc + 1 : acc;
  }, 0);
};

const result = calcSafeReports();
console.log(result);
