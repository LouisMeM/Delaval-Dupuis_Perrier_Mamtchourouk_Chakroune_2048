<script setup lang="ts">

import { useMainStore} from "~/store";
import { ref } from 'vue'

const store = useMainStore();


</script>

<template>

    <div class="u-flex u-align-content-center u-justify-content-center u-flex-direction-column h100">

    <NuxtLink to="game" class="play-button u-p15">Play</NuxtLink>

      <div>
        <NuxtLink to="parametrages">Paramétrages</NuxtLink>
        <NuxtLink to="scores"> Scores</NuxtLink>
      </div>

    </div>

</template>

<style scoped lang="scss">

.PlayButton {
  background-color: #ffc67d;
  border-radius: 4px;

}



</style>