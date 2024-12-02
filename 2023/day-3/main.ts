// --- Day 3: Rucksack Reorganization ---
// One Elf has the important job of loading all of the rucksacks with supplies for the jungle journey. Unfortunately, that Elf didn't quite follow the packing instructions, and so a few items now need to be rearranged.

// Each rucksack has two large compartments. All items of a given type are meant to go into exactly one of the two compartments. The Elf that did the packing failed to follow this rule for exactly one item type per rucksack.

// The Elves have made a list of all of the items currently in each rucksack (your puzzle input), but they need your help finding the errors. Every item type is identified by a single lowercase or uppercase letter (that is, a and A refer to different types of items).

// The list of items for each rucksack is given as characters all on a single line. A given rucksack always has the same number of items in each of its two compartments, so the first half of the characters represent items in the first compartment, while the second half of the characters represent items in the second compartment.

// For example, suppose you have the following list of contents from six rucksacks:

// vJrwpWtwJgWrhcsFMMfFFhFp
// jqHRNqRjqzjGDLGLrsFMfFZSrLrFZsSL
// PmmdzqPrVvPwwTWBwg
// wMqvLMZHhHMvwLHjbvcjnnSBnvTQFn
// ttgJtRGJQctTZtZT
// CrZsJsPPZsGzwwsLwLmpwMDw
// The first rucksack contains the items vJrwpWtwJgWrhcsFMMfFFhFp, which means its first compartment contains the items vJrwpWtwJgWr, while the second compartment contains the items hcsFMMfFFhFp. The only item type that appears in both compartments is lowercase p.
// The second rucksack's compartments contain jqHRNqRjqzjGDLGL and rsFMfFZSrLrFZsSL. The only item type that appears in both compartments is uppercase L.
// The third rucksack's compartments contain PmmdzqPrV and vPwwTWBwg; the only common item type is uppercase P.
// The fourth rucksack's compartments only share item type v.
// The fifth rucksack's compartments only share item type t.
// The sixth rucksack's compartments only share item type s.
// To help prioritize item rearrangement, every item type can be converted to a priority:

// Lowercase item types a through z have priorities 1 through 26.
// Uppercase item types A through Z have priorities 27 through 52.
// In the above example, the priority of the item type that appears in both compartments of each rucksack is 16 (p), 38 (L), 42 (P), 22 (v), 20 (t), and 19 (s); the sum of these is 157.

// Find the item type that appears in both compartments of each rucksack. What is the sum of the priorities of those item types?

import input from './input';

// items is a string like: wMqvLMZHhHMvwLHjbvcjnnSBnvTQFn
const getCommonItem = (items) => {
  const cache1 = {};
  const cache2 = {};
  const first = items.slice(0, items.length / 2);
  const second = items.slice(items.length / 2);
  console.log({ first, second });

  let pointer = 0;

  while (pointer < first.length) {
    const firstItem = first[pointer];
    if (cache2[firstItem]) {
      console.log(firstItem);
      return firstItem;
    }
    cache1[firstItem] = true;

    const secondItem = second[pointer];
    if (cache1[secondItem]) {
      console.log(secondItem);
      return secondItem;
    }

    cache2[secondItem] = true;

    pointer++;
  }
};

const solve = () => {
  const rucksacks = input.split('\n');
  const commonItems = rucksacks.map(getCommonItem);
  const score = commonItems.reduce((acc, curr) => acc + getScore(curr), 0);
  console.log(score);
};

const getScore = (char: string) => {
  const charCode = char.charCodeAt(0);

  // lowercase
  if (charCode > 96) {
    console.log(`${char}: has code ${charCode} and score ${charCode - 96}`);
    return charCode - 96;
  }

  // uppercase
  console.log(`${char}: has code ${charCode} and score ${charCode - 64 + 26}`);
  return charCode - 64 + 26;
};

const solve2 = () => {
  const rucksacks = input.split('\n');
  const groupsOfThree = getGroupsOfThree(rucksacks);
  const commonItems = groupsOfThree.map(findCommonItemInGroup);
  const score = commonItems.reduce((acc, curr) => acc + getScore(curr), 0);

  console.log(score);
};

const getGroupsOfThree = <X>(arr: Array<X>) => {
  const result = [];

  let groupOfThree = [];
  for (const el of arr) {
    groupOfThree.push(el);
    if (groupOfThree.length === 3) {
      result.push(groupOfThree);
      groupOfThree = [];
    }
  }

  return result;
};

const findCommonItemInGroup = ([first, second, third]) => {
  let logging = false;
  if (first === 'VVJGdSHZnnHdgFntcschhccvvPvtstPq') {
    logging = true;
    console.log(first);
    console.log(second);
    console.log(third);
  }
  const cache1 = {};
  const cache2 = {};
  const cache3 = {};

  let pointer = 0;
  while (pointer < first.length || pointer < second.length || pointer < third.length) {
    logging && console.log(pointer);
    if (pointer < first.length) {
      const char1 = first[pointer];
      logging && console.log(`char1: ${char1}`);
      if (cache2[char1] && cache3[char1]) {
        return char1;
      }
      cache1[char1] = true;
    }

    if (pointer < second.length) {
      const char2 = second[pointer];
      logging && console.log(`char2: ${char2}`);
      if (cache1[char2] && cache3[char2]) {
        return char2;
      }
      cache2[char2] = true;
    }

    if (pointer < third.length) {
      const char3 = third[pointer];
      logging && console.log(`char3: ${char3}`);
      if (cache2[char3] && cache1[char3]) {
        return char3;
      }
      cache3[char3] = true;
    }

    pointer++;
  }
};

solve2();
