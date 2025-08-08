// client/vite.config.js
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger"; // Keep this as it's in your devDependencies

// https://vitejs.dev/config/
export default ({ mode }) => ({
  server: {
    host: "::",
    port: 5173,
  },
  plugins: [
    // Ensure react() is always the first plugin in the array
    react(),
    // componentTagger is only active in development mode, place it after react()
    mode === "development" && componentTagger(), // This will be included if mode is 'development'
  ].filter(Boolean), // .filter(Boolean) removes any falsey values (like `false` from `mode === "development" && componentTagger()`)
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // Vite will automatically pick up `postcss.config.js`
  // so you don't need `css.postcss` config here.
});
