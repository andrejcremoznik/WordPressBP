#!/bin/bash

ssh_connection="user@host"
remote_wordpress="/var/www/project/releases/current/web/wp"

command -v wp >/dev/null 2>&1 || { echo >&2 "WP-CLI needs to be available as 'wp' command in your PATH."; exit 1; }

echo "Dropping DB"

wp db reset --yes

echo "Importing DB from production"

ssh $ssh_connection "wp --path=$remote_wordpress db export - | gzip" | gunzip | wp db import -

echo "Cleaning up cache and stuff..."

wp db query "DELETE FROM wp_posts WHERE post_type = 'revision'"
wp cache flush
wp transient delete-all
wp rewrite flush
wp user update 1 --user_name=admin --user_pass=admin

echo "Done."
