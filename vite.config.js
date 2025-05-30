import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  root: '.', // Diretório raiz do projeto
  server: {
    host: true, // Permite acesso externo
    port: 5173,
    open: true, // Abre o navegador automaticamente
    cors: true // Permite CORS
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  }
}) 