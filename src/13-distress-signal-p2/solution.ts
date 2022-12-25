// https://adventofcode.com/2022/day/13

import path from "path";
import { getInput } from "../helpers/getInput";

const INPUT_FILE = path.join(__dirname, "./input.txt");

type PacketData = number | Array<number | PacketData>;

async function solution() {
    const input = await getInput(INPUT_FILE);
    const lines = input.split(/\r?\n\r?\n/);
    const allPackets = lines.flatMap(pairStr => pairStr.split(/\r?\n/).map(str => JSON.parse(str) as PacketData));
    allPackets.push([[2]]);
    allPackets.push([[6]]);
    allPackets.sort((left, right) => {
        const output = isInOrder(left, right);
        if (output) return -1;
        return output === false ? 1 : 0
    });
    const p1 = allPackets.findIndex(x => isInOrder(x, [[2]]) === null) + 1;
    const p2 = allPackets.findIndex(x => isInOrder(x, [[6]]) === null) + 1;
    console.log(p1 * p2)
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
