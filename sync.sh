#!/bin/bash

#
# This script will:
# 1. check if WP-CLI is available locally and on server
# 2. empty your local database (NO BACKUP! If you need a backup, extend this script.)
# 3. connect to server, using WP-CLI dump the database, pipe compressed data to local host, uncompress and import using WP-CLI
# 4. deactivate specified plugins
# 5. delete revisions, cache and transients
# 6. perform a search-replace for site URL and flush rewrite rules
# 7. create an admin user for development
#
# Review TODOs below to setup the script
#

# TODO: Set server SSH connection parameters
ssh_connection="user@host"

# TODO: Set path to the WordPress installation directory on the server
remote_wordpress="/srv/http/WordPressBP.dev/releases/current/web/wp"

function findWPCLI {
  command -v wp >/dev/null 2>&1 || { echo >&2 "WP-CLI needs to be available as 'wp' command in your PATH $1"; exit 1; }
}
findWPCLI locally
ssh $ssh_connection "$(typeset -f); findWPCLI 'on server'"

echo "Dropping local database"
wp db reset --yes

echo "Importing database from production"
ssh $ssh_connection "wp --path=$remote_wordpress db export - | gzip" | gunzip | wp db import -

# TODO: Disable plugins you don't need for development locally
#echo "Disabling production only plugins"
#wp plugin deactivate relevanssi wordpress-seo

echo "Cleaning up cache and stuff…"
wp db query "DELETE FROM wp_posts WHERE post_type = 'revision'"
wp cache flush
wp transient delete-all

# TODO: Do a search-replace on the entire database for site URL
#echo "Search/replace hostname"
#wp search-replace production.site WordPressBP.dev

echo "Flushing rewrite rules"
wp rewrite flush

echo "Creating admin account for development (login: dev / dev)"
wp user create dev dev@dev.dev --user_pass=dev --role=administrator

echo "Done."
