<script setup lang="ts">

const grid = ref([
    [-1, -1, -1, -1],
    [-1, -1, -1, -1],
    [-1, -1, -1, -1],
    [-1, -1, -1, -1],
]);

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


// TODO : Implement the logic for moving the cells
function MoveCells (event : KeyboardEvent) {
    switch (event.key) {
        case 'ArrowUp':
            console.log('up')
            break
        case 'ArrowDown':
            console.log('down')
            break
        case 'ArrowLeft':
            console.log('left')
            break
        case 'ArrowRight':
            console.log('right')
            break
    }
}

function SpawnRandomCell() {
    // If the grid is full, return
    if (isGridFull()) { return }

    let randomRow, randomCol;
    do {
        randomRow = Math.floor(Math.random() * 4)
        randomCol = Math.floor(Math.random() * 4)
    } while (grid.value[randomRow][randomCol] !== -1 && !isGridFull())


    grid.value[randomRow][randomCol] = Math.random() < 0.9 ? 2 : 4

}

function HandelKeyPress (event: KeyboardEvent) {
    if (event.key !== 'ArrowUp' && event.key !== 'ArrowDown' && event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') {
        return
    }
    MoveCells(event)
    SpawnRandomCell()
}



onMounted(() => {
    console.log('mounted')
    window.addEventListener('keydown', HandelKeyPress)
})

</script>

<template>
    <div class="grid-container u-flex u-align-items-center u-justify-content-center u-flex-direction-column u-noselect">
        <div class="u-flex grid-row" v-for="row in grid" :key="row">
            <div class="w100px h100px grid-cell u-flex u-justify-content-center u-align-items-center" v-for="cell in row" >
                <p> {{ cell > 0 ? cell : "" }} </p>
            </div>
        </div>
    </div>

</template>

<style scoped lang="scss">

.grid-container {
    width: 100vw;
    height: 100vh;

    .grid-cell {

        background-color: #ccc;
        margin: 5px;
        font-size: 22px;

    }
}

</style>