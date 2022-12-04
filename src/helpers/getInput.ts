import {promises as fs} from "fs";

export async function getInput(path: string) {
    return fs.readFile(path, {encoding: "utf-8"});
}
