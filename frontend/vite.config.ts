import { defineConfig, loadEnv, ServerOptions } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from "@tailwindcss/vite";
import path from "path";

// https://vite.dev/config/
export default defineConfig(({ mode }: { mode: string }) => {
  const env = loadEnv(mode, process.cwd());

  const isProduction = env.NODE_ENV === 'production';
  const backendUrl = env.VITE_BACKEND_URL;
  const socketUrl = env.VITE_SOCKET_URL;

  if(!backendUrl) throw new Error("VITE_BACKEND_URL is not defined");

  let proxy = {};

  if(isProduction) {
    proxy = {
      proxy: {
        '/api': {
          target: backendUrl,
          changeOrigin: true
        },
        '/socket.io': {
          changeOrigin: true,
          target: socketUrl,
          ws: true
        }
      }
    } satisfies ServerOptions
  }

  return {
    plugins: [
      react(),
      tailwindcss(),
    ],
    server: {
      ...proxy
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
      }
    }
  }
})
