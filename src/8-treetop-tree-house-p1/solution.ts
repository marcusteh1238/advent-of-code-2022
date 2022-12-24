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
    // get num of visible trees
    const numVisibleTrees = forest
        .flatMap(treeLine => treeLine
            .filter(tree => tree.isVisible())).length;

    console.log(numVisibleTrees);
}

function printForest(forest: Tree[][]) {
    const heights = forest.map(line => line.map(tree => tree.height));
    console.log(heights);
}

function checkFor1DirectionFromLeft(forest: Tree[][], direction: Direction) {
    return forest.map(treeLine => {
        // on edge
        treeLine[0].setDirectionIsVisible(direction, true);
        let maxHeight = treeLine[0].height;
        // let maxHeightIndex = 0;
        for (let i = 1; i < treeLine.length; i++) {
            // check if is greater than everyone else
            const currHeight = treeLine[i].height;
            const isVisible = currHeight > maxHeight;
            treeLine[i].setDirectionIsVisible(direction, isVisible);
            if (isVisible) {
                maxHeight = currHeight;
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
    visibleArray: boolean[] = [...new Array<boolean>(4)];
    constructor(height: number) {
        this.height = height;
    }

    isVisible() {
        return this.visibleArray.some(x => x);
    }

    getDirectionScore(direction: Direction) {
        return this.visibleArray[direction];
    }
    
    setDirectionIsVisible(direction: Direction, isVisible: boolean) {
        this.visibleArray[direction] = isVisible;
    }
}

solution();
