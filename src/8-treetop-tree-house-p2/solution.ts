// https://adventofcode.com/2022/day/8

import path from "path";
import { getInput } from "../helpers/getInput";

const INPUT_FILE = path.join(__dirname, "./input.txt");

const enum Direction {
    LEFT = 0,
    DOWN = 1,
    RIGHT = 2,
    UP = 3
}

async function solution() {
    const input = await getInput(INPUT_FILE);
    const lines = input.split(/\r?\n/);
    // generate forest grid
    let forest: Tree[][] = lines.map(line => {
        const treeLine: Tree[] = [];
        for (let i = 0; i < line.length; i++) {
            const height = Number(line[i]);
            treeLine.push(new Tree(height));
        }
        return treeLine;
    });
    // check in 1 direction, then rotate.
    // do for all 4 directions.
    forest = checkFor1DirectionFromLeft(forest, Direction.LEFT);
    forest = rotateForestRight(forest);
    forest = checkFor1DirectionFromLeft(forest, Direction.DOWN);
    forest = rotateForestRight(forest);
    forest = checkFor1DirectionFromLeft(forest, Direction.RIGHT);
    forest = rotateForestRight(forest);
    forest = checkFor1DirectionFromLeft(forest, Direction.UP);
    forest = rotateForestRight(forest); // doesnt matter for now
    // get max score
    const maxScore = Math.max(...forest
        .flatMap(treeLine => treeLine
            .map(tree => tree.getScore())));

    console.log(maxScore);
}

function printForest(forest: Tree[][]) {
    const heights = forest.map(line => line.map(tree => tree.height));
    console.log(heights);
}

function checkFor1DirectionFromLeft(forest: Tree[][], direction: Direction) {
    return forest.map(treeLine => {
        // on edge
        treeLine[0].setDirectionScore(direction, 0);
        for (let i = 1; i < treeLine.length; i++) {
            // get closest that is greater than or equals
            const currHeight = treeLine[i].height;
            for (let j = i - 1; j >= 0; j--) {
                const otherHeight = treeLine[j].height;
                if (j > 0 && otherHeight < currHeight) continue;
                treeLine[i].setDirectionScore(direction, i - j);
                break;
            }
        }
        return treeLine;
    });
}

function rotateForestRight(forest: Tree[][]) {
    const length = forest.length;
    const height = forest[0].length;
    const newForest: Tree[][] = [];
    // transpose
    for (let x = 0; x < length; x++) {
        newForest[x] = [];
        for (let y = 0; y < height; y++) {
            newForest[x][y] = forest[y][x]
        }
    }
    // reverse row
    return newForest.map(arr => arr.reverse());
}

class Tree {
    height: number;
    visibleArray: number[] = [...new Array<number>(4)];
    constructor(height: number) {
        this.height = height;
    }

    getScore() {
        return this.visibleArray.reduce((x, y) => x * y);
    }

    getDirectionScore(direction: Direction) {
        return this.visibleArray[direction];
    }
    
    setDirectionScore(direction: Direction, score: number) {
        this.visibleArray[direction] = score;
    }
}

solution();
