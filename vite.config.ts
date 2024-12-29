import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { defineConfig as vitestDefineConfig } from 'vitest/config'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue()],
    test: {
        globals: true,      // Pour activer les assertions globales comme `expect`
        environment: 'jsdom',  // Pour utiliser l'environnement DOM virtuel de jsdom
        setupFiles: ['./tests/setup.ts'],
    },
})
