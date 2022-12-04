// https://adventofcode.com/2022/day/1

import path from "path";
import { getInput } from "../helpers/getInput";

const INPUT_FILE = path.join(__dirname, "./input.txt");
const TOP_N = 3;

async function solution() {
    const input = await getInput(INPUT_FILE);
    const arr = input.split(/\r?\n/);
    const len = arr.length;
    // For large N, using a heap would be better but this is sufficient for N=3
    let topN: number[] = [];
    let lowestIndex = -1;
    let curr = 0; // value of current bundle
    for (let i = 0; i < len; i++) {
        const foodItem = arr[i];
        if (foodItem !== "") { // is blank line, end of bundle
            curr += Number(foodItem);
            if (i < len - 1) { // consider bundle when last element
                continue;
            }
        }
        // add to top N?
        if (topN.length < TOP_N) { // always add if arr size < N
            topN.push(curr);
            lowestIndex = getLowestIndex(topN);
            curr = 0;
            continue;
        }
            
        if (curr < topN[lowestIndex]) {
            curr = 0;
            continue;
        }
        // larger than lowest in top N, replace it
        topN[lowestIndex] = curr;
        lowestIndex = getLowestIndex(topN);
        curr = 0;
    }
    // sum up
    const totalN = topN.reduce((prev, curr) => prev + curr, 0); // sum of top3
    console.log(totalN);
}

// get the lowest calorie bundle in the top N bundles.
function getLowestIndex(topN: number[]) {
    let len = topN.length;
    let lowestIndex = 0;
    for (let i = 0; i < len; i++) {
        if (topN[i] < topN[lowestIndex]) {
            lowestIndex = i;
        }
    }
    return lowestIndex;
}

solution();
