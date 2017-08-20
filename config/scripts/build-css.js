const fs           = require('fs')
const path         = require('path')
const sass         = require('node-sass')
const postcss      = require('postcss')
const csso         = require('postcss-csso')
const autoprefixer = require('autoprefixer')

const compress = process.argv[2] === 'minify'
const inDir    = path.resolve('./web/app/themes/WordPressBP/css')
const outDir   = path.resolve('./web/app/themes/WordPressBP/assets')

var postCssPlugins = [
  autoprefixer({ cascade: false })
]

if (compress) {
  postCssPlugins.push(csso({ comments: true }))
}

fs.readdir(inDir, (err, files) => {
  if (err) throw err
  files.filter((file) => file.substr(-4) === 'scss').forEach((scss) => {
    var fileObj = path.parse(path.join(inDir, scss))
    var css = path.join(outDir, [fileObj.name, '.css'].join(''))
    var map = [css, '.map'].join('')

    sass.render({
      file: path.join(fileObj.dir, fileObj.base),
      outFile: css,
      outputStyle: 'compressed',
      sourceMap: !compress,
      includePaths: ['node_modules/']
    }, (err, result) => {
      if (err) throw err.formatted


      postcss(postCssPlugins)
      .process(result.css)
      .then((res) => {
        res.warnings().forEach((warn) => {
          console.log(warn.toString())
        })
        fs.writeFile(css, res.css, (err) => {
          if (err) throw err
        })
      })

      if (result.map) {
        fs.writeFile(map, result.map, (err) => {
          if (err) throw err
        })
      }
    })
  })
})
