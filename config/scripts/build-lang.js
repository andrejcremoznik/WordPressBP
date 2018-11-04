const sh = require('shelljs')
const path = require('path')

sh.find(path.resolve('./web/app'))
  .filter(file => file.match(/\.po$/) && (file.match('plugins/WordPressBP') || file.match('themes/WordPressBP')))
  .forEach(lang => {
    const name = lang.substr(0, lang.length - 3)
    sh.exec(`msgfmt -o ${name}.mo ${name}.po`)
  })
