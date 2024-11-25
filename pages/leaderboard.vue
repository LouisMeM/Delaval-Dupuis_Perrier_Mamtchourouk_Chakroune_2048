<script>
import Papa from 'papaparse';

export default {
  // Composant Vue pour la gestion des joueurs et des scores
  data() {
    return {
      players: [],
      isDarkMode: false,
      currentPage: 1,
      playersPerPage: 15,
      currentMode: 'infinite',
    };
  },

  computed: {
    /**
     * Retourne la liste des joueurs triée en fonction du mode actif.
     * - Mode 'normal' : tri par temps croissant.
     * - Mode 'infinite' : tri par score décroissant.
     */
    sortedPlayers() {
      return this.players.sort((a, b) => {
        if (this.currentMode === 'normal') {
          return a.score - b.score; // Tri croissant (temps)
        } else {
          return b.score - a.score; // Tri décroissant (score)
        }
      });
    },

    /**
     * Retourne les joueurs paginés en fonction de la page actuelle.
     */
    paginatedPlayers() {
      const startIndex = (this.currentPage - 1) * this.playersPerPage;
      const endIndex = startIndex + this.playersPerPage;
      return this.sortedPlayers.slice(startIndex, endIndex);
    },

    /**
     * Retourne le nombre total de pages nécessaires pour afficher tous les joueurs.
     */
    totalPages() {
      return Math.ceil(this.players.length / this.playersPerPage);
    }
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

    changePage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
      }
    },

    setMode(mode) {
      this.currentMode = mode;
      this.loadCSVData(mode);
    },

    /**
     * Charge les données depuis un fichier CSV en fonction du mode sélectionné.
     */
    loadCSVData(mode) {
      const fileName = mode === 'infinite' ? 'bdd_2048_infinite.csv' : 'bdd_2048_normal.csv';

      fetch(`/${fileName}`)
        .then(response => response.text())
        .then(csvData => {
          Papa.parse(csvData, {
            delimiter: ';', // Délimiteur utilisé dans le fichier CSV
            complete: (result) => {
              // Transformation des données CSV en objets joueurs
              this.players = result.data.map(row => ({
                name: row[0],
                score: mode === 'normal'
                  ? this.convertTimeToSeconds(row[1])
                  : parseInt(row[1], 10),
              }));
            },
            header: false,
            skipEmptyLines: true,
          });
        })
        .catch(error => {
          console.error('Erreur lors du chargement du fichier CSV:', error);
        });
    },

    formatTime(seconds) {
      const minutes = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${minutes}:${secs < 10 ? '0' + secs : secs}`;
    },

    convertTimeToSeconds(timeStr) {
      const [minutes, seconds] = timeStr.split(':').map(Number);
      return minutes * 60 + seconds;
    }
  },

  /**
   * Charge les données CSV en fonction du mode par défaut (infinite).
   */
  mounted() {
    this.loadCSVData(this.currentMode);
  }
};
</script>

<template>
  <div :class="['leaderboard-container', { dark: isDarkMode }]">

    <div class="button-container">
      <button @click="restartGame" class="btn">Rejouer</button>
      <button @click="goToSettings" class="btn">Nouvelle partie</button>
      <button @click="toggleDarkMode" class="btn toggle-btn">
        {{ isDarkMode ? 'Mode Clair' : 'Mode Sombre' }}
      </button>
    </div>

    <!-- Section pour la sélection des modes de jeu -->
    <div class="button-container">
      <button
        @click="setMode('infinite')"
        class="btn"
        :class="{ selected: currentMode === 'infinite' }">
        Mode Infini
      </button>
      <button
        @click="setMode('normal')"
        class="btn"
        :class="{ selected: currentMode === 'normal' }">
        Mode contre la montre
      </button>
    </div>

    <!-- Affichage dynamique du titre du leaderboard en fonction du mode sélectionné -->
    <h1 v-if="currentMode">
      {{ currentMode === 'infinite' ? 'Leaderboard Mode Infini' : 'Leaderboard Mode Contre la Montre' }}
    </h1>

    <!-- Tableau des scores -->
    <table class="leaderboard-table">
      <thead>
        <tr>
          <!-- En-têtes du tableau -->
          <th>Rank</th>
          <th>Pseudo</th>
          <th>{{ currentMode === 'normal' ? 'Temps' : 'Score' }}</th>
        </tr>
      </thead>
      <tbody>
        <!-- Affichage des joueurs paginés -->
        <tr v-for="(player, index) in paginatedPlayers" :key="index">
          <td>{{ index + 1 + (currentPage - 1) * playersPerPage }}</td>
          <td>{{ player.name }}</td>
          <td>{{ currentMode === 'normal' ? formatTime(player.score) : player.score }}</td>
        </tr>
      </tbody>
    </table>

    <!-- Section de pagination -->
    <div class="pagination">
      <button @click="changePage(currentPage - 1)" :disabled="currentPage === 1">Précédent</button>
      <span>{{ currentPage }} / {{ totalPages }}</span>
      <button @click="changePage(currentPage + 1)" :disabled="currentPage === totalPages">Suivant</button>
    </div>
  </div>
</template>

<style scoped>
/* Conteneur principal du leaderboard */
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
  margin-top: 2%;
  background-color: #f9f9f9;
  transition: background-color 0.3s, color 0.3s;
}

/* Mode sombre pour le conteneur */
.dark {
  background-color: #776e65;
  color: #f9f9f9;
}

/* Style du titre */
h1 {
  font-family: 'Arial', sans-serif;
  color: inherit;
  margin-bottom: 20px;
  font-size: 2em;
}

/* Conteneur des boutons */
.button-container {
  margin-bottom: 20px;
  display: flex;
  justify-content: center;
}

/* Style de base pour les boutons */
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

/* Effet de survol des boutons */
.btn:hover {
  background-color: #8f7a66;
  transform: translateY(-2px);
}

/* Style pour le bouton actif/actuellement sélectionné */
.selected {
  background-color: #8f7a66;
}

/* Boutons de basculement (clair/sombre) */
.toggle-btn {
  background-color: #8f7a66;
}

/* Survol spécifique pour le bouton de basculement */
.toggle-btn:hover {
  background-color: #776e65;
}

/* Style de la table des scores */
.leaderboard-table {
  width: 100%;
  border-collapse: collapse;
}

/* Cellules et entêtes de la table */
.leaderboard-table th, .leaderboard-table td {
  border: 1px solid #ddd;
  padding: 12px;
  text-align: left;
}

/* Style des en-têtes */
.leaderboard-table th {
  background-color: #bbada0;
  color: white;
  font-weight: bold;
}

/* Style des lignes alternées */
.leaderboard-table tr:nth-child(even) {
  background-color: rgba(238, 228, 218, 0.35);
}

/* Effet de survol des lignes */
.leaderboard-table tr:hover {
  background-color: #e9ecef;
}

/* Adaptation au mode sombre */
.dark .leaderboard-table th {
  background-color: #8f7a66;
}

.dark .leaderboard-table tr:nth-child(even) {
  background-color: rgba(238, 228, 218, 0.35);
}

.dark .leaderboard-table tr:hover {
  background-color: #776e65;
}

/* Section de pagination */
.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* Boutons de pagination */
.pagination button {
  padding: 5px 10px;
  background-color: #bbada0;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  margin: 0 5px;
}

/* Boutons désactivés */
.pagination button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
</style>
