#!/bin/bash

if [ $# -lt 2 ]; then
  echo -e "\nUsage:"
  echo -e "  $0 <namespace> <project_path> [<branch>]"
  echo -e "\nParams:"
  echo -e "  <namespace>:    Lowercase alphanumeric name for your project. Must not start with a number. Must be directory / file system / URL friendly."
  echo -e "  <project_path>: Path to directory where the project structure will be set up."
  echo -e "  <branch>:       Branch from which to create the project structure. Defaults to 'master'."
  echo -e "\nExample:"
  echo -e "  $0 mything /srv/http/mything.dev\n"
  exit
fi

namespace="$1"
project_path=${2%/}
project_repo=${2%/}/repo

# Make sure $project_path exists, is writeable and clean
if [ ! -d $project_path ]; then
  echo "==> The directory $project_path does not exist. Creating…"
  mkdir ${project_path}
  if [ $? -ne 0 ] ; then
    echo "==> Cannot create $project_path. Check write permissions. Aborting…"
  fi
else
  echo "==> The directory $project_path exist."
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

echo "==> Checking for required software…"
echo -e "For instructions on how to set these up, please read https://gist.github.com/andrejcremoznik/07429341fff4f318c5dd\n"

command -v composer >/dev/null 2>&1 || { echo >&2 "Composer not installed. Aborting…"; exit 1; }
command -v npm >/dev/null 2>&1 || { echo >&2 "NPM not installed. Aborting…"; exit 1; }
command -v wp >/dev/null 2>&1 || { echo >&2 "WP-CLI not installed. Aborting…"; exit 1; }
command -v msgfmt >/dev/null 2>&1 || { echo >&2 "msgfmt not found. Please install gettext. Aborting…"; exit 1; }

echo "==> All there."

# Create project structure
mkdir ${project_path}/{repo,log,etc}

# Export files to project
echo "==> Creating a working copy of WordPressBP in $project_repo"

git archive --format=tar ${3:-master} | tar -x -C $project_repo

# Replace WordPressBP in folder and file names with $namespace
echo "==> Renaming folders and files…"

for f in `find $project_repo -depth -name '*WordPressBP*'`; do
  # path before directory/file name
  tmp_path=${f%/*}
  # directory/file name
  tmp_file=$(basename $f)
  # renamed directory/file
  tmp_file_new=${tmp_file/WordPressBP/$namespace}
  # do the move
  mv ${tmp_path}/${tmp_file} ${tmp_path}/${tmp_file_new}
done

echo -e "# ${namespace}\n" > ${project_repo}/README.md
cp ${project_repo}/.env.example ${project_repo}/.env

echo -e "\nsync.sh export-ignore\nconfig/scripts/ export-ignore\nweb/app/uploads/ export-ignore\nweb/app/themes/**/css/ export-ignore\nweb/app/themes/**/js/ export-ignore\n" >> ${project_repo}/.gitattributes

# Replace WordPressBP in file contents with $namespace
echo "==> Namespacing file contents…"

find ${project_repo}/ -type f -print0 | xargs -0 sed -i "s/WordPressBP/${namespace}/g"

# Set up Nginx vhost
echo -e "==> Setting up Nginx configuration in $project_path/etc\n"

sed -i "s|{project_path}|${project_path}|g" ${project_repo}/config/nginx/nginx.conf
mv ${project_repo}/config/nginx/nginx.conf.dist ${project_path}/etc/nginx.conf

cd $project_repo

echo -e "==> Installing composer dependencies…\n"
composer require composer/installers vlucas/phpdotenv johnpbloch/wordpress timber/timber wpackagist-plugin/disable-emojis

echo -e "==> Installing NPM dependencies…\n"
npm install --save normalize.css
npm install --save-dev node-sass postcss postcss-csso autoprefixer node-ssh npm-run-all shelljs shx watch babel-preset-env babel-plugin-external-helpers rollup rollup-plugin-babel rollup-plugin-babel-minify

echo -e "==> Done.\n"
echo "==> The following steps require a MySQL user with CREATE DATABASE privileges OR a user with basic use privileges for an existing database"

read -e -p "Do you wish to continue setting up WordPress? (y/n): " cont
if [ "$cont" != "y" ]; then
  echo "Edit $project_repo/.env with your database settings and install WordPress using WP-CLI or your browser."
  exit
fi

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
sed -i "s/wpdb_/${dbprefix}/g" sync.sh

read -e -p "Does user $dbuser have CREATE DATABASE privileges? Create database now? (y/n): " dbperms
if [ "$dbperms" == "y" ]; then
  wp db create
else
  read -p "Please create $dbname database manually and grant $dbuser all basic use privileges. Press [Enter] when done…"
fi

wp db reset --yes

read -e -p "Site title: " wp_title
read -e -p "Admin username: " -i "${namespace}admin" wp_user
read -e -p "Admin password: " wp_pass
read -e -p "Admin e-mail: " wp_email

echo "==> Installing WordPress…"
wp core install --url=http://${namespace}.dev --title="${wp_title}" --admin_user=${wp_user} --admin_password=${wp_pass} --admin_email=${wp_email}

echo "==> Removing demo content…"
wp site empty --yes
wp widget delete search-2 recent-posts-2 recent-comments-2 archives-2 categories-2 meta-2

echo "==> Activating plugins…"
wp plugin activate disable-emojis

echo "==> Activating $namespace theme…"
wp theme activate ${namespace}

echo "==> Creating developer admin account (login: dev / dev)"
wp user create dev dev@dev.dev --user_pass=dev --role=administrator

echo "==> Building front-end assets…"
npm run build

echo -e "==> All done.\n"
echo "Check $project_path/etc/nginx.conf, make sure the file is included in /etc/nginx/nginx.conf and reload the server."
echo "Map the correct IP to $namespace.dev in your hosts file."
echo -e "Login at http://$namespace.dev/wp/wp-login.php (login: dev / dev)\n"
echo "Happy hacking!"
