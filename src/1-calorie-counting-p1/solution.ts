// https://adventofcode.com/2022/day/1

import path from "path";
import { getInput } from "../helpers/getInput";

const INPUT_FILE = path.join(__dirname, "./input.txt");

async function solution() {
    const input = await getInput(INPUT_FILE);
    const arr = input.split(/\r?\n/);
    const len = arr.length;
    let max = -1; // value of max bundle size
    let curr = 0; // value of current bundle
    for (let i = 0; i < len; i++) {
        const foodItem = arr[i];
        if (foodItem === "") { // is blank line, end of bundle
            if (curr > max) {
                max = curr;
            }
            curr = 0;
            continue;
        }
        curr += Number(foodItem);
    }
    console.log(max); // return max bundle
}

solution()
