<?php

$root_dir = dirname(__DIR__);
$webroot_dir = $root_dir . '/web';

// Use Dotenv to set required environment variables and load .env file
if (!file_exists($root_dir . '/.env')) {
  die('<b>.env<b/> not found. Please configure your environment.');
}

$dotenv = new Dotenv\Dotenv($root_dir);
$dotenv->load();
$dotenv->required(['DB_NAME', 'DB_USER', 'DB_PASSWORD', 'DB_PREFIX', 'WP_HOME', 'WP_SITEURL']);

// Set up global environment constant and load its config first
define('WP_ENV', getenv('WP_ENV') ?: 'development');
$env_config  = $root_dir . '/config/environments/' . WP_ENV . '.php';
if (!file_exists($env_config)) {
  die('Environment configuration not found.');
}
require_once $env_config;

// URLs
define('WP_HOME',          getenv('WP_HOME'));
define('WP_SITEURL',       getenv('WP_SITEURL'));

// Custom Content Directory
define('CONTENT_DIR',      '/app');
define('WP_CONTENT_DIR',   $webroot_dir . CONTENT_DIR);
define('WP_CONTENT_URL',   WP_HOME . CONTENT_DIR);

// DB settings
define('DB_NAME',          getenv('DB_NAME'));
define('DB_USER',          getenv('DB_USER'));
define('DB_PASSWORD',      getenv('DB_PASSWORD'));
define('DB_HOST',          getenv('DB_HOST') ?: 'localhost');
define('DB_CHARSET',       'utf8');
define('DB_COLLATE',       '');
$table_prefix =            getenv('DB_PREFIX');

// Authentication Unique Keys and Salts
define('AUTH_KEY',         getenv('AUTH_KEY'));
define('SECURE_AUTH_KEY',  getenv('SECURE_AUTH_KEY'));
define('LOGGED_IN_KEY',    getenv('LOGGED_IN_KEY'));
define('NONCE_KEY',        getenv('NONCE_KEY'));
define('AUTH_SALT',        getenv('AUTH_SALT'));
define('SECURE_AUTH_SALT', getenv('SECURE_AUTH_SALT'));
define('LOGGED_IN_SALT',   getenv('LOGGED_IN_SALT'));
define('NONCE_SALT',       getenv('NONCE_SALT'));

// Custom settings
define('AUTOMATIC_UPDATER_DISABLED', true);
define('WP_MEMORY_LIMIT',            '96M');
define('AUTOSAVE_INTERVAL',          120);
define('WP_POST_REVISIONS',          2);
define('EMPTY_TRASH_DAYS',           3);
define('DISALLOW_FILE_EDIT',         true);

if (!defined('ABSPATH')) {
  define('ABSPATH', $webroot_dir . '/wp/');
}
