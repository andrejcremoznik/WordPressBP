<?php

define('WP_DEBUG', false);
define('WP_DEBUG_DISPLAY', false);
define('SCRIPT_DEBUG', false);

/**
 * Disable fake WP cron and set up a real crontjob on server using WP-CLI:
 * -- wp cron event run --due-now --path=/srv/http/mywebsite.tld/current/web/wp > /dev/null 2>&1
 * -- Instructions: https://gist.github.com/andrejcremoznik/7e78bd412678c08970d436cbd3fdd315
 */
define('DISABLE_WP_CRON', true);

/**
 * Enable caching
 * - Requires:
 * -- object cache plugin
 * - To enable Timber cache set "Timber::$cache = WP_CACHE;" in functions.php
 * -- CACHE_DIR (see below) writeable for SSH user and PHP
 * -- Deploy needs to run `wp timber clear_cache` and `wp cache flush`
 */
//
define('WP_CACHE', false);

// Cache directory
define('CACHE_DIR', $root_dir . '/cache');
