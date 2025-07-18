import { defineConfig } from 'tsup';

export default defineConfig([
  {
    entry: ['src/index.ts', 'src/transports/stdio.ts', 'src/platform/index.ts'],
    format: ['cjs', 'esm'],
    outDir: 'dist',
    sourcemap: true,
    dts: true,
    minify: true,
    splitting: true,
    platform: 'node',
    target: 'node18',
    external: ['fs', 'path', 'crypto', 'url', 'util'],
    loader: {
      '.sql': 'text',
    },
    banner: {
      js: `import { createRequire } from 'module'; const require = createRequire(import.meta.url);`,
    },
  },
]);
