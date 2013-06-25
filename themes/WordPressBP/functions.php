<?php

/*
 ********* Load Text Domain http://codex.wordpress.org/I18n_for_WordPress_Developers *********
 */
function theme_textdomain() {
	load_theme_textdomain('WordPressBP', get_template_directory() . '/lang');
}
add_action('after_setup_theme', 'theme_textdomain');


/*
 ********* Menus (register_nav_menus) *********
 */
function create_menus() {
	register_nav_menus(array(
		'primary' => __('Main menu', 'WordPressBP')
	));
}
add_action('init', 'create_menus');


/*
 ********* Sidebars (register_sidebar) *********
 */
function create_sidebars() {
	register_sidebar(array(
		'name' => __('Sidebar 1', 'WordPressBP'),
		'id'   => 'sidebar1'
	));
}
add_action('init', 'create_sidebars');


/*
 ********* Styles (wp_register_style, wp_enqueue_style) *********
 */
function theme_styles() {
	// Register styles
	wp_register_style('default', get_template_directory_uri().'/style.css', false, null, 'all');

	// Enqueue styles
	wp_enqueue_style('default');
}
add_action('wp_enqueue_scripts', 'theme_styles');

// Custom editor style
//add_editor_style('editor_style.css');


/*
 ********* Scripts (wp_register_script, wp_enqueue_script) *********
 */
function theme_scripts() {
	// Register scripts
	wp_register_script('global', get_template_directory_uri().'/js/global.js', array('jquery'), '1.0', true);

	// Enqueue scripts
	wp_enqueue_script('jquery');
	wp_enqueue_script('global');
}
add_action('wp_enqueue_scripts', 'theme_scripts');


/*
 ********* Theme support (add_theme_support) *********
 */
add_theme_support('automatic-feed-links');
//add_theme_support('post-formats');
add_theme_support('post-thumbnails');
//add_theme_support('custom-background');
//add_theme_support('custom-header');

/*
 ********* Image sizes (add_image_size) *********
 */
//add_image_size('banner', 960, 250, true);


/*
 ********* Clean up wp_head(): http://codex.wordpress.org/Plugin_API/Action_Reference/wp_head *********
 */
remove_action('wp_head', 'rsd_link');
remove_action('wp_head', 'wp_generator');
//remove_action('wp_head', 'feed_links', 2);
remove_action('wp_head', 'index_rel_link');
remove_action('wp_head', 'wlwmanifest_link');
remove_action('wp_head', 'feed_links_extra', 3);
remove_action('wp_head', 'start_post_rel_link', 10, 0 );
remove_action('wp_head', 'parent_post_rel_link', 10, 0);
remove_action('wp_head', 'adjacent_posts_rel_link_wp_head', 10, 0);


/*
 ********* Modify main query*********
 */
/*
function theme_queries($query) {
	if(!is_admin() && $query->is_main_query()) {

		if(is_archive() || is_single() || is_home()) {
			// Include a custom post type in query
			$query->set('post_type', array('post', 'custom_post_type'));
		}

	}
}
add_action('pre_get_posts', 'theme_queries');
*/


/*
 ********* Filters *********
 */
/*
function modify_excerpt_more($more) {
	global $post;
	return ' &hellip;</p><p><a class="excerpt-more" href="' . get_permalink($post->ID) . '">' . __('Continue reading', 'WordPressBP') . '</a>';
}
add_filter('excerpt_more', 'modify_excerpt_more');

function modify_excerpt_length($length) {
	return 35; // # of words
}
add_filter('excerpt_length', 'modify_excerpt_length');

function next_posts_link_attr() {
	return 'class="nextLink"';
}
function prev_posts_link_attr() {
	return 'class="prevLink"';
}
add_filter('next_posts_link_attributes',     'next_posts_link_attr');
add_filter('previous_posts_link_attributes', 'prev_posts_link_attr');

function modify_body_classes($classes) {
	global $post;
	if(is_active_sidebar('sidebar1')) $classes[] = 'has-sidebar';
	return $classes;
}
add_filter('body_class', 'modify_body_classes');
*/
