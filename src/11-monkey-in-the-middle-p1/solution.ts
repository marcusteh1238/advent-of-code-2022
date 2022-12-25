// https://adventofcode.com/2022/day/11

import path from "path";
import { getInput } from "../helpers/getInput";

const INPUT_FILE = path.join(__dirname, "./input.txt");

async function solution() {
    const input = await getInput(INPUT_FILE);
    const monkeys = parseInput(input);
    for (let r = 0; r < 20; r++) {
        for (let i = 0; i < monkeys.length; i++) {
            const monkey = monkeys[i];
            for (let j = 0; j < monkey.items.length; j++) {
                const item = monkey.items[j];
                // inspect item
                const valAfterInspect = Math.floor(monkey.op(item) / 3);
                // test item
                const throwToMonkey = monkey.testFn(valAfterInspect);
                monkeys[throwToMonkey].items.push(valAfterInspect);
            }
            monkeys[i].numInspected += monkeys[i].items.length;
            monkeys[i].items = [];
        }
    }
    const monkeyBusinesses = monkeys.map(m => m.numInspected);
    monkeyBusinesses.sort((m1, m2) => m2 - m1);
    const monkeyBusiness = monkeyBusinesses[0] * monkeyBusinesses[1];
    console.log(monkeyBusiness);
}

function parseInput(input: string) {
    const monkeyStrings = input.split('Monkey ').map(m => m.trim());
    monkeyStrings.shift();
    const monkeys = monkeyStrings.map(monkeyParagraph => {
        const lines = monkeyParagraph.split(/\r?\n/).map(str => str.trim());
        const id = Number(lines[0][0]);
        const items = lines[1].split(':')[1].split(',').map(item => Number(item));
        const operation = getOperationFn(lines[2]);
        const testFn = getTestFn(lines[3], lines[4], lines[5]);
        return new Monkey(id, items, operation, testFn)
    });
    return monkeys;
}

function getOperationFn(operationStr: string) {
    const exprStr = operationStr.split('=')[1].split(' ');
    const [, arg1, op, arg2] = exprStr;
    // const x = (old) => BigInt(old) + BigInt(old)
    const convertedExprStr = `${arg1} ${op} ${arg2}`;
    const fn = eval(`(old) => ${convertedExprStr}`);
    
    return fn as (x: number) => number;
}

function getTestFn(testFnStr: string, trueStr: string, falseStr: string) {
    const testFnStrArgs = testFnStr.split(' ');
    const divisibleBy = Number(testFnStrArgs[testFnStrArgs.length - 1]);
    const trueStrArgs = trueStr.split(' ');
    const ifTrue = Number(trueStrArgs[trueStrArgs.length - 1]);
    const falseStrArgs = falseStr.split(' ');
    const ifFalse = Number(falseStrArgs[falseStrArgs.length - 1]);
    return (x: number) => {
        if (x % divisibleBy === 0) {
            return ifTrue;
        } else {
            return ifFalse;
        }
    };
}

class Monkey {
    id: number;
    items: number[];
    op: (old: number) => number;
    testFn: (x: number) => number;
    numInspected = 0;

    constructor(
        id: number,
        items: number[],
        op: (x: number) => number,
        testFn: (x: number) => number
    ) {
        this.id = id;
        this.items = items;
        this.op = op;
        this.testFn = testFn;
    }
}

solution();
