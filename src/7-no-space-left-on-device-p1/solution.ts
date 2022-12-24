// https://adventofcode.com/2022/day/7

import path from "path";
import { getInput } from "../helpers/getInput";

const INPUT_FILE = path.join(__dirname, "./input.txt");
const SIZE_THRESHOLD = 100000;

async function solution() {
    const input = await getInput(INPUT_FILE);
    const root = parseInput(input);
    // now find all of the directories with a total size of at most 100000
    const dirs = getDirsBelowSizeThreshold(root, true);
    const totalSizeSum = dirs.map(dir => dir.getSize()).reduce((x, y) => x + y, 0);
    console.log(totalSizeSum);
}

function getDirsBelowSizeThreshold(directory: IDirectory, isRoot = false): IDirectory[] {
    if (directory.subDirs.length === 0) {
        return [];
    }
    const allDirs = [];
    if (isRoot) {
        if (directory.getSize() <= SIZE_THRESHOLD) {
            allDirs.push(directory);
        }
    }
    const directSubDirs = directory.subDirs.filter(dir => dir.getSize() <= SIZE_THRESHOLD);
    const recursed = directory.subDirs
    .map(dir => getDirsBelowSizeThreshold(dir))
    .reduce((x, y) => x.concat(y), []);
    return allDirs.concat(directSubDirs).concat(recursed);
}

function parseInput(input: string) {
    const lines = input.split(/\r?\n/);
    const root = new IDirectory('/', null);
    let currDir = root;
    for (let i = 0; i < lines.length; i++) {
        let line = lines[i];
        if (line === '$ ls') { // ls command
            // go next line
            i++;
            while (i < lines.length) {
                line = lines[i];
                if (line.startsWith('$')) {
                    i--;
                    break;
                }
                // line can be 'dir {x}' or '{size} {file name}'
                if (line.startsWith('dir')) {
                    // is directory
                    const dirname = line.split(' ')[1];
                    const dir = new IDirectory(dirname, currDir);
                    currDir.subDirs.push(dir);
                } else { // is file
                    const [sizeStr, filename] = line.split(' ');
                    const file = new IFile(filename, Number(sizeStr));
                    currDir.files.push(file);
                }
                i++;
            }
        } else if (line.startsWith('$ cd')) { // cd command
            const arg = line.split(' ')[2];
            if (arg === '..') {
                // move up one level
                currDir = currDir.parent;
            } else if (arg === '/') {
                // move to root
                currDir = root;
            } else {
                // move to specified directory
                let dir = currDir.subDirs.find(d => d.name === arg);
                if (!dir) {
                    // ls was not run, just create new directory and add it
                    const newDir = new IDirectory(arg, currDir);
                    currDir.subDirs.push(newDir);
                    dir = newDir;
                }
                currDir = dir;
            }
        }
    }
    return root;
}

class IDirectory {
    name: string;
    size: number | null = null;
    subDirs: IDirectory[] = [];
    files: IFile[] = [];
    parent: IDirectory | null;

    constructor(name: string, parent: IDirectory | null) {
        this.name = name;
        this.parent = parent;
    }

    getSize(): number {
        if (this.size !== null) return this.size;
        const subDirSizes = this.subDirs
            .map(dir => dir.getSize())
            .reduce((x, y) => x + y, 0);
        const fileSizes = this.files
            .map(file => file.size)
            .reduce((x, y) => x + y, 0);
        const size = subDirSizes + fileSizes;
        this.size = size;
        return size;
    }
}

class IFile {
    name: string;
    size: number;
    
    constructor(name: string, size: number) {
        this.name = name;
        this.size = size;
    }
}


solution();
