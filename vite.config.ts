import { defineConfig } from 'vite'
import { globSync } from 'tinyglobby';

const BASE_DIR = "website/front/";


export default defineConfig({
    publicDir: false,
    resolve: {
        alias: {
            '@': BASE_DIR,
        },
    },
    build: {
        assetsDir: '',
        manifest: true,
        outDir: 'dist/static/front',
        rollupOptions: {
            input: Object.fromEntries(
                globSync(`${BASE_DIR}**/main.ts`).map((file) => [
                    file.replace(BASE_DIR, '').replace(/\.ts$/, ''), file
                ]
                ),
            ),
        },
        sourcemap: true,
    }
}); 