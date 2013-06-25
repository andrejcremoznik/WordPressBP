<?php
/*
Plugin Name: WordPressBP Extensions
Description: Provides extensions for the WordPressBP
Author:
Author URI:
Version: 1.0
*/

// If this file is called directly, abort.
if(!defined('WPINC')) {
	die;
}

function wordpressbp_extensions_i18n() {
	load_plugin_textdomain('wordpressbp-extensions', false, dirname(plugin_basename(__FILE__)) . '/lang/');
}
add_action('plugins_loaded', 'wordpressbp_extensions_i18n');

/*
 ********* Post types (register_post_type) *********
 */
/*
function create_post_types() {
	register_post_type('slug', array(
		'labels'              => array(
			'name'              => __('Names', 'wordpressbp-extensions'),
			'singular_name'     => __('Name', 'wordpressbp-extensions')
		),
		'supports'            => array('title', 'editor', 'author', 'thumbnail', 'comments', 'revisions'),
		'taxonomies'          => array('category', 'post_tag'),
		'public'              => true,
		'exclude_from_search' => true,
		'has_archive'         => true,
		'rewrite'             => true
	));
}
add_action('init', 'create_post_types');
*/

/*
 ********* Taxonomies (register_taxonomy) *********
 */
/*
function create_taxonomies() {
	register_taxonomy('slug', array('post-type'), array(
		'labels'          => array(
			'name'          => __('Names', 'wordpressbp-extensions'),
			'singular_name' => __('Name', 'wordpressbp-extensions')
		),
		'hierarchical'    => true,
		'public'          => true,
		'rewrite'         => false
	));
}
add_action('init', 'create_taxonomies', 0);
*/
