<template>
  <div :class="['leaderboard-container', { dark: isDarkMode }]">
    <div class="button-container">
      <button @click="restartGame" class="btn">Rejouer</button>
      <button @click="goToSettings" class="btn">Nouvelle partie</button>
      <button @click="toggleDarkMode" class="btn toggle-btn">
        {{ isDarkMode ? 'Mode Clair' : 'Mode Sombre' }}
      </button>
    </div>

    <table class="leaderboard-table">
      <thead>
        <tr>
          <th>Rank</th>
          <th>Pseudo</th>
          <th>Score</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(player, index) in players" :key="index">
          <td>{{ index + 1 }}</td>
          <td>{{ player.name }}</td>
          <td>{{ player.score }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      players: [
        { name: 'Alice', score: 100 },
        { name: 'Bob', score: 80 },
        { name: 'Charlie', score: 60 },
      ],
      isDarkMode: false,
    };
  },
  methods: {
    restartGame() {
      alert('Le jeu redémarre !');
    },
    goToSettings() {
      this.$router.push('/settings');
    },
    toggleDarkMode() {
      this.isDarkMode = !this.isDarkMode;
    },
  }
};
</script>

<style scoped>
.leaderboard-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
  margin-top: 13%;
  background-color: #f9f9f9; /* Couleur de fond par défaut (mode clair) */
  transition: background-color 0.3s, color 0.3s;
}

.dark {
  background-color: #776e65; /* Couleur de fond en mode sombre */
  color: #f9f9f9;
}

h1 {
  font-family: 'Arial', sans-serif;
  color: inherit;
  margin-bottom: 20px;
}

.button-container {
  margin-bottom: 20px;
  display: flex;
  justify-content: center;
}

.btn {
  padding: 10px 20px;
  margin: 0 5px;
  background-color: #bbada0;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s, transform 0.2s;
}

.btn:hover {
  background-color: #8f7a66;
  transform: translateY(-2px);
}

.toggle-btn {
  background-color: #8f7a66;
}

.toggle-btn:hover {
  background-color: #776e65;
}

.leaderboard-table {
  width: 100%;
  border-collapse: collapse;
}

.leaderboard-table th, .leaderboard-table td {
  border: 1px solid #ddd;
  padding: 12px;
  text-align: left;
}

.leaderboard-table th {
  background-color: #bbada0;
  color: white;
  font-weight: bold;
}

.leaderboard-table tr:nth-child(even) {
  background-color: rgba(238, 228, 218, 0.35);
}

.leaderboard-table tr:hover {
  background-color: #e9ecef;
}

.dark .leaderboard-table th {
  background-color: #8f7a66;
}

.dark .leaderboard-table tr:nth-child(even) {
  background-color: rgba(238, 228, 218, 0.35);
}

.dark .leaderboard-table tr:hover {
  background-color: #776e65;
}
</style>
