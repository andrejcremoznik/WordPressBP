const sh = require('shelljs')
const assets = 'web/app/themes/WordPressBP/assets'
const version = Math.round(+new Date() / 1000)

// Create build dir
sh.mkdir('build')

// Export repository contents to build dir
sh.exec('git archive --format=tar --prefix=build/ HEAD | (tar xf -)')

// Copy generated static assets into the build dir
sh.cp(assets + '/*.js', 'build/' + assets)
sh.cp(assets + '/*.css', 'build/' + assets)

// Replace version string (vDEV) in functions.php for cache busting
sh.sed('-i', 'vDEV', version, 'build/web/app/themes/WordPressBP/functions.php')

// Uploads dir is not needed in build (will be symlinked into place on deploy)
sh.rm('-fr', 'build/web/app/uploads')

// Move into build dir, fetch composer dependencies and create tarball
sh.cd('build')
sh.exec('composer install -o')

// Create tarball
sh.exec('tar -zcf build.tar.gz *')
