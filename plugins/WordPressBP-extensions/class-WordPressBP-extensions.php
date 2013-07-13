<?php

class WordPressBP_extensions {

	protected static $instance = null;

	private function __construct() {

		add_action('plugins_loaded', array($this, 'onPluginsLoaded'));

		/**
		 * Init functions for custom post types and taxonomies
		 */
		//add_action('init', array($this, 'createTaxonomies'), 0);
		//add_action('init', array($this, 'createPostTypes'));

		/**
		 * Init main query modification
		 */
		//add_action('pre_get_posts', 'modifyQuery');
	}

	public static function get_instance() {

		if(self::$instance == null) {
			self::$instance = new self;
		}

		return self::$instance;

	}

	/**
	 * Activation hook
	 */
	public static function activate($network_wide) {

		/**
		 * Flush rewrite rules for custom post types / taxonomies
		 */
		//$this->createPostTypes();
		//$this->createTaxonomies();
		//flush_rewrite_rules();

	}

	/**
	 * Deactivation hook
	 */
	public static function deactivate($network_wide) {
		// TODO
	}

	/**
	 * On plugins loaded hook
	 */
	public function onPluginsLoaded() {

		load_plugin_textdomain('WordPressBP-extensions', false, dirname(plugin_basename(__FILE__)) . '/lang/');

	}

	/**
	 * Custom methods
	 */
	// Create custom post types
	/*
	public function createPostTypes() {
		register_post_type('slug', array(
			'labels'              => array(
				'name'              => __('Names', 'WordPressBP-extensions'),
				'singular_name'     => __('Name', 'WordPressBP-extensions')
			),
			'supports'            => array('title', 'editor', 'author', 'thumbnail', 'comments', 'revisions'),
			'taxonomies'          => array('category', 'post_tag'),
			'public'              => true,
			'exclude_from_search' => true,
			'has_archive'         => true,
			'rewrite'             => true
		));
	}
	*/

	// Create custom taxonomies
	/*
	public function createTaxonomies() {
		register_taxonomy('slug', array('post-type'), array(
			'labels'          => array(
				'name'          => __('Names', 'WordPressBP-extensions'),
				'singular_name' => __('Name', 'WordPressBP-extensions')
			),
			'hierarchical'    => true,
			//'update_count_callback' => '_update_post_term_count', // uncomment if hierarchical == false
			'public'          => true,
			'rewrite'         => false
		));
	}
	*/

	// Modify main query
	/*
	public function modifyQuery() {
		if(!is_admin() && $query->is_main_query()) {

			if(is_archive() || is_single() || is_home()) {
				// Example: Include a custom post type in query
				$query->set('post_type', array('post', 'custom_post_type'));
			}

		}
	}
	*/

}
