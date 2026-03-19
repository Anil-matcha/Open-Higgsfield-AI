import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
    plugins: [
        tailwindcss(),
    ],
    server: {
        port: 3000,
        proxy: {
            '/api': {
                target: 'https://api.muapi.ai',
                changeOrigin: true,
                secure: true,
                rewrite: (path) => path.replace(/^\/api/, '')
            }
        }
    },
    build: {
        target: 'esnext',
        minify: 'terser',
        terserOptions: {
            compress: {
                drop_console: true, // Remove console.log in production
                drop_debugger: true
            }
        },
        rollupOptions: {
            output: {
                manualChunks: {
                    // Vendor chunk for better caching
                    'vendor': ['@supabase/supabase-js'],
                },
                // Content hash for cache busting
                entryFileNames: 'assets/[name]-[hash].js',
                chunkFileNames: 'assets/[name]-[hash].js',
                assetFileNames: 'assets/[name]-[hash].[ext]'
            }
        },
        // Enable source maps for production debugging (optional)
        sourcemap: false,
        // Split chunks for better caching
        chunkSizeWarningLimit: 1000
    },
    preview: {
        port: 3000,
        headers: {
            'Cache-Control': 'public, max-age=31536000' // 1 year for assets
        }
    },
    define: {
        // Expose build info to the app
        __APP_VERSION__: JSON.stringify(process.env.npm_package_version || '1.0.0'),
        __BUILD_TIME__: JSON.stringify(new Date().toISOString())
    }
});
