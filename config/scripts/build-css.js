const fs = require('fs')
const path = require('path')
const sass = require('node-sass')
const postcss = require('postcss')
const csso = require('postcss-csso')
const autoprefixer = require('autoprefixer')

const compress = process.argv[2] === 'minify'
const inDir = path.resolve('./web/app/themes/WordPressBP/css')
const outDir = path.resolve('./web/app/themes/WordPressBP/assets')

const postCssPlugins = []
if (compress) {
  postCssPlugins.push(csso({ comments: true }))
}
postCssPlugins.push(autoprefixer({ cascade: false }))

fs.readdir(inDir, (err, files) => {
  if (err) throw err

  files.filter(file => file.substring(file.length - 4) === 'scss').forEach(scss => {
    const fileObj = path.parse(path.join(inDir, scss))
    const css = path.join(outDir, `${fileObj.name}.css`)
    const map = `${css}.map`

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
