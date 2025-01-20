import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";
import pkg from "./package.json";

export default defineConfig({
    plugins: [
        react(),
    ],
    build: {
        chunkSizeWarningLimit: 1000,
        rollupOptions: {
            output: {
                // use version from package.json
                assetFileNames: `assets/[name]-${pkg.version}[extname]`,  // CSS, images, fonts, etc
                entryFileNames: `assets/[name]-${pkg.version}.js`,        // main JS entry points
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
