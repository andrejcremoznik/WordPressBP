#!/bin/bash

if [ $# -lt 2 ]; then
  echo -e "Usage:\n $0 <namespace> <project_path> [<branch>]\n"
  echo " <namespace>:    Alphanumeric name for your project. Used for namespacing functions, file names etc."
  echo " <project_path>: Path to directory where the project structure will be set up."
  echo " <branch>:       Branch from which to create the project structure. Defaults to 'master'"
  exit
fi

namespace="$1"
project_path=${2%/}
project_repo=${2%/}/repo

# Make sure $project_path exists, is writeable and clean
if [ ! -d $project_path ]; then
  echo "The directory $project_path does not exist. Creating…"
  mkdir ${project_path}
  if [ $? -ne 0 ] ; then
    echo "Cannot create $project_path. Check write permissions. Exiting…"
  fi
else
  echo "The directory $project_path exist. Emptying…"
  if [ -w $project_path ] ; then
    cd $project_path
    rm -f .[^.] .??*
    rm -fr *
    cd - 2>&1 >/dev/null
  else
    echo "Cannot empty $project_path. Check write permissions. Exiting…"
  fi
fi

# Create project structure
mkdir ${project_path}/{repo,log,etc}

# Export files to project
echo "Creating a working copy of WordPressBP in $project_repo"

git archive --format=tar ${3:-master} | tar -x -C $project_repo

# Replace WordPressBP in folder and file names with $namespace
echo "Renaming folders and files…"

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

echo "# ${namespace}" > ${project_repo}/README.md
cp ${project_repo}/.env.example ${project_repo}/.env

# Replace WordPressBP in file contents with $namespace
echo "Namespacing file contents…"

find ${project_repo}/ -type f -print0 | xargs -0 sed -i "s/WordPressBP/${namespace}/g"

# Set up Nginx vhost
echo -e "Setting up Nginx configuration in $project_path/etc\n"

sed -i "s|{project_path}|${project_path}|g" ${project_repo}/config/nginx/nginx.conf
mv ${project_repo}/config/nginx/nginx.conf ${project_path}/etc/

echo "Done. Next we will set up WordPress. To continue you will need:"
echo "1. MySQL user with CREATE DATABASE privileges OR a user with basic use privileges for an existing database"
echo "2. \"npm\", \"bower\", \"grunt\", \"composer\" and \"wp\" (WP-CLI) available in your PATH"
echo -e "If you are not sure about any of these, please read https://gist.github.com/andrejcremoznik/07429341fff4f318c5dd\n"

read -e -p "Do you wish to continue setting up WordPress? (y/n): " cont
if [ "$cont" != "y" ]; then exit; fi

echo "Checking for required software…"

command -v composer >/dev/null 2>&1 || { echo >&2 "Composer not installed. Aborting…"; exit 1; }
command -v npm >/dev/null 2>&1 || { echo >&2 "NPM not installed. Aborting…"; exit 1; }
command -v bower >/dev/null 2>&1 || { echo >&2 "Bower not installed. Aborting…"; exit 1; }
command -v grunt >/dev/null 2>&1 || { echo >&2 "Grunt not installed. Aborting…"; exit 1; }
command -v wp >/dev/null 2>&1 || { echo >&2 "WP-CLI not installed. Aborting…"; exit 1; }

echo "All there."

cd $project_repo

read -e -p "Database name: " dbname
sed -i "s/db_name/${dbname}/g" .env

read -e -p "Database user: " dbuser
sed -i "s/db_user/${dbuser}/g" .env

read -e -p "Database password: " dbpass
sed -i "s/db_pass/${dbpass}/g" .env

read -e -p "Database host: " -i "localhost" dbhost
sed -i "s/localhost/${dbhost}/g" .env

read -e -p "Database table prefix: " -i "wpdb_" dbprefix
sed -i "s/db_prefix/${dbprefix}/g" .env

echo -e "Running composer install…\n"
composer install

echo -e "Running NPM install…\n"
npm install

echo -e "Running Bower install…\n"
bower install

echo -e "Running Grunt…\n"
grunt

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

echo "Installing WordPress"
wp core install --url=http://namespace.dev --title="${wp_title}" --admin_user=${wp_user} --admin_password=${wp_pass} --admin_email=${wp_email}

echo "Removing demo content"
wp site empty --yes

echo "Activating $namespace theme"
wp theme activate ${namespace}

echo "Creating developer admin account (login: dev / dev)"

wp user create dev dev@dev.dev --user_pass=dev --role=administrator

cd - 2>&1 >/dev/null

echo -e "All done.\n"
echo "Check $project_path/etc/nginx.conf, make sure the file is included in /etc/nginx/nginx.conf and reload the server."
echo "Map the correct IP to $namespace.dev in your hosts file."
echo -e "Login at http://$namespace.dev/wp/wp-login.php\n"

echo "Happy hacking!"
