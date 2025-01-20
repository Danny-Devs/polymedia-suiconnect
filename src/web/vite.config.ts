import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

export default defineConfig({
    plugins: [
        react(),
    ],
    build: {
        chunkSizeWarningLimit: 1000,
        rollupOptions: {
            output: {
                // disable hashing for assets
                assetFileNames: 'assets/[name][extname]',  // CSS, images, fonts, etc
                entryFileNames: 'assets/[name].js',        // main JS entry points
                chunkFileNames: 'assets/[name].js',        // dynamic imports & vendor chunks
            }
        }
    },
    preview: {
        port: 1234,
    },
    server: {
        port: 1234,
    },
    resolve: {
        dedupe: ['react', 'react-dom']
    },
});
