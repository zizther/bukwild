import {defineConfig, splitVendorChunkPlugin} from 'vite';
import copy from 'rollup-plugin-copy';
import manifestSRI from 'vite-plugin-manifest-sri';
import path from 'path';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import viteCompression from 'vite-plugin-compression';
import ViteRestart from 'vite-plugin-restart';
import removeConsole from 'vite-plugin-remove-console';
import preact from "@preact/preset-vite";


// https://vitejs.dev/config/
export default defineConfig(({command}) => ({
    base: command === 'serve' ? '' : '/dist/',
    build: {
        commonjsOptions: {
            transformMixedEsModules: true,
        },
        manifest: true,
        outDir: path.resolve(__dirname, 'web/dist/'),
        sourcemap: true,
        rollupOptions: {
            input: {
                platform: path.resolve(__dirname, 'src/js/platform.js'),
                app: path.resolve(__dirname, 'src/js/app.js'),
            },
            output: {
                manualChunks: function manualChunks(id) {
                    // console.log('====================');
                    // console.log({id});
                    // console.log('====================');

                    // Dependencies
                    if (id.includes('alpine')) {
                        return 'alpine';
                    }
                    if (id.includes('flickity')) {
                        return 'flickity';
                    }
                    if (id.includes('htmx')) {
                        return 'htmx';
                    }
                }
            },
            plugins: [
                // Used to remove comments from JS files
                terser({
                    format: {
                        // Remove all comments
                        comments: false
                    },
                    // Prevent any compression
                    compress: false
                }),
                removeConsole(),
                splitVendorChunkPlugin()
            ],
        },
    },
    esbuild: {
        loader: { '.js': 'jsx' },
    },
    plugins: [
        copy({
            targets: [
                {
                    src: 'src/static/*',
                    dest: 'web/dist'
                },
                {
                    src: 'web/assets/graphics/**/*',
                    dest: 'web/dist/graphics'
                },
                {
                    src: 'web/assets/fonts/**/*',
                    dest: 'web/dist/fonts'
                }
            ],
            hook: 'writeBundle'
        }),
        nodeResolve(),
        preact(),
        manifestSRI(),
        viteCompression({
            filter: /\.(js|mjs|json|css|map)$/i
        }),
        ViteRestart({
            reload: [
                'templates/**/*',
            ],
        }),
    ],
    publicDir: path.resolve(__dirname, 'src/public'),
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src'),
            '@css': path.resolve(__dirname, 'src/pcss'),
            '@js': path.resolve(__dirname, 'src/js'),
        },
    },
    server: {
        fs: {
            strict: false
        },
        host: '0.0.0.0',
        origin: 'http://localhost:3000',
        port: 3000,
        strictPort: true,
    },
}));
