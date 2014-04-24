<?php
/*
Plugin Name: Enable Maintenance
Description: Display an “in maintenance” message to non-admins
Version: 1.0
*/

// If this file is called directly, abort.
if(!defined('WPINC')) die();

function enable_maintenance_i18n() {
	load_plugin_textdomain('enable-maintenance', false, basename(dirname(__FILE__)) . '/lang/');
}
add_action('plugins_loaded', 'enable_maintenance_i18n');

function enable_maintenance_mode() {
	if(!current_user_can('manage_options') || !is_user_logged_in()) {
		wp_die(__('Maintenance, please come back soon.', 'enable-maintenance'));
	}
}
add_action('get_header', 'enable_maintenance_mode');
