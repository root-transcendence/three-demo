import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';

export default {
  input: 'src/main.js',
  output: {
    dir: "dist",
    format: 'esm',
    sourcemap: true,
    chunkFileNames: '[name]-[hash].js',
  },
  plugins: [
    resolve(),
    commonjs(),
  ]
};
