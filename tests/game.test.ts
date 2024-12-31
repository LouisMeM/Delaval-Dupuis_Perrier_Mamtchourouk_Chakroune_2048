import { mount } from '@vue/test-utils';
import game from '../pages/game.vue';

describe('game.vue', () => {

    it('devrait initialiser une grille vide avec deux tuiles', async () => {
        const wrapper = mount(game);
        await wrapper.vm.$nextTick();

        const tiles = wrapper.vm.grid.flat().filter(cell => cell > -1);
        expect(tiles.length).toBe(2); // Deux tuiles doivent être initialisées
    });

    it('devrait mettre à jour le score lors de la fusion de tuiles', async () => {
        const wrapper = mount(game);
        wrapper.vm.grid = [
            [2, 2, -1, -1],
            [-1, -1, -1, -1],
            [-1, -1, -1, -1],
            [-1, -1, -1, -1],
        ];
        await wrapper.vm.MoveCells({ key: 'ArrowLeft' });

        expect(wrapper.vm.grid[0][0]).toBe(4); // La fusion donne 4
        expect(wrapper.vm.score).toBe(4); // Le score est mis à jour
    });

    it('devrait détecter la fin de jeu si aucune fusion n’est possible', async () => {
        const wrapper = mount(game);

        wrapper.vm.grid = [
            [2, 4, 8, 16],
            [32, 64, 128, 256],
            [512, 1024, 2048, 4096],
            [8192, 16384, 32768, 65536],
        ];
        await wrapper.vm.$nextTick();

        expect(wrapper.vm.isGameOver).toBe(true); // Aucune fusion possible, jeu terminé
    });

    it('devrait permettre de recommencer une partie', async () => {
        const wrapper = mount(game);

        wrapper.vm.grid = [
            [2, 4, 8, 16],
            [32, 64, 128, 256],
            [512, 1024, 2048, 4096],
            [8192, 16384, 32768, 65536],
        ];
        wrapper.vm.StartGame();
        await wrapper.vm.$nextTick();

        const tiles = wrapper.vm.grid.flat().filter(cell => cell > -1);
        expect(tiles.length).toBe(2); // Après redémarrage, seulement 2 tuiles
        expect(wrapper.vm.score).toBe(0); // Le score est réinitialisé
    });

    it('devrait bloquer les mouvements si le jeu est terminé', async () => {
        const wrapper = mount(game);

        wrapper.vm.grid = [
            [2, 4, 8, 16],
            [32, 64, 128, 256],
            [512, 1024, 2048, 4096],
            [8192, 16384, 32768, 65536],
        ];
        wrapper.vm.HandleKeyPress({ key: 'ArrowUp' });
        await wrapper.vm.$nextTick();

        const gridCopy = JSON.stringify(wrapper.vm.grid);
        wrapper.vm.MoveCells({ key: 'ArrowUp' });

        expect(JSON.stringify(wrapper.vm.grid)).toBe(gridCopy); // Aucune modification de la grille
    });

    it('devrait ajouter une tuile aléatoire après un mouvement valide', async () => {
        const wrapper = mount(game);

        wrapper.vm.grid = [
            [2, -1, -1, -1],
            [-1, -1, -1, -1],
            [-1, -1, -1, -1],
            [-1, -1, -1, -1],
        ];
        wrapper.vm.MoveCells({ key: 'ArrowRight' });
        await wrapper.vm.$nextTick();

        const tiles = wrapper.vm.grid.flat().filter(cell => cell > -1);
        expect(tiles.length).toBe(2); // Une nouvelle tuile doit apparaître
    });
});
