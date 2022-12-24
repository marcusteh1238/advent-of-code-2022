// https://adventofcode.com/2022/day/3

import path from "path";
import { getInput } from "../helpers/getInput";

const INPUT_FILE = path.join(__dirname, "./input.txt");
const LETTERS = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
async function solution() {
    const input = await getInput(INPUT_FILE);
    const rucksacks = input.split(/\r?\n/);
    const groups: string[][] = [];
    let group = [];
    // groups of 3
    for (let i = 0; i < rucksacks.length; i++) {
        group.push(rucksacks[i]);
        if ((i + 1) % 3 === 0) {
            groups.push(group);
            group = [];
        }
    }
    const priorities = groups.map(group => {
        // create set for first one
        const set1 = new Set<string>();
        for (let i = 0; i < group[0].length; i++) {
            set1.add(group[0][i]);
        }
        // then compare with second one
        const set2 = new Set<string>();
        for (let j = 0; j < group[1].length; j++) {
            if (set1.has(group[1][j])) {
                set2.add(group[1][j]);
            }
        }
        for (let k = 0; k < group[2].length; k++) {
            if (set2.has(group[2][k])) {
                return LETTERS.indexOf(group[2][k]) + 1;
            }
        }
        // if reached here, there's no dupe character detected.
        throw Error("Does not contain duplicate characters.");
    });
    const total = priorities.reduce((prev, curr) => prev + curr, 0);
    console.log(total);
}

solution();
