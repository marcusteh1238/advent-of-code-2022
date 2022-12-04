// https://adventofcode.com/2022/day/2

import path from "path";
import { getInput } from "../helpers/getInput";

const INPUT_FILE = path.join(__dirname, "./input.txt");

async function solution() {
    const input = await getInput(INPUT_FILE);
    const pairs = input.split(/\r?\n/);
    const overlappedPairs = pairs.filter(pair => {
        const [a, b] = pair.split(",");
        const [a1, a2] = a.split("-").map(Number);
        const [b1, b2] = b.split("-").map(Number);
        return isFullOverlap(a1, a2, b1, b2) || 
            isFullOverlap(b1, b2, a1, a2);
    });
    const numPairs = overlappedPairs.length;
    console.log(numPairs);
}

// checks if the range a1-a2 totally covers b1-b2
function isFullOverlap(a1: number, a2: number, b1: number, b2: number) {
    return a1 <= b1 && a2 >= b2;
}

solution();
