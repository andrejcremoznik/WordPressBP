<?php

define('WP_DEBUG', false);
define('WP_DEBUG_DISPLAY', false);
define('SCRIPT_DEBUG', false);

// Run `wp cron event run --all > /dev/null 2>&1` in a real cronjob every few minutes
define('DISABLE_WP_CRON', true);

/**
 * Enable caching
 * - Requires:
 * -- object cache plugin
 * -- CACHE_DIR (see below) writeable for SSH user and PHP
 * -- Deploy needs to run `wp timber clear_cache` and `wp cache flush`
 */
//
define('WP_CACHE', false);

// Cache directory
define('CACHE_DIR', $root_dir . '/cache');
