import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [],
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: 'src/index.tsx',
      external: ['__STATIC_CONTENT_MANIFEST'],
      output: {
        entryFileNames: '_worker.js',
        format: 'es'
      }
    },
    ssr: true,
    target: 'esnext'
  }
})
