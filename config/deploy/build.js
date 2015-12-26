require('shelljs/global');

var
  assets = 'web/app/themes/WordPressBP/assets',
  version= Math.round(+new Date()/1000);
;

// Create build dir
mkdir('build');

// Export repository contents to build dir
exec('git archive --format=tar --prefix=build/ HEAD | (tar xf -)');

// Copy generated static assets into the build dir
cp(assets + '/*.{js,css}', 'build/' + assets);

// Replace version string (vDEV) in functions.php for cache busting
sed('-i', 'vDEV', version, 'build/web/app/themes/WordPressBP/functions.php');

// Uploads dir is not needed in build (will be symlinked into place on deploy)
rm('-fr', 'build/web/app/uploads');

// Move into build dir, fetch composer dependencies and create tarball
cd('build');
exec('composer install');

// Create tarball
exec('tar -zcf build.tar.gz *');
