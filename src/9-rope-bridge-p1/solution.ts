// https://adventofcode.com/2022/day/9

import path from "path";
import { getInput } from "../helpers/getInput";

const INPUT_FILE = path.join(__dirname, "./input.txt");

enum Direction {
    UP = "U",
    RIGHT = "R",
    LEFT = "L",
    DOWN = "D"
}

function getHeadCoordinateMovements(lines: string[]) {
    let headCoordinates = {
        x: 0,
        y: 0
    }
    const headCoordinateMovements: {x: number, y: number}[] = [{x: 0, y: 0}]; 
    for (let i = 0; i < lines.length; i++) {
        const [directionStr, movesStr] = lines[i].split(' ');
        const direction = directionStr as Direction;
        const moves = Number(movesStr);
        for (let j = 0; j < moves; j++) {
            // first get new coordinates of head
            headCoordinates = moveHeadInDirection(headCoordinates.x, headCoordinates.y, direction);
            headCoordinateMovements.push(headCoordinates);
        }   
    }
    return headCoordinateMovements;    
}

async function solution() {
    const input = await getInput(INPUT_FILE);
    const lines = input.split(/\r?\n/);
    const headCoordinateMovements = getHeadCoordinateMovements(lines);
    const tailMovements = simulateTailMovements(headCoordinateMovements);
    const tileSet = new Set<string>(tailMovements.map(({x, y}) => `${x}_${y}`));
    console.log(tileSet.size);
}

function moveHeadInDirection(old_x: number, old_y: number, direction: Direction): { x: number, y: number } {
    switch (direction) {
        case Direction.DOWN:
            return {
                x: old_x, 
                y: old_y - 1
            };
        case Direction.UP:
            return {
                x: old_x, 
                y: old_y + 1
            };
        case Direction.LEFT:
            return {
                x: old_x - 1, 
                y: old_y
            };
        case Direction.RIGHT:
            return {
                x: old_x + 1, 
                y: old_y
            };
        default:
            throw Error("Invalid Direction!");
    }
}

function getNewTailLocation(old_t_x: number, old_t_y: number, x: number, y: number): { x: number, y: number } {
    // must move left
    if (old_t_x - x === 2) {
        return {
            x: old_t_x - 1,
            y: y
        };
    }
    // must move right
    if (old_t_x - x === -2) {
        return {
            x: old_t_x + 1,
            y: y
        };
    }
    // must move down
    if (old_t_y - y === 2) {
        return {
            x: x,
            y: old_t_y - 1
        };
    }
    // must move up
    if (old_t_y - y === -2) {
        return {
            x: x,
            y: old_t_y + 1
        };
    }
    return {
        x: old_t_x,
        y: old_t_y
    }
}

function simulateTailMovements(headCoordinateMovements: {x: number, y: number}[]): {x: number, y: number}[] {
    let tailCoordinates = {
        x: 0,
        y: 0
    }
    const tailCoordinateMovements: {x: number, y: number}[] = [];
    for (let i = 0; i < headCoordinateMovements.length; i++) {
        // now get new coordinates of tail
        const {x, y} = headCoordinateMovements[i];
        tailCoordinates = getNewTailLocation(tailCoordinates.x, tailCoordinates.y, x, y);
        tailCoordinateMovements.push(tailCoordinates);   
    }
    return tailCoordinateMovements;
}

solution();
