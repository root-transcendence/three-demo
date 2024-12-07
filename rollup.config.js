import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';

export default {
  input: 'src/main.ts', // Entry file for your project
  output: {
    dir: "dist", // Output directory
    format: 'esm', // Use ES module format
    sourcemap: true,
    chunkFileNames: '[name]-[hash].js', // Output chunk file pattern
  },
  plugins: [
    resolve(), // Resolve node_modules
    commonjs(), // Convert CommonJS modules to ES6
    typescript({ tsconfig: './tsconfig.json' })
  ]
};
