// https://adventofcode.com/2022/day/12

import path from "path";
import { getInput } from "../helpers/getInput";

const INPUT_FILE = path.join(__dirname, "./input.txt");

type Coordinate = {
    x: number;
    y: number;
}

async function solution() {
    const input = await getInput(INPUT_FILE);
    const lines = input.split(/\r?\n/);
    const forest = new BFSForest(lines);
    const pathVerticies = forest.getPath();
    console.log(pathVerticies.length - 1);
}

class BFSForest {
    grid: Tree[][];
    start: Tree;
    end: Tree;
    maxX: number;
    maxY: number;

    constructor(lines: string[]) {
        const grid: Tree[][] = [];
        this.maxX = lines.length - 1;
        this.maxY = lines[0].length - 1;
        for (let i = 0; i < lines.length; i++) {
            grid[i] = [];
            const treeLine = lines[i];
            for (let j = 0; j < treeLine.length; j++) {
                const char = treeLine[j];
                const tree = new Tree(i, j, char.charCodeAt(0) - 'a'.charCodeAt(0));
                if (char === 'S') {
                    tree.height = 0;
                    this.start = tree;
                } else if (char === 'E') {
                    tree.height = 'z'.charCodeAt(0) - 'a'.charCodeAt(0);
                    this.end = tree;
                }
                grid[i][j] = tree;
            }
        }
        this.grid = grid;
    }

    getPath() {
        const visited: Tree[] = [];
        let queue: Tree[] = [this.start];
        while (queue.length > 0) {
            const tree = queue.shift();
            if (visited.some(t => t.is(tree))) continue;
            visited.push(tree);
            if (tree.is(this.end)) break;
            // now get unvisited neighbours
            const unvisited = this.getUnvisitedNeighbours(tree, visited);
            unvisited.forEach(t => t.prev = tree);
            queue = queue.concat(unvisited);
        }

        let prev = this.end;
        const path: Tree[] = [];
        while (prev) {
            path.push(prev);
            prev = prev.prev;
        }
        return path.reverse();
    }

    getUnvisitedNeighbours(tree: Tree, visited: Tree[]) {
        const possibleNeighbourTrees: Tree[] = [
            { x: tree.x + 1, y: tree.y },
            { x: tree.x - 1, y: tree.y },
            { x: tree.x, y: tree.y + 1 },
            { x: tree.x, y: tree.y - 1 }
        ].filter(({ x, y }) => {
            if (x < 0 || y < 0) return false;
            if (x > this.maxX || y > this.maxY) return false;
            return true;
        }).map(t => this.grid[t.x][t.y]);
        const unvisited = possibleNeighbourTrees
            .filter(t => !visited.some(other => other.is(t)));
        return unvisited.filter(t => t.height - tree.height <= 1);
    }


}

class Tree {
    x: number;
    y: number;
    height: number;
    prev?: Tree;

    constructor(x: number, y: number, height: number) {
        this.x = x;
        this.y = y;
        this.height = height;
    }

    is(other: Tree) {
        return this.x === other.x && this.y === other.y;
    }
}

solution();
