// https://adventofcode.com/2022/day/2

import path from "path";
import { getInput } from "../helpers/getInput";

const INPUT_FILE = path.join(__dirname, "./input.txt");

enum SHAPE {
    ROCK = 1,
    PAPER = 2,
    SCISSORS = 3
}

enum OUTCOME {
    WIN = 6,
    DRAW = 3,
    LOSE = 0
}

const LETTER_TO_SHAPE: Map<string, SHAPE> = new Map<string, SHAPE>([
    ["A", SHAPE.ROCK],
    ["B", SHAPE.PAPER],
    ["C", SHAPE.SCISSORS],
    ["X", SHAPE.ROCK],
    ["Y", SHAPE.PAPER],
    ["Z", SHAPE.SCISSORS]
]);

async function solution() {
    const input = await getInput(INPUT_FILE);
    const arr = input.split(/\r?\n/);
    const scorePerRound = arr.map(line => {
        const [otherChoice, myChoice] = line
        .split(" ")
        .map(choice => LETTER_TO_SHAPE.get(choice)); // get assigned shape from the letter played
        return myChoice + outcome(myChoice, otherChoice); // score = shape score + outcome score
    });
    const totalScore = scorePerRound.reduce((prev, curr) => prev + curr, 0);
    console.log(totalScore);
}

function outcome(myChoice: SHAPE, otherChoice: SHAPE) {
    const result = (3 + myChoice - otherChoice) % 3;
    switch (result) {
        case 0:
            return OUTCOME.DRAW;
        case 1:
            return OUTCOME.WIN;
        default: // 2
            return OUTCOME.LOSE;
    }
}

solution();
