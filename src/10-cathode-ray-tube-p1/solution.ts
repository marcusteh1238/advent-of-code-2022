// https://adventofcode.com/2022/day/8

import path from "path";
import { getInput } from "../helpers/getInput";

const INPUT_FILE = path.join(__dirname, "./input.txt");
const WANTED_CYCLES = [20, 60, 100, 140, 180, 220];

type ProgramState = {
    cycle: number;
    x: number;
}

async function solution() {
    const input = await getInput(INPUT_FILE);
    const states = getProgramStates(input);
    const signalStrengths = WANTED_CYCLES
        .map(cycle => states[cycle].x * cycle);
    const sum = signalStrengths.reduce((a, b) => a + b, 0);
    console.log(sum)
}

function getProgramStates(input: string) {
    const lines = input.split(/\r?\n/);
    let x = 1;
    let cycle = 0;
    const states: ProgramState[] = [{ cycle, x }];
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (line === 'noop') {
            cycle++;
            const state1 = { x, cycle }
            states.push(state1);
        } else { // addx V
            const v = Number(line.split(' ')[1]);
            cycle++;
            const state1 = { cycle, x }
            states.push(state1);
            cycle++;
            const state2 = { cycle, x }
            x += v;
            states.push(state2);
            
        }
    }
    return states;
}

solution();
