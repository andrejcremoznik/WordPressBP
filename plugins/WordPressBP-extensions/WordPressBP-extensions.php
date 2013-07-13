<?php
/*
Plugin Name: WordPressBP Extensions
Description: Provides extensions for the WordPressBP theme
Author:
Author URI:
Version: 1.0
*/

// If this file is called directly, abort.
if(!defined('WPINC')) {
	die;
}

require_once(plugin_dir_path(__FILE__) . 'class-WordPressBP-extensions.php');

register_activation_hook(__FILE__, array('WordPressBP_extensions', 'activate'));
//register_deactivation_hook(__FILE__, array('WordPressBP_extensions', 'deactivate'));

WordPressBP_extensions::get_instance();
