"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* tslint:disable:no-console */
const chalk_1 = require("chalk");
const debug_1 = require("debug");
const logSymbols = require("log-symbols");
const readline = require("readline");
const store = require('./store');
const createDebug = debug_1.default('blix:core:fs:create');
const deleteDebug = debug_1.default('blix:core:fs:delete');
const mutateDebug = debug_1.default('blix:core:fs:mutate');
const insertDebug = debug_1.default('blix:core:fs:insert');
const appendDebug = debug_1.default('blix:core:fs:append');
const invokeDebug = debug_1.default('blix:core:fs:invoke');
function logError(msg) {
    console.error(chalk_1.default `{red ${msg}}`);
}
exports.logError = logError;
function logWarning(msg) {
    console.warn(chalk_1.default `{yellow ${msg}}`);
}
exports.logWarning = logWarning;
function logTaskStatus(task, status, symbol) {
    let stringToStore = '';
    if (symbol) {
        stringToStore = `${symbol} ${task}`;
    }
    else {
        //  prettier-ignore
        // @ts-ignore
        stringToStore = `${logSymbols[status] ? logSymbols[status] : logSymbols.success}  ${task}`;
    }
    store.tasks.push(stringToStore);
    if (store.env !== 'development') {
        clearConsole();
    }
    store.tasks.forEach((storedTask) => {
        console.log(storedTask);
    });
}
exports.logTaskStatus = logTaskStatus;
// logger action methods
function logCreate(msg) {
    if (store.env === 'development') {
        createDebug('create %s', msg);
    }
}
exports.logCreate = logCreate;
function logDeleted(msg) {
    if (store.env === 'development') {
        deleteDebug('delete %s', msg);
    }
}
exports.logDeleted = logDeleted;
function logMutate(msg) {
    if (store.env === 'development') {
        mutateDebug('mutate %s', msg);
    }
}
exports.logMutate = logMutate;
function logInsert(msg) {
    if (store.env === 'development') {
        insertDebug('insert %s', msg);
    }
}
exports.logInsert = logInsert;
function logAppend(msg) {
    if (store.env === 'development') {
        appendDebug('append %s', msg);
    }
}
exports.logAppend = logAppend;
function logInvoke(msg) {
    if (store.env === 'development') {
        invokeDebug('invoke %s', msg);
        console.log(chalk_1.default `{blue invoke} ${msg}`);
    }
}
exports.logInvoke = logInvoke;
function _basicConsoleHeader(blixVersion) {
    return chalk_1.default.bold.cyan(`Blix v${blixVersion}`);
}
function clearConsole(title) {
    if (process.stdout.isTTY) {
        // @ts-ignore
        const blank = '\n'.repeat(process.stdout.rows);
        console.log(blank);
        readline.cursorTo(process.stdout, 0, 0);
        readline.clearScreenDown(process.stdout);
        if (title) {
            console.log(chalk_1.default.bold.cyan(title));
        }
        else if (store.mode === 'cli' && store.blixNeedsUpdate) {
            console.log(_basicConsoleHeader(store.blixVersion));
            console.log();
            console.log(chalk_1.default.bold.red(`Blix update available. Please update to the latest version${store.blixLatestVersion ? ': ' + store.blixLatestVersion : ''}`));
            console.log();
        }
        else if (store.mode === 'cli') {
            console.log(_basicConsoleHeader(store.blixVersion));
            console.log();
        }
    }
}
exports.clearConsole = clearConsole;
