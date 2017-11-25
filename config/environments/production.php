<?php

define('WP_DEBUG', false);
define('WP_DEBUG_DISPLAY', false);
define('SCRIPT_DEBUG', false);

// Run `wp cron event run --all > /dev/null 2>&1` in a real cronjob every few minutes
define('DISABLE_WP_CRON', true);

// Enable for use with a caching plugin
define('WP_CACHE', false);

// Disable WP file editor and update checking
define('DISALLOW_FILE_MODS', true);
