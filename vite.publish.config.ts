import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dts from "vite-plugin-dts";

export default defineConfig({
    plugins: [
        react(),
        dts({
            tsconfigPath: "tsconfig.app.json",
            insertTypesEntry: true,
            include: ["src/index.ts", "src/FullscreenCanvas.tsx", "src/global.d.ts"],
            outDir: "dist/types",
            compilerOptions: {
                declaration: true,
                emitDeclarationOnly: true,
                noEmit: false,
            },
        }),
    ],
    build: {
        lib: {
            entry: "src/index.ts",
            name: "FullscreenCanvas",
            fileName: (format) => `FullscreenCanvas.${format}.js`,
            formats: ["es", "umd"],
        },
        rollupOptions: {
            external: ["react", "react-dom"],
            output: {
                globals: {
                    react: "React",
                    "react-dom": "ReactDOM",
                },
                assetFileNames: "FullscreenCanvas.[ext]",
            },
        },
    },
});
