import { defineConfig } from 'vite'
import { Glob, globSync } from 'glob';

export default defineConfig({
    publicDir: false,
    build: {
        manifest: true,
        rollupOptions: {
            input: globSync('website/front/**/main.ts', { absolute: true }).reduce((acc: Record<string, string>, file: string) => {
                const name = file.split('/').slice(-2, -1)[0];
                acc[name] = file;
                return acc;
            }, {})
        },
        outDir: 'dist/static/front/',
    }
}); 