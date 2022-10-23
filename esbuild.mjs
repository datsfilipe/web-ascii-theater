import esbuild from 'esbuild'
import { nodeExternalsPlugin } from 'esbuild-node-externals'
import { copy } from 'esbuild-plugin-copy'

esbuild.build({
  entryPoints: ['src/index.ts'],
  outdir: 'dist/esm',
  bundle: true,
  sourcemap: true,
  minify: true,
  splitting: true,
  format: 'esm',
  target: 'esnext',
  plugins: [
    nodeExternalsPlugin(),
    copy({
      resolveFrom: 'cwd',
      assets: {
        from: [ './src/assets/frames/*' ],
        to: [ './dist/esm/assets/frames' ]
      }
    })
  ]
})

esbuild.build({
  entryPoints: ['src/index.ts'],
  outdir: 'dist/cjs',
  bundle: true,
  sourcemap: true,
  minify: true,
  format: 'cjs',
  target: 'esnext',
  plugins: [
    nodeExternalsPlugin(),
    copy({
      resolveFrom: 'cwd',
      assets: {
        from: [ './src/assets/frames/*' ],
        to: [ './dist/cjs/assets/frames' ]
      }
    })
  ]
})
