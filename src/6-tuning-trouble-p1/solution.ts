// https://adventofcode.com/2022/day/6

import path from "path";
import { getInput } from "../helpers/getInput";

const INPUT_FILE = path.join(__dirname, "./input.txt");
const SIZE = 4;

async function solution() {
    const input = await getInput(INPUT_FILE);
    let marker = 1; // marker to compare
    const len = input.length
    while (marker < len) {
        const set = new Set<string>();
        for (let i = marker; i > marker - SIZE; i--) {
            if (i < 0) {
                marker++; 
                break;
            }
            if (set.has(input[i])) {
                // has dupe
                // the solution will not contain input[i] cos that means it will contain input[marker] too
                // so we simply skip to make the start of the buffer does not contain that character.
                marker = i + SIZE;
                break; 
            }
            if (i === marker - SIZE + 1) { // no dupes found!
                console.log(marker + 1);
                return;
            }
            set.add(input[i]);
        }
    }
    console.log("No start-of-packet markers found!");
}

solution();
