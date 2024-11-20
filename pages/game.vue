<script setup lang="ts">

import {useMainStore} from "~/store";

const store = useMainStore();

const boardSize = computed(() => store.boardSize);
const gameType = computed(() => store.gameType);


</script>

<template>

    <p v-html="boardSize"></p>
    <p v-html="gameType"></p>

</template>

<style scoped lang="scss">

</style>