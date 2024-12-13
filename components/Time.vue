<script setup lang="ts">
    const time = ref(0)
    let timer: number
    const startTimer = () => {
        if(!timer) {
            timer = setInterval(() => {
                time.value++;
            }, 1000)
        }
    }

</script>

<template>
    <p> {{time}} </p>
</template>

<style scoped lang="scss">

</style>