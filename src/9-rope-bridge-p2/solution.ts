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
    let headCoordinateMovements = getHeadCoordinateMovements(lines);
    let tailMovements: { x: number, y: number }[];
    for (let i = 0; i < 9; i++) {
        tailMovements = simulateTailMovements(headCoordinateMovements);
        headCoordinateMovements = tailMovements;
    }
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

function getNewTailLocation(old_t_x: number, old_t_y: number, h_x: number, h_y: number): { x: number, y: number } {
    // must move left
    let new_x = old_t_x;
    let new_y = old_t_y;
    const x_diff = Math.abs(old_t_x - h_x);
    const y_diff = Math.abs(old_t_y - h_y);
    if (x_diff === 2 && y_diff === 2) {
        new_x = (old_t_x + h_x) / 2;
        new_y = (old_t_y + h_y) / 2;
    } else if (x_diff === 2) {
        new_x = (old_t_x + h_x) / 2;
        new_y = h_y;
    } else if (y_diff === 2) {
        new_x = h_x
        new_y = (old_t_y + h_y) / 2;
    }
    return {
        x: new_x,
        y: new_y
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
