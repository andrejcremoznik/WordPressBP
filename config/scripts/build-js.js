const path = require('path')
const rollup = require('rollup')
const babel = require('rollup-plugin-babel')
const minify = require('rollup-plugin-babel-minify')
const commonjs = require('rollup-plugin-commonjs')
const resolve = require('rollup-plugin-node-resolve')

const compress = process.argv[2] === 'minify'

const plugins = [
  resolve({ jsnext: true }),
  commonjs({ include: 'node_modules/**' }),
  babel()
]

if (compress) {
  plugins.push(minify({ comments: false }))
}

rollup.rollup({
  input: path.resolve('./web/app/themes/WordPressBP/js/main.js'),
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
    format: 'umd',
    name: 'WordPressBP',
    sourcemap: !compress,
    globals: {
      jquery: 'jQuery'
    }
  }))
  .catch(console.error)
