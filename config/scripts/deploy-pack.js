const sh = require('shelljs')
const path = require('path')

const assets = 'web/app/themes/WordPressBP/assets'
const version = Math.round(+new Date() / 1000).toString()

// Create build dir
sh.mkdir('build')

// Export repository contents to build dir
sh.exec('git archive --format=tar --prefix=build/ HEAD | (tar xf -)')

// TODO: Copy files outside git or composer into CONTENT_DIR
// - Don't use wildcards here, copy them 1 by 1
// - Destination is always inside build directory
// Examples:
// sh.cp('-fr', 'web/app/plugins/some-plugin', 'build/web/app/plugins/')
// sh.cp('-fr', 'web/app/themes/some-theme', 'build/web/app/themes/')
// sh.cp('-fr', 'web/app/languages/*', 'build/web/app/languages/') // You may use a wildcard for languages

// Copy generated static assets into the build dir
sh.cp(`${assets}/*.js`, `build/${assets}/`)
sh.cp(`${assets}/*.css`, `build/${assets}/`)
sh.find('./web/app')
  .filter(file => file.match(/\.mo$/) && (file.match('plugins/WordPressBP') || file.match('themes/WordPressBP')))
  .forEach(lang => {
    sh.cp(lang, path.join('build', lang))
  })

// Replace version string (vDEV) in functions.php for cache busting
sh.sed('-i', 'vDEV', version, path.resolve('./build/web/app/themes/WordPressBP/functions.php'))

// Move into build dir, fetch composer dependencies
sh.cd('build')
sh.exec('composer install -o')

// TODO: Include themes and plugins bundled with WP in CONTENT_DIR
// sh.mv('web/wp/wp-content/themes/*', 'web/app/themes/')
// sh.mv('web/wp/wp-content/plugins/*', 'web/app/plugins/')
// sh.rm('-f', 'web/app/plugins/hello.php')

// Create tarball
sh.exec('tar -zcf build.tar.gz *')
