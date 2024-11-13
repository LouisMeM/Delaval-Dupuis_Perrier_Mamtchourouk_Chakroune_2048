<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const gridSize = 5
const grid = ref([
    [-1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1],
]);

let score = ref(0)

const isGameOver = computed(() => {
    if (!isGridFull()) {
        return false;
    }

    for (let rowIndex = 0; rowIndex < grid.value.length; rowIndex++) {
        for (let colIndex = 0; colIndex < grid.value[rowIndex].length; colIndex++) {
            const cell = grid.value[rowIndex][colIndex];
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

    return true;
})

// TODO : Implement the score, and ending screen/game over



// Return true if the grid is full
function isGridFull() {
    for (let row of grid.value) {
        for (let cell of row) {
            if (cell === -1) {
                return false
            }
        }
    }
    return true
}

// Global event moving/fusionning/spawning etc... function
function MoveCells (event : KeyboardEvent) {
    const gridCopy = JSON.parse(JSON.stringify(grid.value));
    if (event.key === 'ArrowUp') {
        MoveCellsUp()
    }
    if (event.key === 'ArrowDown') {
        MoveCellsDown()
    }
    if (event.key === 'ArrowLeft') {
        MoveCellsLeft()
    }
    if (event.key === 'ArrowRight') {
        MoveCellsRight()
    }


    console.log(grid.value)

    ResetEmptyTiles()
    // If the grid has changed, we spawn a new tile
    if (JSON.stringify(gridCopy) !== JSON.stringify(grid.value)) {
        SpawnRandomCell()
    }

}

// Reset all tiles, with the current version of Moving/fusioning functions, sometimes empty tiles are not only -1 (sometime -2,-4, etc ...)
// Because its fusionning empty tiles (NEED TO FIX IT)
function ResetEmptyTiles() {
    grid.value.forEach((row ,rowIndex) => {
        row.forEach((col,colIndex) => {
            if (col < 0) {
                grid.value[rowIndex][colIndex] = -1
            }
        })
    })
}

// Move all the board to the top
function MoveCellsUp() {
    for (let colIndex = 0; colIndex < grid.value.length; colIndex++) {
        for (let rowIndex = 1; rowIndex < grid.value[0].length; rowIndex++){
            let i = 0
            while (i < rowIndex) {
                if (isCellEmpty(grid.value[i][colIndex])){
                    grid.value[i][colIndex] = grid.value[rowIndex][colIndex]
                    grid.value[rowIndex][colIndex] = -1

                    // Fusion if the tile has changed position
                    if (i!==0 && grid.value[i][colIndex] == grid.value[i - 1][colIndex]) {
                        score.value += grid.value[i - 1][colIndex] * 2
                        grid.value[i - 1][colIndex] *= 2
                        grid.value[i][colIndex] = -1
                    }
                    break
                }
                else {
                    i++
                }
            }
            if (grid.value[rowIndex][colIndex] == grid.value[rowIndex - 1][colIndex] && grid.value[rowIndex][colIndex] > 0) {
                score.value += grid.value[i - 1][colIndex] * 2
                grid.value[rowIndex - 1][colIndex] *= 2
                grid.value[rowIndex][colIndex] = -1
            }
        }
    }
}

// Move all the board to the bottom
function MoveCellsDown() {
    for (let colIndex = 0; colIndex < grid.value.length; colIndex++) {
        for (let rowIndex = grid.value[0].length -2; rowIndex >= 0; rowIndex--){
            let i = grid.value.length - 1
            while (i > rowIndex) {
                if (isCellEmpty(grid.value[i][colIndex])){
                    grid.value[i][colIndex] = grid.value[rowIndex][colIndex]
                    grid.value[rowIndex][colIndex] = -1

                    // Fusion if the tile has changed position
                    if (i!==grid.value.length -1 && grid.value[i][colIndex] == grid.value[i + 1][colIndex]) {
                        score.value += grid.value[i + 1][colIndex] * 2
                        grid.value[i + 1][colIndex] *= 2
                        grid.value[i][colIndex] = -1
                    }
                    break
                }
                else {
                    i--
                }
            }
            if (grid.value[rowIndex][colIndex] == grid.value[rowIndex + 1][colIndex] && grid.value[rowIndex][colIndex] > 0) {
                score.value += grid.value[i + 1][colIndex] * 2
                grid.value[rowIndex + 1][colIndex] *= 2
                grid.value[rowIndex][colIndex] = -1
            }
        }
    }
}

// Move all the board to the left
function MoveCellsLeft() {
    grid.value.forEach((row, rowIndex) => {
        // colIndex = 1, we don't need trying to move the first cell on the left
        for (let colIndex = 1; colIndex <= row.length -1; colIndex++ ) {
            let i  = 0
            while (i < colIndex) {
                if (isCellEmpty(row[i])) {
                    row[i] = row[colIndex]
                    row[colIndex] = -1

                    // Fusion if the tile has changed position
                    if (grid.value[rowIndex][i] == grid.value[rowIndex][i - 1]) {
                        score.value += grid.value[rowIndex][i - 1] * 2
                        grid.value[rowIndex][i - 1] *= 2
                        grid.value[rowIndex][i] = -1
                    }
                    break
                }
                else {
                    i++
                }
            }
            // Fusion cells if the cells on the right is the same
            if (grid.value[rowIndex][colIndex] == grid.value[rowIndex][colIndex - 1] && grid.value[rowIndex][colIndex] > 0) {
                score.value += grid.value[rowIndex][i - 1] * 2
                grid.value[rowIndex][colIndex - 1] *= 2
                grid.value[rowIndex][colIndex] = -1
            }
        }
    })
}

// Move all the board to the right
function MoveCellsRight() {
    grid.value.forEach((row, rowIndex) => {
        // row.lenght -2, we don't need trying to move the last cell on the right
        for (let colIndex = row.length - 2; colIndex >= 0; colIndex--) {
            let i  = row.length - 1
            while (i > colIndex) {
                if (isCellEmpty(row[i])) {
                    row[i] = row[colIndex]
                    row[colIndex] = -1

                    // Fusion if the tile has changed position
                    if (grid.value[rowIndex][i] == grid.value[rowIndex][i + 1]) {
                        score.value += grid.value[rowIndex][i + 1] *2
                        grid.value[rowIndex][i + 1] *= 2
                        grid.value[rowIndex][i] = -1
                    }
                    break
                }
                else {
                    i--
                }
            }
            // Fusion cells if the cells on the right is the same
            if (grid.value[rowIndex][colIndex] == grid.value[rowIndex][colIndex + 1] && grid.value[rowIndex][colIndex] > 0) {
                score.value += grid.value[rowIndex][i + 1] * 2
                grid.value[rowIndex][colIndex + 1] *= 2
                grid.value[rowIndex][colIndex] = -1
            }
        }
    })
}

//Return true if a tile is empty (equal to -1)
function isCellEmpty(cellValue : number) {
    return cellValue < 0
}

// Function to start/restart a game
function StartGame() {
    grid.value.forEach((row, rowIndex) => {
        row.forEach((col, colIndex) => {
            grid.value[rowIndex][colIndex] = -1
        })
    })
    SpawnRandomCell()
    SpawnRandomCell()
}

// Spawn a random tile on an empty spot
function SpawnRandomCell() {
    if (isGridFull()) { return }

    let randomRow, randomCol;
    do {
        randomRow = Math.floor(Math.random() * 4)
        randomCol = Math.floor(Math.random() * 4)
    } while (grid.value[randomRow][randomCol] !== -1 && !isGridFull())

    grid.value[randomRow][randomCol] = Math.random() < 0.9 ? 2 : 4
}

function HandleKeyPress (event: KeyboardEvent) {
    if (event.key !== 'ArrowUp' && event.key !== 'ArrowDown' && event.key !== 'ArrowLeft' && event.key !== 'ArrowRight' && isGameOver) {
        return
    }
    MoveCells(event)
}

onMounted(() => {
    console.log('mounted')
    window.addEventListener('keydown', HandleKeyPress)
    StartGame()
})
</script>

<template>
    <div class="container u-flex u-flex-direction-column u-align-items-center u-justify-content-center u-gap10">
        <div class="game-score">
            <p>Score : {{ score }}</p>
        </div>
        <div class="grid-container u-flex u-flex-direction-column u-p15 u-gap15">
            <div class="u-flex u-gap15" v-for="rows in grid">
                <div class="grid-cell" v-for="cell in rows"></div>
            </div>
            <div class="tile-container">
                <div v-for="(tile, index) in grid.flat()" :key="index">
                    <div v-if="tile > -1" :class="`tile tile-color-${tile} tile-position-${Math.floor(index / gridSize )}-${index % gridSize}`">{{ tile }}</div>
                </div>
            </div>
        </div>
        <div v-if="isGameOver" class="game-over-window u-flex u-flex-direction-column u-justify-content-center u-align-items-center u-noselect">
            <p>Game over !</p>
            <button @click="StartGame">Play again</button>
        </div>
    </div>
</template>

<style scoped lang="scss">
.container {
    position: relative;
    width: 100vw;
    height: 100vh;

    .game-score {
        padding: 15px 50px;
        border: 1px solid black;
        border-radius: 5px;
    }


    .game-over-window {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: white;
        padding: 75px;

        p {
            font-size: 40px;
        }

        button {
            font-size: 16px;
            cursor: pointer;
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
</style>