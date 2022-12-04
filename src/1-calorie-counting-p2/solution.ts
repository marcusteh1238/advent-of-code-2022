import path from "path";
import { getInput } from "../helpers/getInput";

const INPUT_FILE = path.join(__dirname, "./input.txt");

async function solution() {
    const input = await getInput(INPUT_FILE);
    const arr = input.split(/\r?\n/);
    const len = arr.length;
    const top3: number[] = [];
    
    return top3.reduce((prev, curr) => prev + curr, 0); // sum of top3
}

solution();
