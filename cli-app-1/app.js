import chalk from "chalk";
import boxen from "boxen";
import readline from "readline";

let currentStep = 0;

/** Setup */
const cli = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const boxenOptions = {
    padding: 1,
    margin: 1,
    borderStyle: "round",
    borderColor: "green",
    backgroundColor: "#555555"
};

function clear() {
    process.stdout.write ('\u001B[2J\u001B[0;0f');
}

function renderBox(message) {
    const msgBox = boxen(message, boxenOptions);
    console.log(msgBox);
}

function text(input) {
    return chalk.white.bold(`${input}`);
}

async function getUserInput(question) {
    return new Promise((resolve, reject) => {
        cli.question(question, res => {
            resolve(res);
        });
    })
}

const steps = [
    getName,
    getPin,
]

function nextStep(delay, stepNumber) {
    if(stepNumber) currentStep = stepNumber;
    else currentStep++;

    if(delay) setTimeout(() => {
        clear();
        if(!steps[currentStep]) { console.log("end"); cli.close(); }
        else steps[currentStep]();
    }, delay*1000);
    else {
        clear();
        if(!steps[currentStep]) { console.log("end"); cli.close(); }
        else steps[currentStep]();
    }
}

/** functions */

async function getName() {
    const name = await getUserInput(text(`Hello, what is your name?`));
    clear();
    renderBox(`Hello, ${name}!`);
    nextStep(5);
}

async function getPin() {
    const pinAttempt = await getUserInput(text("Enter your pin:"));
    renderBox(`${pinAttempt} is incorrect!`);
    nextStep(5, 1);
}

clear();
steps[currentStep]();