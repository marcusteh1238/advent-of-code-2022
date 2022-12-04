// https://adventofcode.com/2022/day/2

import path from "path";
import { getInput } from "../helpers/getInput";

const INPUT_FILE = path.join(__dirname, "./input.txt");
const LETTERS = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
async function solution() {
    const input = await getInput(INPUT_FILE);
    const rucksacks = input.split(/\r?\n/);
    const priorities = rucksacks.map(rucksack => {
        // create set for first one
        const set1 = new Set<string>();
        const len = rucksack.length / 2;
        for (let i = 0; i < len; i++) {
            set1.add(rucksack[i]);
        }
        // then compare with second one
        for (let j = len; j < rucksack.length; j++) {
            if (set1.has(rucksack[j])) {
                return LETTERS.indexOf(rucksack[j]) + 1;
            }
        }
        // if reached here, there's no dupe character detected.
        throw Error("Does not contain duplicate characters.");
    });
    const total = priorities.reduce((prev, curr) => prev + curr, 0);
    console.log(total);
}

solution();
