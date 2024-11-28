import { defineConfig } from 'vite'
import { globSync } from 'glob'

export default defineConfig({
    base: "/static/",
    build: {
        manifest: "manifest.json",
        outDir: "./static",
        rollupOptions: {
            input: globSync('jtremesay/front/main/*.ts'),
        }
    }
})