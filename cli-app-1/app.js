import chalk from "chalk";
import boxen from "boxen";
import readline from "readline";

let currentStep = 0;
let attempts = 0;
let name = "";

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
    process.stdout.write('\u001B[2J\u001B[0;0f');
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
    if (stepNumber) currentStep = stepNumber;
    else currentStep++;

    if (delay) setTimeout(() => {
        clear();
        if (!steps[currentStep]) { console.log("end"); cli.close(); }
        else steps[currentStep]();
    }, delay * 1000);
    else {
        clear();
        if (!steps[currentStep]) { console.log("end"); cli.close(); }
        else steps[currentStep]();
    }
}

/** functions */

async function getName() {
    name = await getUserInput(text(`Hello, what is your name? `));
    clear();
    renderBox(`Hello, ${name}! Let's begin...\n${" ".repeat(Math.round((3 + name.length) / 2))}(Enter to continue)`);
    await getUserInput("");
    nextStep(0, 1);
}

async function getPin() {

    const errMsgs = [
        `Incorrect! Surprising you made it into high school let alone university, ${name}`,
        `Wrong... At least you're funny, ${name}... Funny looking.`,
        "Almost there! If at first you don't succeed, try, try again!",
        `New High Score! Congrats, ${name}! You've set a new world record for failed attempts.`,
        "Your pin is incorrect! (look around)",
        `Come on, ${name}. You didn't think it'd be that easy did you?`,
        `Tick-Tock. You're running out of time, ${name}.`,
    ]

    const pinAttempt = await getUserInput(text("Enter your pin (aA-zZ, 0-9): "));

    if (pinAttempt == "1603") {
        renderBox("Well...\nYou weren't supposed to actually guess that.\nI put this in the code purely as an easter egg.\nGood job, I guess. ;)\n - The Developer");

        return setTimeout(async () => {
            await getUserInput("(Enter to... end?)");

            (function blink() {
                clear();
                console.log(`SYS-LOG_2024-03-28 ttys0001 > SIMULATION TERMINATED`)
                setTimeout(() => {
                    clear();
                    console.log(`SYS-LOG_2024-03-28 ttys0001 > `);
                    setTimeout(() => { blink(); }, 300)
                }, 500)
            })();
        }, 2000);
    }

    if (pinAttempt.length > 4) {
        renderBox("Error! PIN is longer than 4 characters! Please try again... \n               (Enter to continue)");
        await getUserInput("");
        return nextStep(0, 1);
    }
    attempts++;
    if (attempts < 3) renderBox(`${pinAttempt} is incorrect! ${10 - attempts} trys left...`);
    else if (attempts > 2 && attempts < 6) renderBox(`${pinAttempt} is incorrect! ${Math.round(Math.random() * 3) + attempts} trys left...`);
    else if (attempts < 9) renderBox(`${pinAttempt} is incorrect! Need a hint?`);
    else {
        if (Math.random() < 0.4) renderBox(`${pinAttempt} is incorrect! Need a hint?`);
        else renderBox(errMsgs[Math.round(Math.random() * errMsgs.length)]);
    }
    await getUserInput("");
    nextStep(0, 1);
}

clear();
steps[currentStep]();