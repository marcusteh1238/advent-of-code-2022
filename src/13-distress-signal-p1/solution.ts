// https://adventofcode.com/2022/day/13

import path from "path";
import { getInput } from "../helpers/getInput";

const INPUT_FILE = path.join(__dirname, "./input.txt");

type PacketData = number | Array<number | PacketData>;

async function solution() {
    const input = await getInput(INPUT_FILE);
    const lines = input.split(/\r?\n\r?\n/);
    const pairs = lines.map(pairStr => pairStr.split(/\r?\n/).map(str => JSON.parse(str) as PacketData));
    let sum = 0;
    for (let i = 0; i < pairs.length; i++) {
        if (isInOrder(pairs[i][0], pairs[i][1]) !== false) {
            sum += i + 1;
        }
    }
    console.log(sum)
}

function isInOrder(left: PacketData, right: PacketData): null | boolean {
    if (typeof left === 'number' && typeof right === 'number') {
        if (left === right) return null;
        return left < right;
    }
    if (typeof left === 'number') return isInOrder([left], right);
    if (typeof right === 'number') return isInOrder(left, [right]);
    for (let i = 0; i < left.length; i++) {
        if (i === right.length) return false;
        const check = isInOrder(left[i], right[i]);
        if (check !== null) return check;
    }
    if (right.length > left.length) return true;
    return null
}

solution();
