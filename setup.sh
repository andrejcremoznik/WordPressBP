#!/usr/bin/env bash

if [ $# -lt 2 ]; then
  echo "Usage:
  $0 <namespace> <project_path> [<branch>]
Params:
  <namespace>:    Lowercase alphanumeric name for your project. Must not start with a number. Must be file system and URL friendly.
  <project_path>: Absolute path to directory where the project will be set up.
  <branch>:       Branch from which to create the project. Defaults to 'master'.
Example:
  $0 mything /srv/http/mything.dev"
  exit
fi

namespace="$1"
project_path=${2%/}

# Make sure $project_path exists, is writeable and clean
if [ ! -d $project_path ]; then
  echo "==> The directory $project_path does not exist. Creating…"
  mkdir ${project_path}
  if [ $? -ne 0 ] ; then
    echo "==> Cannot create $project_path. Check write permissions. Aborting…"
  fi
else
  echo -e "==> The directory $project_path already exist."
  read -e -p "Delete everything inside $project_path? (y/n): " cont
  if [ "$cont" != "y" ]; then
    echo "Aborting…"
    exit
  fi
  if [ -w $project_path ] ; then
    cd $project_path
    rm -f .[^.] .??*
    rm -fr *
    cd - 2>&1 >/dev/null
  else
    echo "==> Cannot empty $project_path. Check write permissions. Aborting…"
  fi
fi

# Required software check
echo "==> Checking for required software…
For instructions on how to set these up, please read https://gist.github.com/andrejcremoznik/07429341fff4f318c5dd"
command -v composer >/dev/null 2>&1 || { echo >&2 "Composer not installed. Aborting…"; exit 1; }
command -v npm >/dev/null 2>&1 || { echo >&2 "NPM not installed. Aborting…"; exit 1; }
command -v wp >/dev/null 2>&1 || { echo >&2 "WP-CLI not installed. Aborting…"; exit 1; }
command -v msgfmt >/dev/null 2>&1 || { echo >&2 "msgfmt not found. Please install gettext. Aborting…"; exit 1; }
echo "==> All there."

# Export files to project
echo "==> Creating a working copy of WordPressBP in $project_path"
git archive --format=tar ${3:-master} | tar -x -C $project_path

# Replace WordPressBP in folder and file names with $namespace
echo "==> Renaming folders and files…"
for f in `find $project_path -depth -name '*WordPressBP*'`; do
  tmp_path=${f%/*}
  tmp_file=$(basename $f)
  tmp_file_new=${tmp_file/WordPressBP/$namespace}
  mv ${tmp_path}/${tmp_file} ${tmp_path}/${tmp_file_new}
done

# Create a README.md
echo "# ${namespace}
" > ${project_path}/README.md

# Copy .env.example to .env. Will be configured later
cp ${project_path}/.env.example ${project_path}/.env

# Add git export ignore rules for files that shouldn't be in build
echo "*.example export-ignore
etc/ export-ignore
web/app/uploads/ export-ignore
web/app/themes/**/css/ export-ignore
web/app/themes/**/js/ export-ignore
" >> ${project_path}/.gitattributes

# Replace WordPressBP in file contents with $namespace
echo "==> Namespacing file contents…"
find ${project_path}/ -type f -print0 | xargs -0 sed -i "s/WordPressBP/${namespace}/g"

# Move into $project_path
cd $project_path

# Install Composer dependencies
echo "==> Installing composer dependencies…"
composer require \
  composer/installers \
  vlucas/phpdotenv \
  johnpbloch/wordpress \
  timber/timber

# Install NPM dependencies
echo "==> Installing NPM dependencies…"
npm install --save-dev \
  @babel/core \
  @babel/preset-env \
  @babel/plugin-proposal-object-rest-spread \
  autoprefixer \
  node-sass \
  node-ssh \
  npm-run-all \
  postcss \
  postcss-csso \
  rollup \
  rollup-plugin-babel \
  rollup-plugin-babel-minify \
  rollup-plugin-commonjs \
  rollup-plugin-node-resolve \
  shelljs \
  shx \
  standard \
  watch

# Build front end assets
echo "==> Building front-end assets…"
npm run build

echo "==> Done."

# Set up the database and install WordPress
echo "==> The following steps require a MySQL user with CREATE DATABASE privileges OR a user with basic use privileges for an existing database."
read -e -p "Do you wish to continue setting up WordPress? (y/n): " -i "y" cont
if [ "$cont" != "y" ]; then
  echo "- Edit $project_path/.env with your database settings and install WordPress using WP-CLI or your browser.
- Set up the web server to serve $namespace.dev from $project_path/web.
- Map the server IP to $namespace.dev in your local hosts file.
- Log in at http://$namespace.dev/wp/wp-login.php"
  exit
fi

# Prompt for DB details
read -e -p "Database name: " dbname
sed -i "s/db_name/${dbname}/g" .env

read -e -p "Database user: " dbuser
sed -i "s/db_user/${dbuser}/g" .env

read -e -p "Database password: " dbpass
sed -i "s/db_pass/${dbpass}/g" .env

read -e -p "Database host: " -i "localhost" dbhost
sed -i "s/localhost/${dbhost}/g" .env

read -e -p "Database table prefix: " -i "wpdb_" dbprefix
sed -i "s/wpdb_/${dbprefix}/g" .env
sed -i "s/wpdb_/${dbprefix}/g" sync.sh.example

# Create the DB or prompt user to create it
read -e -p "Does user $dbuser have CREATE DATABASE privileges? Create database now? (y/n): " -i "y" dbperms
if [ "$dbperms" == "y" ]; then
  wp db create
else
  read -e -p "Please create $dbname database manually and grant $dbuser all basic use privileges. Press [Enter] when done…"
fi

# Ensure an empty DB
wp db reset --yes

# Prompt user for site details
read -e -p "Site title: " wp_title
read -e -p "Admin username: " -i "${namespace}admin" wp_user
read -e -p "Admin password: " wp_pass
read -e -p "Admin e-mail: " wp_email

# Install WordPress
echo "==> Installing WordPress…"
wp core install --url=${namespace}.dev --title="${wp_title}" --admin_user=${wp_user} --admin_password=${wp_pass} --admin_email=${wp_email} --skip-email

# Remove demo content
echo "==> Removing demo content…"
wp site empty --yes
wp widget delete search-2 recent-posts-2 recent-comments-2 archives-2 categories-2 meta-2

# Activate addons plugin
echo "==> Activating plugins…"
wp plugin activate ${namespace}-addons

# Activate included barebones theme
echo "==> Activating $namespace theme…"
wp theme activate ${namespace}

# Create a dev admin account
echo "==> Creating developer admin account (login: dev / dev)…"
wp user create dev dev@dev.dev --user_pass=dev --role=administrator

# Finish
echo "==> All done.
- Set up the web server to serve $namespace.dev from $project_path/web.
- Map the server IP to $namespace.dev in your local hosts file.
- Log in at http://$namespace.dev/wp/wp-login.php (login: dev / dev).
"
