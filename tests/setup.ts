import { vi } from 'vitest';
import { createPinia } from 'pinia';
import { config } from '@vue/test-utils';
import { mount } from '@vue/test-utils';
import { createApp } from 'vue';

// Créer un Pinia
const pinia = createPinia();

// Configurer Vue avec Pinia pour les tests
config.global.plugins = [
    pinia,  // Ajout de Pinia aux plugins globaux pour chaque test
];
