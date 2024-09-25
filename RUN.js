// Import necessary modules
const IntensityTracker = require('./IntensityTracker');
const VariationCalculator = require('./variation');
const speedEmitter = require('./server');
const server = require('./server/server/server');

// Initialize modules with fixed window sizes
const intensityWindowSize = 5;
const variationWindowSize = 5;

const intensityTracker = new IntensityTracker(intensityWindowSize);
const variationCalculator = new VariationCalculator(variationWindowSize);

// Start the server
server.startServer();

// Set the WebSocket IP
server.setIP('ws:localhost:12345');

// Input variables
let INT = 0.0; // INTENSITY
let VAR = 0.0; // VARIETY
let currentPATOUT = null; // Track the current PATOUT value
let interpreterRunning = false; // Track if the interpreter is running

// Output function
async function PATOUT(value) {
    if (value !== currentPATOUT) {
        console.log(`PATOUT ${value}`);
        await server.setPAT(value); // Set the pattern using the server module
        currentPATOUT = value; // Update the current PATOUT value
    }
}

// Function to run a word
async function RUN(word) {
    if (typeof word === 'function') {
        console.log(`RUNNING ${word.name}`);
        await word();
    } else {
        console.log(`RUN ${word}`);
    }
}

// Delay function
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Switch case function
async function SWITCH(cases) {
    for (let i = 0; i < cases.length; i++) {
        const [condition, action] = cases[i];
        if (condition()) {
            console.log(`CONDITION MET: ${condition}`);
            await action();
            return;
        }
    }
}

// WORDS section
async function PATTERN0() {
    await RUN(PAT0);
	await delay(100);
    await RUN(PICKPAT);
}
//There's an added delay to avoid looping taking up all processing

async function PATTERN1() {
    await RUN(PAT1);
    await delay(800);
    await PATDLY();
    await SWITCH([
        [() => INT >= 0.5 && INT <= 1.0, PICKPAT],
        [() => VAR >= 0 && VAR <= 0.24, HOLD1],
        [() => VAR >= 0.25 && VAR <= 0.49, async () => { await delay(750); await RUN(PICKPAT); }],
        [() => VAR >= 0.49 && VAR <= 1.0, PICKPAT]
    ]);
}

// Define other patterns similarly...
// Define PATTERN2
async function PATTERN2() {
    await RUN(PAT2);
    await delay(1800);
    await PATDLY();
    await SWITCH([
        [() => INT >= 0.6 && INT <= 1.0, PICKPAT],
        [() => VAR >= 0 && VAR <= 0.39, HOLD1],
        [() => VAR >= 0.4 && VAR <= 0.59, async () => { await delay(1000); await RUN(PICKPAT); }],
        [() => VAR >= 0.6 && VAR <= 1.0, PICKPAT]
    ]);
}

// Define PATTERN3
async function PATTERN3() {
    await RUN(PAT3);
    await delay(3000);
    await PATDLY();
    await SWITCH([
        [() => INT >= 0.75 && INT <= 1.0, PICKPAT],
        [() => VAR >= 0 && VAR <= 0.39, HOLD1],
        [() => VAR >= 0.4 && VAR <= 0.59, async () => { await delay(700); await RUN(PICKPAT); }],
        [() => VAR >= 0.6 && VAR <= 1.0, PICKPAT]
    ]);
}


// Define PATTERN4
async function PATTERN4() {
    await RUN(PAT4);
    await delay(2000);
    await PATDLY();
    await SWITCH([
        [() => INT >= 0.6 && INT <= 1.0, PICKPAT],
        [() => VAR >= 0 && VAR <= 0.59, HOLD1],
        [() => VAR >= 0.6 && VAR <= 1.0, PICKPAT]
    ]);
}

// Define PATTERN5
async function PATTERN5() {
    await RUN(PAT5);
    await delay(3000);
    await PATDLY();
    await SWITCH([
        [() => INT >= 0.8 && INT <= 1.0, PICKPAT],
        [() => VAR >= 0 && VAR <= 0.59, HOLD3],
        [() => VAR >= 0.6 && VAR <= 1.0, PICKPAT]
    ]);
}

// Define PATTERN6
async function PATTERN6() {
    await RUN(PAT6);
    await delay(3500);
    await PATDLY();
    await SWITCH([
        [() => INT >= 0.9 && INT <= 1.0, PICKPAT],
        [() => VAR >= 0 && VAR <= 0.59, HOLD2],
        [() => VAR >= 0.6 && VAR <= 1.0, PICKPAT]
    ]);
}

// Define PATTERN7
async function PATTERN7() {
    await RUN(PAT7);
    await delay(2025);
    await PATDLY();
    await SWITCH([
        [() => INT >= 0.6 && INT <= 1.0, PICKPAT],
        [() => VAR >= 0.3 && VAR <= 1.0, PICKPAT],
        [() => VAR >= 0 && VAR <= 0.29, async () => { await delay(2000); await SWITCH([
            [() => INT >= 0.8 && INT <= 1.0, PICKPAT],
            [() => VAR >= 0 && VAR <= 0.29, async () => { await delay(2200); await RUN(HOLD1); }],
            [() => VAR >= 0.3 && VAR <= 1.0, PICKPAT]
        ]); }]
    ]);
}

