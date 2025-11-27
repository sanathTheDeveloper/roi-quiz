import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(() => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Optimize for WordPress embedding
    cssCodeSplit: false, // Single CSS file for easier embedding
    rollupOptions: {
      output: {
        // Wrap in IIFE to prevent global namespace pollution
        format: 'iife' as const,
        // Predictable filenames for WordPress integration
        entryFileNames: 'assets/roi-quiz.js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name].[ext]',
        // Preserve dynamic imports for Radix UI components
        manualChunks: undefined,
        // Add banner and footer comments for debugging
        banner: '/* 24/7 AI Healthcare Receptionist ROI Calculator v12 - WordPress Optimized */',
        intro: '/* Calculator namespace isolation */',
        outro: '/* End calculator namespace */',
      }
    },
    // Increase chunk size limit to inline more code
    chunkSizeWarningLimit: 1000,
    // Minify for production
    minify: 'terser' as const,
    terserOptions: {
      compress: {
        drop_console: false, // Keep console for debugging
      }
    }
  }
}));
