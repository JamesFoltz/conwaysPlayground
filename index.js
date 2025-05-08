// ========================
// CONFIGURATION & CONSTANTS
// ========================

const rows = 100;
const cols = 100;
const cellSize = 8;

// === LOCAL STORAGE CHANGES START ===
const LOCAL_STORAGE_KEY = 'my_sim_config';

function loadConfigFromLocalStorage() {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
        try {
            return JSON.parse(saved);
        } catch (e) {
        }
    }
    return null;
}

function saveConfigToLocalStorage(configObj) {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(configObj));
}

var config = loadConfigFromLocalStorage() || { colors: { dead: "#222222", alive: "#00ff88", cat: "#0099ff", zombie: "#ff0055" }, rules: { dead: [{ next: "alive", conditions: [{ state: "alive", count: [3] }] }, { next: "cat", conditions: [{ state: "cat", count: [2, 3] }] }], alive: [{ next: "dead", conditions: [{ state: "alive", count: [0, 1, 4, 5, 6, 7, 8] }] }, { next: "zombie", conditions: [{ state: "zombie", count: [1, 2] }] }], cat: [{ next: "dead", conditions: [{ state: "cat", count: [0, 1, 7, 8] }] }, { next: "alive", conditions: [{ state: "alive", count: [2, 3] }] }], zombie: [{ next: "dead", conditions: [{ state: "alive", count: [0] }] }, { next: "zombie", conditions: [{ state: "zombie", count: [2, 3, 4] }] }] } };

var states = Object.keys(config.colors);

// ========================
// UI ELEMENTS & INITIALIZATION
// ========================

const clearBtn = document.getElementById('clearBtn');
const canvas = document.getElementById('myCanvas');
canvas.width = cols * cellSize;
canvas.height = rows * cellSize;
const ctx = canvas.getContext('2d');
ctx.imageSmoothingEnabled = false;

const rulesTextarea = document.getElementById('rules');
const loadRulesBtn = document.getElementById('loadRulesBtn');
rulesTextarea.value = JSON.stringify(config, null, 1);

let isPaused = false;
const pausePlayBtn = document.getElementById('pause-play');

const speedRange = document.getElementById('speedRange');
const speedValue = document.getElementById('speedValue');
let simSpeed = speedRange.value; // ms per step
speedValue.textContent = simSpeed;

// ========================
// EVENT LISTENERS
// ========================

loadRulesBtn.addEventListener('click', function () {
    try {
        const newRules = JSON.parse(rulesTextarea.value);
        config = newRules;
        states = Object.keys(config.colors);
        rulesTextarea.value = JSON.stringify(config, null, 1);
        console.log(JSON.stringify(config, null, 1));
        saveConfigToLocalStorage(config);
        restart();
    } catch (e) {
        alert("Invalid JSON: " + e.message);
    }
});

speedRange.addEventListener('input', function () {
    simSpeed = Number(speedRange.value);
    speedValue.textContent = simSpeed;
});

pausePlayBtn.addEventListener('click', function () {
    isPaused = !isPaused;
    pausePlayBtn.textContent = isPaused ? "Play" : "Pause";
    if (!isPaused) {
        draw();
    } else {
        clearTimeout(animationId);
    }
});

clearBtn.addEventListener('click', () => {
    grid = Array.from({ length: rows }, () => Array.from({ length: cols }, () => "dead"));
    clearTimeout(animationId);
    draw();
});

let isMouseDown = false;
canvas.addEventListener('mousedown', function (e) {
    isMouseDown = true;
    handleMouse(e);
});
canvas.addEventListener('mouseup', function (e) {
    isMouseDown = false;
});
canvas.addEventListener('mouseleave', function (e) {
    isMouseDown = false;
});
canvas.addEventListener('mousemove', function (e) {
    if (isMouseDown) handleMouse(e);
});

// ========================
// SIMULATION STATE
// ========================

let grid = Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => states[Math.floor(Math.random() * states.length)])
);
let nextGrid = Array.from({ length: rows }, () => Array(cols));
let animationId = null;

// ========================
// HELPER FUNCTIONS
// ========================

function countAllNeighbors(grid, x, y) {
    const counts = {};
    for (const state of states) counts[state] = 0;
    for (let dx = -1; dx <= 1; dx++) {
        for (let dy = -1; dy <= 1; dy++) {
            if (dx === 0 && dy === 0) continue;
            let nx = (x + dx + rows) % rows;
            let ny = (y + dy + cols) % cols;
            counts[grid[nx][ny]]++;
        }
    }
    return counts;
}

function calcArr(grid, nextGrid) {
    for (let x = 0; x < rows; x++) {
        for (let y = 0; y < cols; y++) {
            const currentState = grid[x][y];
            const neighborCounts = countAllNeighbors(grid, x, y);
            const rulesForCurrent = config.rules[currentState] || [];
            let nextState = currentState;

            for (const rule of rulesForCurrent) {
                let allMatch = rule.conditions.every(cond =>
                    cond.count.includes(neighborCounts[cond.state])
                );
                if (allMatch) {
                    nextState = rule.next;
                    break;
                }
            }
            nextGrid[x][y] = nextState;
        }
    }
}

function draw() {
    if (!isPaused) calcArr(grid, nextGrid);

    for (let x = 0; x < rows; x++) {
        for (let y = 0; y < cols; y++) {
            ctx.fillStyle = config.colors[nextGrid[x][y]] || "#000";
            ctx.fillRect(y * cellSize, x * cellSize, cellSize, cellSize);
        }
    }

    [grid, nextGrid] = [nextGrid, grid];

    animationId = setTimeout(draw, simSpeed);
}

function restart() {
    grid = Array.from({ length: rows }, () =>
        Array.from({ length: cols }, () => states[Math.floor(Math.random() * states.length)])
    );
    if (isPaused) {
        isPaused = false;
        pausePlayBtn.textContent = "Pause";
    }
    clearTimeout(animationId);
    draw();
}

function handleMouse(e) {
    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((e.clientY - rect.top) / cellSize);
    const y = Math.floor((e.clientX - rect.left) / cellSize);
    if (x >= 0 && x < rows && y >= 0 && y < cols) {
        let currentIndex = states.indexOf(grid[x][y]);
        let nextIndex = (currentIndex + 1) % states.length;
        grid[x][y] = states[nextIndex];
        nextGrid[x][y] = states[nextIndex];
        ctx.fillStyle = config.colors[grid[x][y]] || "#000";
        ctx.fillRect(y * cellSize, x * cellSize, cellSize, cellSize);
    }
}

// ========================
// INITIALIZE SIMULATION
// ========================

restart();
