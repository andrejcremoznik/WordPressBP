const fs = require('fs')
const path = require('path')
const sass = require('node-sass')
const postcss = require('postcss')
const csso = require('postcss-csso')
const autoprefixer = require('autoprefixer')

const compress = process.argv[2] === 'minify'
const inDir = path.resolve('./web/app/themes/WordPressBP/css')
const outDir = path.resolve('./web/app/themes/WordPressBP/assets')

let postCssPlugins = []
if (compress) {
  postCssPlugins.push(csso({ comments: true }))
}
postCssPlugins.push(autoprefixer({ cascade: false }))

fs.readdir(inDir, (err, files) => {
  if (err) throw err
  files.filter(file => file.substr(-4) === 'scss').forEach(scss => {
    let fileObj = path.parse(path.join(inDir, scss))
    let css = path.join(outDir, [fileObj.name, '.css'].join(''))
    let map = [css, '.map'].join('')

    sass.render({
      file: path.join(fileObj.dir, fileObj.base),
      outFile: css,
      outputStyle: 'compressed',
      sourceMap: !compress,
      includePaths: ['node_modules/']
    }, (err, result) => {
      if (err) throw err.formatted

      postcss(postCssPlugins)
        .process(result.css, { from: css, to: css })
        .then(res => {
          res.warnings().forEach(warn => {
            console.log(warn.toString())
          })
          fs.writeFile(css, res.css, err => {
            if (err) throw err
          })
        })

      if (result.map) {
        fs.writeFile(map, result.map, err => {
          if (err) throw err
        })
      }
    })
  })
})
