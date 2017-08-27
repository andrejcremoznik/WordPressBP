const path = require('path')
const sh   = require('shelljs')

sh.find(path.resolve('./web/app')).filter((file) => file.match(/\.po$/)).forEach((lang) => {
  var name = lang.substr(0, lang.length - 3)
  sh.exec([
    'msgfmt -o',
    name + '.mo',
    name + '.po'
  ].join(' '))
})
