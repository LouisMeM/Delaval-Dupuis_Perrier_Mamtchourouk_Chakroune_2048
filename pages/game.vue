<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';

import {useMainStore} from "~/store";
import Timer from 'easytimer.js';

const timer = new Timer();
const timerValue = ref('00:00:00');


const store = useMainStore();

const gameType = computed(() => store.gameType);
const gridSize = store.boardSize;
const grid = ref(
    Array(gridSize)
        .fill(null)
        .map(() => Array(gridSize).fill(-1))
);
const score = ref(0);

const isGameOver = computed(() => {
    if (!isGridFull()) {
        return false;
    }

    for (let rowIndex = 0; rowIndex < grid.value.length; rowIndex++) {
        for (let colIndex = 0; colIndex < grid.value[rowIndex].length; colIndex++) {
            const cell = grid.value[rowIndex][colIndex];
            if (gameType.value === '2048' && cell === 2048) {
                timer.stop();
                return true;
            }
            if (
                (rowIndex > 0 && cell === grid.value[rowIndex - 1][colIndex]) || // Check above
                (rowIndex < grid.value.length - 1 && cell === grid.value[rowIndex + 1][colIndex]) || // Check below
                (colIndex > 0 && cell === grid.value[rowIndex][colIndex - 1]) || // Check left
                (colIndex < grid.value[rowIndex].length - 1 && cell === grid.value[rowIndex][colIndex + 1]) // Check right
            ) {
                return false;
            }
        }
    }
    timer.stop();
    return true;
});


// Checks if the grid is full
function isGridFull() {
    return grid.value.every((row) => row.every((cell) => cell !== -1));
}

// Handles global movement logic
function MoveCells(event : KeyboardEvent) {
    const gridCopy = JSON.stringify(grid.value);

    switch (event.key) {
        case 'ArrowUp':
            MoveCellsUp();
            break;
        case 'ArrowDown':
            MoveCellsDown();
            break;
        case 'ArrowLeft':
            MoveCellsLeft();
            break;
        case 'ArrowRight':
            MoveCellsRight();
            break;
    }

    ResetEmptyTiles();

    // Spawn a new cell only if the grid changed
    if (gridCopy !== JSON.stringify(grid.value)) {
        SpawnRandomCell();
    }
}

// Ensures all invalid empty cells are reset to -1
function ResetEmptyTiles() {
    grid.value.forEach((row, rowIndex) => {
        row.forEach((col, colIndex) => {
            if (col < 0) {
                grid.value[rowIndex][colIndex] = -1;
            }
        });
    });
}

// Moves tiles up
function MoveCellsUp() {
    for (let col = 0; col < gridSize; col++) {
        for (let row = 1; row < gridSize; row++) {
            if (grid.value[row][col] !== -1) {
                let target = row;
                while (target > 0 && grid.value[target - 1][col] === -1) {
                    grid.value[target - 1][col] = grid.value[target][col];
                    grid.value[target][col] = -1;
                    target--;
                }

                // Fusioning cells
                if (target > 0 && grid.value[target - 1][col] === grid.value[target][col]) {
                    score.value += grid.value[target - 1][col] * 2;
                    grid.value[target - 1][col] *= 2;
                    grid.value[target][col] = -1;
                }
            }
        }
    }
}

// Moves tiles down
function MoveCellsDown() {
    for (let col = 0; col < gridSize; col++) {
        for (let row = gridSize - 2; row >= 0; row--) {
            if (grid.value[row][col] !== -1) {
                let target = row;
                while (target < gridSize - 1 && grid.value[target + 1][col] === -1) {
                    grid.value[target + 1][col] = grid.value[target][col];
                    grid.value[target][col] = -1;
                    target++;
                }

                // Fusioning cells
                if (target < gridSize - 1 && grid.value[target + 1][col] === grid.value[target][col]) {
                    score.value += grid.value[target + 1][col] * 2;
                    grid.value[target + 1][col] *= 2;
                    grid.value[target][col] = -1;
                }
            }
        }
    }
}

// Moves tiles left
function MoveCellsLeft() {
    for (let row = 0; row < gridSize; row++) {
        for (let col = 1; col < gridSize; col++) {
            if (grid.value[row][col] !== -1) {
                let target = col;
                while (target > 0 && grid.value[row][target - 1] === -1) {
                    grid.value[row][target - 1] = grid.value[row][target];
                    grid.value[row][target] = -1;
                    target--;
                }

                // Fusioning cells
                if (target > 0 && grid.value[row][target - 1] === grid.value[row][target]) {
                    score.value += grid.value[row][target - 1] * 2;
                    grid.value[row][target - 1] *= 2;
                    grid.value[row][target] = -1;
                }
            }
        }
    }
}

