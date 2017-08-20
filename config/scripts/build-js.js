const fs   = require('fs')
const path = require('path')
const rollup = require('rollup')
const resolve = require('rollup-plugin-node-resolve')
const commonjs = require('rollup-plugin-commonjs')
const babel = require('rollup-plugin-babel')
const minify = require('rollup-plugin-babel-minify')

const compress = process.argv[2] === 'minify'
const entry = path.resolve('./web/app/themes/WordPressBP/js/main.js')
const outDir = path.resolve('./web/app/themes/WordPressBP/assets')

var plugins = [
  resolve({ jsnext: true, main: true }),
  commonjs({ include: 'node_modules/**' }),
  babel()
]

if (compress) {
  plugins.push(minify({ comments: false }))
}

rollup.rollup({
  entry,
  external: ['jquery'],
  plugins,
  onwarn(warning) {
    console.warn(warning.message)
  }
})
.then((bundle) => {
  return bundle.generate({
    format: 'umd',
    moduleName: 'WordPressBP',
    globals: {
      jquery: '$'
    },
    sourceMap: !compress
  })
})
.then((result) => {
  fs.writeFile(path.join(outDir, 'app.js'), result.code, (err) => {
    if (err) throw err
  })

  if (result.map) {
    fs.writeFile(path.join(outDir, 'app.js.map'), result.map, (err) => {
      if (err) throw err
    })
  }
})
.catch((err) => {
  throw err
})
