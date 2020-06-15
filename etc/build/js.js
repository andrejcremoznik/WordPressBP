const path = require('path')
const rollup = require('rollup')
const babel = require('rollup-plugin-babel')
const { terser } = require('rollup-plugin-terser')
const commonjs = require('@rollup/plugin-commonjs')
const { default: resolve } = require('@rollup/plugin-node-resolve')

const compress = process.argv[2] === 'minify'

const plugins = [
  resolve(),
  commonjs({ include: 'node_modules/**' }),
  babel({ exclude: 'node_modules/**' })
]

if (compress) {
  plugins.push(terser())
}

rollup.rollup({
  input: path.resolve('./web/app/themes/WordPressBP/js/app.js'),
  external: ['jquery'],
  plugins,
  onwarn ({ loc, message }) {
    if (loc) {
      console.warn(`${loc.file} (${loc.line}:${loc.column}) ${message}`)
    } else {
      console.warn(message)
    }
  }
})
  .then(bundle => bundle.write({
    file: path.join(path.resolve('./web/app/themes/WordPressBP/assets'), 'app.js'),
    format: 'iife',
    name: 'WordPressBP',
    sourcemap: !compress,
    globals: {
      jquery: 'jQuery'
    }
  }))
  .catch(console.error)
