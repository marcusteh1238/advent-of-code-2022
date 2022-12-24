// https://adventofcode.com/2022/day/10

import path from "path";
import { getInput } from "../helpers/getInput";

const INPUT_FILE = path.join(__dirname, "./input.txt");
const CRT_WIDTH = 40;
const CRT_HEIGHT = 6;

type ProgramState = {
    cycle: number;
    x: number;
}

async function solution() {
    const input = await getInput(INPUT_FILE);
    const states = getProgramStates(input);
    const image: string[][] = [];
    let stateNum = 0;
    for (let h = 0; h < CRT_HEIGHT; h++) {
        image[h] = [];
        for (let pixel = 0; pixel < CRT_WIDTH; pixel++) {
            // figure out if pixel is lit
            // check if sprite is covering pixel
            // first check state where pixel is being drawn
            const state = states[++stateNum];
            image[h][pixel] = Math.abs(state.x - pixel) <= 1
                ? '#': '.';
        }
    }
    const img = image.map(row => row.join('')).join('\n');
    console.log(img);
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
