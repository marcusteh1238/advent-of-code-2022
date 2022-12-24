// https://adventofcode.com/2022/day/5

import path from "path";
import { getInput } from "../helpers/getInput";

const INPUT_FILE = path.join(__dirname, "./input.txt");

async function solution() {
    const input = await getInput(INPUT_FILE);
    const { stacks, moves } = parseInput(input);
    for (let i = 0; i < moves.length; i++) {
        const {moveN, from, to } = moves[i];
        // move n boxes at the same time
        const removedFromIndex = stacks[from].length - moveN;
        const removed = stacks[from].splice(removedFromIndex);
        // insert boxes in order
        stacks[to] = stacks[to].concat(removed);
    }
    // print all the boxes on top
    const output = stacks.map(stack => stack.pop()).join('');
    console.log(output);
}

function parseInput(input: string) {
    const lines = input.split(/\r?\n/);
    // above this line are stacks
    // below this line are moves
    const numStacksLineIdx = lines.findIndex(line => line.startsWith(' 1'));
    const numStacks = lines[numStacksLineIdx].split(/ */).length - 2;
    const stackLines = lines.slice(0, numStacksLineIdx);
    const stacks = parseStacks(stackLines, numStacks);
    const moves = parseMoves(lines.slice(numStacksLineIdx + 2));
    return { stacks, moves };
}

function parseStacks(lines: string[], numStacks: number) {
    // init array of stacks
    const stacks: string[][] = [];
    for (let i = 0; i < numStacks; i++) {
        stacks.push([] as string[]);
    }
    // push boxes into stack, start from bottom of stack
    for (let i = lines.length - 1; i >= 0; i--) {
        // for each row
        const row = lines[i];
        for (let j = 0; j < numStacks; j++) {
            const box = row[4 * j + 1];
            if (box !== ' ') {
                // only push box into stack if it exists
                stacks[j].push(box);
            }
        }
    }
    return stacks;
}

function parseMoves(lines: string[]) {
    return lines.map(line => {
        // move x from y to z
        const tokens = line.split(' ');
        return {
            moveN: Number(tokens[1]),
            from: Number(tokens[3]) - 1,
            to: Number(tokens[5]) - 1
        };
    })
}

solution();
