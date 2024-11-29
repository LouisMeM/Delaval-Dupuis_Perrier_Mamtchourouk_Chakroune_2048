<script setup lang="ts">

import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useMainStore } from '~/store';

const router = useRouter();
const store = useMainStore();

const gameType = ref('2048');
const boardSize = ref(4);

onMounted(() => {
  const btn2048 = document.getElementById('2048');
  const btn4x4 = document.getElementById('4x4');

    btn2048.checked = true;
    btn4x4.checked = true;
});

// enregistre les paramètres du jeu
const handleSubmit = () => {
  store.updateGameSettings({
    gameType: gameType.value,
    boardSize: boardSize.value,
  });
    console.log(store.boardSize);
  // redirige vers la page du jeu
  router.push('/game');
};

</script>

<template>

  <div class="u-flex u-flex-direction-column u-gap30">

    <h1>2048</h1>

    <!-- Si l'utilisateur clique sur confirmer, on lance le jeu avec les paramètres qu'il a choisi -->

    <form @submit.prevent="handleSubmit" class="border u-flex u-flex-direction-column u-align-self-center u-gap20">


      <!-- Soit le jeu fini lorsque le bloc 2048 apparaît, soit le jeu est infini -->

      <div class="u-flex u-p20 u-justify-content-center u-gap50 u-gap20--s">

        <h2 class="u-flex vertical-align u-justify-content-center">Type</h2>

        <div class="vertical-align u-flex u-justify-content-center u-gap5">
          <input  type="radio" id="2048" name="type" value="2048" v-model="gameType" checked />
          <label for="2048">2048</label>
        </div>

        <div class="vertical-align u-flex u-justify-content-center u-gap5">
          <input type="radio" id="Infini" name="type" value="Infini" v-model="gameType" />
          <label for="Infini">Infini</label>
        </div>
      </div>


      <!-- Choix de la taille du plateau -->

      <div class="u-flex u-justify-content-center u-gap20 u-gap10--s">

        <h2>Taille du plateau</h2>

        <div class="vertical-align u-flex u-justify-content-center u-gap5">
          <input type="radio" id="4x4" name="taille" :value="4" v-model="boardSize" checked />
          <label for="4x4">4x4</label>
        </div>

        <div class="vertical-align u-flex u-justify-content-center u-gap5">
          <input type="radio" id="5x5" name="taille" :value="5" v-model="boardSize" />
          <label for="5x5">5x5</label>
        </div>

        <div class="vertical-align u-flex u-justify-content-center u-gap5">
          <input type="radio" id="6x6" name="taille" :value="6" v-model="boardSize" />
          <label for="6x6">6x6</label>
        </div>

        <div class="vertical-align u-flex u-justify-content-center u-gap5">
          <input type="radio" id="7x7" name="taille" :value="7" v-model="boardSize" />
          <label for="7x7">7x7</label>
        </div>
      </div>

      <!-- On garde les paramètres choisis et on passe au jeu en cliquant sur ce bouton -->

      <div class="u-flex u-justify-content-center u-gap20">
        <button type="submit" class="beige-button">Jouer</button>
      </div>

    </form>
  </div>

</template>

<style scoped>

.border {
  border: 1px solid lightgray;
  border-radius: 8px;
  margin: 20px;
  padding: 50px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  font-size: 2vw;
}

h1 {
  background-color: #bbada0;
  padding: 30px;
  font-size: 3.5vw;
  text-align: center;
}

h2 {
  font-size: 2.5vw;
}

.beige-button {
    color: black;
    border: none;
    padding: 10px 20px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 1vw;
    cursor: pointer;
    border-radius: 8px;
    background-color: #bbada0;

    }

input, select {
  font-size: 1.5vw;
}

.vertical-align {
  display: flex;
  align-items: center;
}


@media (max-width: 1300px) {

  .border {
    padding: 20px;
    font-size: 24px;
  }

  h1 {
    font-size: 32px;
  }

  h2 {
    font-size: 20px;
  }

  input, select {
    font-size: 20px;
  }

  .beige-button {
    font-size: 16px;
    padding: 8px 16px;
  }
}


@media (max-width: 480px) {

  .border {
    padding: 10px;
    font-size: 16px;
  }

  input, select {
    font-size: 16px;
  }

  .beige-button {
    font-size: 14px;
    padding: 6px 12px;
  }

  .u-flex {
    flex-direction: column;
  }
}

</style>