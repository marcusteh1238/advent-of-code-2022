// https://adventofcode.com/2022/day/14

import path from "path";
import { getInput } from "../helpers/getInput";

const INPUT_FILE = path.join(__dirname, "./input.txt");
type Coordinates = { x: number, y: number };

const SAND_SOURCE: Coordinates = {x: 500, y: 0};

enum MapObject {
    SOURCE = '+',
    SAND = 'O',
    ROCK = '#',
    NONE = '.'
}

async function solution() {
    const input = await getInput(INPUT_FILE);
    const map = createMap(input);
    const count = map.getSandCount();
    console.log(count);
}

function createMap(input: string) {
    let paths = input
        .split(/\r?\n/)
        .map(pathStr => Path.pathFromPathStr(pathStr));
    const maxY = Math.max(getMax(paths.map(path => path.maxY)), 0);
    // we translate the entire map so we start from 0 on both sides
    const minY = Math.min(getMin(paths.map(path => path.minY)), 0);
    const newPath = new Path([{x: 0, y: maxY + 2}, {x: 1000, y: maxY + 2}]);
    paths.push(newPath);
    const minX = getMin(paths.map(path => path.minX));
    const newPaths = paths.map(p => p.translatePath(-minX, -minY));
    const source: Coordinates = {
        x: SAND_SOURCE.x - minX,
        y: SAND_SOURCE.y - minY
    };
    // map is represented by double array
    // each point represented as map[x][y]
    return new Map(newPaths, source);
}

class Path {
    minX: number;
    minY: number;
    maxX: number;
    maxY: number;
    pathCoords: Coordinates[];

    constructor(coordinates: Coordinates[]) {
        this.pathCoords = coordinates;
        const allX = coordinates.map(({x}) => x);
        const allY = coordinates.map(({y}) => y);
        this.minX = getMin(allX);
        this.minY = getMin(allY);
        this.maxX = getMax(allX);
        this.maxY = getMax(allY);
    }

    static pathFromPathStr(pathStr: string) {
        const pathCoords = pathStr.split(' -> ').map(coordStr => {
            const [x,y] = coordStr.split(',').map(Number);
            return {x, y};
        });
        return new Path(pathCoords);
    }

    translatePath(x: number, y: number) {
        const newPathCoords = this.pathCoords
        .map(coords => ({
            x: coords.x + x,
            y: coords.y + y
        }));
        return new Path(newPathCoords);
    }
}

class Map {
    maxX: number;
    maxY: number;
    grid: MapObject[][];
    source: Coordinates;

    constructor(paths: Path[], source: Coordinates) {
        this.source = source;
        this.maxX = getMax(paths.map(path => path.maxX));
        this.maxY = getMax(paths.map(path => path.maxY));
        // map is represented by double array
        // each point represented as map[x][y]
        const grid = Map.getEmptyGrid(this.maxX, this.maxY);
        // placing rocks
        paths.forEach(path => {
            const pathCoords = path.pathCoords
            // draw path on map
            for (let i = 0; i < pathCoords.length - 1; i++) {
                const start = pathCoords[i];
                const end = pathCoords[i + 1];
                // check vertical?
                const isVertical = start.x === end.x;
                if (isVertical) {
                    const min = Math.min(start.y, end.y);
                    const max = Math.max(start.y, end.y);
                    for (let j = min; j <= max; j++) {
                        grid[start.x][j] = MapObject.ROCK;
                    }
                } else {
                    const min = Math.min(start.x, end.x);
                    const max = Math.max(start.x, end.x);
                    for (let j = min; j <= max; j++) {
                        grid[j][start.y] = MapObject.ROCK;
                    }
                }
            }
        });
        this.grid = grid;
    }

    getSandCount() {
        let count = 0;
        while(!this.dropSand()) {
            count++;
        }
        return count;
    }

    dropSand(): boolean {
        let prev: Coordinates;
        let curr: boolean | Coordinates = this.source;
        while (typeof curr !== "boolean") {
            prev = curr;
            curr = this.dropSandTick(prev);
        }
        if (!curr) {
            this.placeMapObjAtCoords(prev, MapObject.SAND);
        }
        return curr;
    }

    /**
     * @returns true if void below, false if at rest, next coords if still falling down.
     */
    dropSandTick(curr: Coordinates): boolean | Coordinates {
        // check if tile below is blocked.
        const belowCoords: Coordinates = { x: curr.x, y: curr.y + 1 };
        if (this.isOffGrid(belowCoords)) return true;
        if (this.isOpen(belowCoords)) return belowCoords;

        const downLeftCoords: Coordinates = { x: curr.x - 1, y: curr.y + 1 }
        if (this.isOffGrid(downLeftCoords)) return true;
        if (this.isOpen(downLeftCoords)) return downLeftCoords;
        
        const downRightCoords: Coordinates = { x: curr.x + 1, y: curr.y + 1 }
        if (this.isOffGrid(downRightCoords)) return true;
        if (this.isOpen(downRightCoords)) return downRightCoords;

        return !this.isOpen(curr);
    }

    isOffGrid(coords: Coordinates) {
        return coords.x < 0 || coords.y < 0 || coords.x > this.maxX || coords.y > this.maxY;
    }

    isOpen(coords: Coordinates) {
        const mapObj = this.getMapObjAtCoords(coords);
        return mapObj === MapObject.NONE;
    }

    static getEmptyGrid(maxX: number, maxY: number): MapObject[][] {
        const grid: MapObject[][] = [...new Array<string[]>(maxX + 1)]
        .map(() => ([...new Array<string>(maxY + 1)]
            .map(() => MapObject.NONE)));
        return grid;
    }
    
    getMapObjAtCoords({x, y}: Coordinates) {
        return this.grid[x][y];
    }

    placeMapObjAtCoords({x, y}: Coordinates, obj: MapObject) {
        this.grid[x][y] = obj;
    }

    print() {
        const transposed = Map.getEmptyGrid(this.maxX, this.maxY);
        for (let x = 0; x <= this.maxX; x++) {
            for (let y = 0; y <= this.maxY; y++) {
                transposed[x][y] = this.grid[y][x];
            }
        }
        transposed[this.source.y][this.source.x] = MapObject.SOURCE;
        const mapStr = transposed
            .map(arr => arr.join('')).join('\n');
        
        console.log(mapStr);
    }

}

function getMin(numArr: number[]) {
    return numArr.reduce((x, y) => Math.min(x, y), Infinity);
}

function getMax(numArr: number[]) {
    return numArr.reduce((x, y) => Math.max(x, y), -Infinity);
}
solution();
