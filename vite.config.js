import { viteStaticCopy } from "vite-plugin-static-copy";
import gltfPlugin from 'vite-plugin-gltf';

export default {
    base: "./",
    root: "src",
    publicDir: "public",
    server: {
        port: 1200,
        sourcemap: true
    },
    build: {
        outDir: "../dist",
        emptyOutDir: true
    },
    plugins: [
        gltfPlugin(),
        viteStaticCopy({
            targets: [
                {
                    src: ".htaccess",
                    dest: "../dist"
                },
                {
                    src: "robots.txt",
                    dest: "../dist"
                },
                {
                    src: "libs",
                    dest: "../dist"
                }
            ]
        })
    ]
}