// Define PATTERN8
async function PATTERN8() {
    await RUN(PAT8);
    await delay(2900);
    await PATDLY();
    await SWITCH([
        [() => INT >= 0.8 && INT <= 1.0, PICKPAT],
        [() => VAR >= 0 && VAR <= 0.24, HOLD2],
        [() => VAR >= 0.25 && VAR <= 0.49, async () => { await delay(800); }],
        [() => VAR >= 0.49 && VAR <= 1.0, PICKPAT]
    ]);
    await SWITCH([
        [() => INT >= 0.8 && INT <= 1.0, PICKPAT],
        [() => VAR >= 0 && VAR <= 0.24, HOLD1],
        [() => VAR >= 0.25 && VAR <= 0.3, async () => { await delay(800); }],
        [() => VAR >= 0.31 && VAR <= 1.0, PICKPAT]
    ]);
    await SWITCH([
        [() => INT >= 0.8 && INT <= 1.0, PICKPAT],
        [() => VAR >= 0 && VAR <= 0.24, HOLD1],
        [() => VAR >= 0.25 && VAR <= 0.3, async () => { await delay(800); }],
        [() => VAR >= 0.31 && VAR <= 1.0, PICKPAT]
    ]);
    await SWITCH([
        [() => INT >= 0.8 && INT <= 1.0, PICKPAT],
        [() => VAR >= 0 && VAR <= 0.24, HOLD1],
        [() => VAR >= 0.25 && VAR <= 0.29, async () => { await delay(800); }],
        [() => VAR >= 0.3 && VAR <= 1.0, PICKPAT]
    ]);
    await SWITCH([
        [() => INT >= 0.8 && INT <= 1.0, PICKPAT],
        [() => VAR >= 0 && VAR <= 0.24, HOLD1],
        [() => VAR >= 0.25 && VAR <= 0.29, async () => { await delay(800); }],
        [() => VAR >= 0.3 && VAR <= 1.0, PICKPAT]
    ]);
}

// Define PATTERN9
async function PATTERN9() {
    await RUN(PAT9);
    await delay(3000);
    await PATDLY();
    await SWITCH([
        [() => INT >= 0 && INT <= 0.5, PICKPAT],
        [() => VAR >= 0 && VAR <= 0.2, HOLD1],
        [() => VAR >= 0.21 && VAR <= 0.59, async () => { await delay(2800); }],
        [() => VAR >= 0.6 && VAR <= 1.0, PICKPAT]
    ]);
    await SWITCH([
        [() => INT >= 0 && INT <= 0.5, PICKPAT],
        [() => VAR >= 0 && VAR <= 0.49, HOLD2],
        [() => VAR >= 0.5 && VAR <= 1.0, PICKPAT]
    ]);
}


async function PATDLY() {
    await delay(500);
}

async function HOLD1() {
    await RUN(PAT0);
    await delay(500);
    await RUN(PICKPAT);
}

async function HOLD2() {
    await RUN(PAT0);
    await delay(1000);
    await RUN(PICKPAT);
}

async function HOLD3() {
    await RUN(PAT0);
    await delay(2000);
    await RUN(PICKPAT);
}

function PAT0() { PATOUT(0); }
function PAT1() { PATOUT(0.1); }
function PAT2() { PATOUT(0.2); }
function PAT3() { PATOUT(0.3); }
function PAT4() { PATOUT(0.4); }
function PAT5() { PATOUT(0.5); }
function PAT6() { PATOUT(0.6); }
function PAT7() { PATOUT(0.7); }
function PAT8() { PATOUT(0.8); }
function PAT9() { PATOUT(0.9); }

async function PICKPAT() {
    await SWITCH([
	    [() => INT >= 0 && INT <= 0.059, PATTERN0],
        [() => INT >= 0.06 && INT <= 0.2, PATTERN1],
        [() => INT >= 0.21 && INT <= 0.4, PATSELECT3],
        [() => INT >= 0.41 && INT <= 0.55, PATSELECT5],
        [() => INT >= 0.56 && INT <= 0.75, PATTERN6],
        [() => INT >= 0.76 && INT <= 1, PATTERN9]
    ]);
}

// Define PATSELECT.3
async function PATSELECT3() {
    await SWITCH([
        [() => VAR >= 0 && VAR <= 0.3, PATTERN7],
        [() => VAR >= 0.31 && VAR <= 0.5, PATTERN2],
        [() => VAR >= 0.51 && VAR <= 1, PATTERN4]
    ]);
}

// Define PATSELECT.5
async function PATSELECT5() {
    await SWITCH([
        [() => VAR >= 0 && VAR <= 0.3, PATTERN8],
        [() => VAR >= 0.31 && VAR <= 0.5, PATTERN3],
        [() => VAR >= 0.51 && VAR <= 1, PATTERN5]
    ]);
}

// Main interpreter loop
async function interpreterLoop() {
    while (true) {
        if (!interpreterRunning) {
            interpreterRunning = true;
            await RUN(PICKPAT);
            interpreterRunning = false;
        }
        await delay(100); // Adjust the delay as needed
    }
}

// Run the interpreter loop
interpreterLoop();

// Handle speed events
speedEmitter.on('speed', async (speed) => {
    console.log('Received speed:', speed);
    if (speed === 'stop') {
        await RUN(PATTERN0);
    } else {
        server.setVIB(speed); // Set the speed using the server module
        INT = intensityTracker.updateIntensityWithInput(speed); // Get the updated intensity value
        VAR = variationCalculator.calculate(speed);
        console.log(`Updated INT: ${INT}, VAR: ${VAR}`); // Log the updated values
    }
});