// Moves tiles right
function MoveCellsRight() {
    for (let row = 0; row < gridSize; row++) {
        for (let col = gridSize - 2; col >= 0; col--) {
            if (grid.value[row][col] !== -1) {
                let target = col;
                while (target < gridSize - 1 && grid.value[row][target + 1] === -1) {
                    grid.value[row][target + 1] = grid.value[row][target];
                    grid.value[row][target] = -1;
                    target++;
                }

                // Fusioning cells
                if (target < gridSize - 1 && grid.value[row][target + 1] === grid.value[row][target]) {
                    score.value += grid.value[row][target + 1] * 2;
                    grid.value[row][target + 1] *= 2;
                    grid.value[row][target] = -1;
                }
            }
        }
    }
}

// Starts or restarts the game
function StartGame() {
    grid.value = Array(gridSize)
        .fill(null)
        .map(() => Array(gridSize).fill(-1));
    score.value = 0;
    SpawnRandomCell();
    SpawnRandomCell();

    // Timer
    timer.start();
    timer.addEventListener('secondsUpdated', function (e) {
        timerValue.value = timer.getTimeValues().toString();
    });
}

// Spawns a random tile
function SpawnRandomCell() {
    if (isGridFull()) return;
    let emptyCells: any[] = [];

    grid.value.forEach((row, rowIndex) => {
        row.forEach((cell, colIndex) => {
            if (cell === -1) {
                emptyCells.push({ rowIndex, colIndex });
            }
        });
    });

    const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    grid.value[randomCell.rowIndex][randomCell.colIndex] = Math.random() < 0.9 ? 2 : 4;
}

function HandleKeyPress(event: KeyboardEvent) {
    if (!['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
        return;
    }
    if (isGameOver.value) {
        return;
    }
    MoveCells(event);
}

onMounted(() => {
    window.addEventListener('keydown', HandleKeyPress);
    StartGame();
});
</script>


<template>
    <div class="container u-flex u-align-items-center u-justify-content-center u-gap10">
        <div class="game-statut u-p20">
            <p class="game-score">Score : {{ score }}</p>
            <p class="game-timer">{{timerValue}}</p>
            <p class="game-timer">Gamemode : {{gameType}}</p>
        </div>
        <div :class="`grid-container u-flex u-flex-direction-column u-p15 u-gap15 grid-scale-${gridSize}`" >
            <div class="u-flex u-gap15" v-for="rows in grid">
                <div class="grid-cell" v-for="cell in rows"></div>
            </div>
            <div class="tile-container">
                <div v-for="(tile, index) in grid.flat()" :key="index">
                    <div :class="`tile-position-${Math.floor(index / gridSize )}-${index % gridSize}`">
                        <div v-if="tile > -1" :class="`tile tile-color-${tile}`">{{ tile }}</div>
                    </div>
                </div>
            </div>
        </div>

        <div v-if="isGameOver" class="game-over-window u-flex u-flex-direction-column u-justify-content-center u-align-items-center u-noselect">
            <div class="u-flex u-flex-direction-column u-justify-content-center u-align-items-center u-gap5">
                <p>Partie terminée !</p>
                <button @click="StartGame">Rejouer</button>
                <button @click="$router.push('/')">Menu</button>
            </div>
        </div>

        <div class="back-to-menu-button u-noselect" @click="$router.push('/')">Retourner au menu</div>
    </div>
</template>

<style scoped lang="scss">


.container {
    position: relative;
    width: 100vw;
    height: 100vh;

    .back-to-menu-button{
        position: fixed;
        top: 10px;
        left: 10px;
        cursor: pointer;
        padding: 5px 10px;
        border-radius: 5px;
        transition: background-color 0.3s;
        background-color: #8f7a66;
    }


    .game-statut {
        border-radius: 5px;
        border: 1px solid black;
    }


    .game-over-window {
        background-color: rgba(0, 0, 0, 0.5);
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;

        div {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background-color: #bbada0;
            border-radius: 5px;
            padding: 60px 75px;

            p {
                font-size: 32px;
                text-transform: uppercase;
            }

            button {
                font-size: 18px;
                margin-top: 10px;
                cursor: pointer;
                padding: 5px 10px;
                border-radius: 5px;
                transition: background-color 0.3s;

                &:hover {
                    background-color: #8f7a66;
                }
            }
        }
    }
}
.grid-container {
    background-color: #bbada0;

    .grid-cell {
        width: 115px;
        height: 115px;
        background-color: #cdc1b4;
        font-size: 22px;
    }

    .tile-container {
        position: absolute;

        .tile {
            position: absolute;
            width: 115px;
            height: 115px;
            line-height: 115px;
            text-align: center;
            font-size: 30px;
        }
    }
}


.grid-scale-4 {
    transform: scale(1);
}

.grid-scale-5 {
    transform: scale(0.9);
}

.grid-scale-6 {
    transform: scale(0.8);
}

.grid-scale-7 {
    transform: scale(0.7);
}
</style>