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
    ["C", SHAPE.SCISSORS]
]);

const LETTER_TO_OUTCOME: Map<string, OUTCOME> = new Map<string, OUTCOME>([
    ["X", OUTCOME.LOSE],
    ["Y", OUTCOME.DRAW],
    ["Z", OUTCOME.WIN]
]);

async function solution() {
    const input = await getInput(INPUT_FILE);
    const arr = input.split(/\r?\n/);
    const scorePerRound = arr.map(line => {
        const [otherChoiceStr, wantedOutcomeStr] = line.split(" ");
        const wantedOutcome = LETTER_TO_OUTCOME.get(wantedOutcomeStr);
        const otherChoice = LETTER_TO_SHAPE.get(otherChoiceStr);
        const myChoice = getChoiceFromOutcome(otherChoice, wantedOutcome);
        return myChoice + wantedOutcome; // score = shape score + outcome score
    });
    const totalScore = scorePerRound.reduce((prev, curr) => prev + curr, 0);
    console.log(totalScore);
}

function getChoiceFromOutcome(otherChoice: SHAPE, outcome: OUTCOME): SHAPE {
    if (outcome === OUTCOME.DRAW) {
        return otherChoice;
    }
    const diff = outcome === OUTCOME.LOSE ? 2 : 1;
    const choice = (otherChoice + diff) % 3;
    return choice === 0 ? 3 : choice;
}

solution();
