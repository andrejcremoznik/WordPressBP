<?php
/*
Plugin Name: WordPressBP Extensions
Description: Provides extensions for the WordPressBP website
Author:
Author URI:
Version: 1.0.0
*/

// If this file is called directly, abort.
if (!defined('WPINC'))
  die();

require_once(plugin_dir_path(__FILE__) . 'public/class-WordPressBP-extensions.php');

// Activate / deactivate actions
register_activation_hook(__FILE__, ['WordPressBP_extensions', 'activate']);
register_deactivation_hook(__FILE__, ['WordPressBP_extensions', 'deactivate']);

add_action('plugins_loaded', ['WordPressBP_extensions', 'get_instance']);
