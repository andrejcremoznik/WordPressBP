<?php

/**
 * Set up theme's defaults, register various features...
 *
 * - executed in after_setup_theme hook
 */
function WordPressBP_setup() {

	/**
	 * Load theme text domain
	 *
	 * If you're not familiar with WP localization, read this first:
	 * http://codex.wordpress.org/I18n_for_WordPress_Developers
	 */
	load_theme_textdomain('WordPressBP', get_template_directory() . '/lang');

	/**
	 * Custom editor style
	 *
	 * To enable custom styles for the visual editor add editor-style.css
	 * to the template directory and uncomment the line below
	 */
	//add_editor_style();

	// Register navigation menus
	register_nav_menus(array(
		'primary' => __('Main menu', 'WordPressBP')
	));

	// Enable support for certain features
	add_theme_support('post-thumbnails');
	//add_theme_support('post-formats');
	//add_theme_support('custom-background');
	//add_theme_support('custom-header');
	add_theme_support('automatic-feed-links');

	/**
	 * Custom thumbnail sizes
	 *
	 * To list any of the defined sizes in WP media manager dropdown
	 * uncomment the 'image_size_names_choose' filter and add them to the
	 * 'theme_image_sizes' function defined below
	 */
	//add_image_size('size_name', 300, 200, true);
	//add_filter('image_size_names_choose', 'WordPressBP_image_sizes' );

}

function WordPressBP_image_sizes($sizes) {
	$sizes['size_name'] = __('New size label', 'WordPressBP');
	return $sizes;
}

add_action('after_setup_theme', 'WordPressBP_setup');



/**
 * Set up theme's sidebars
 */
function WordPressBP_widgets_init() {
	register_sidebar(array(
		'name' => __('Sidebar 1', 'WordPressBP'),
		'id'   => 'sidebar1'
	));
}
add_action('widgets_init', 'WordPressBP_widgets_init');



/**
 * Get file timestamp for automatic cache busting on update
 * - http://calendar.perfplanet.com/2012/using-nginx-php-fpmapc-and-varnish-to-make-wordpress-websites-fly/
 */
function autoVer($url, $echo = false) {
	$name = explode('.', $url);
	$lastext = array_pop($name);
	array_push(
		$name,
		filemtime($_SERVER['DOCUMENT_ROOT'] . parse_url($url, PHP_URL_PATH)),
		$lastext);
	$out = implode('.', $name);
	if($echo) echo $out; else return $out;
}

/**
 * Register styles and scripts for frontend
 *
 * - Styles (wp_register_style, wp_enqueue_style)
 * - Scripts (wp_register_script, wp_enqueue_script)
 *
 * WARNING: autoVer requires correct URL rewrites to function properly. Read the link above on
 * how to configure Nginx. If you don't want to use this way of cache busting, remove the function
 * from style and scripts registration calls below.
 */
function WordPressBP_scripts_styles() {
	// Register styles
	wp_register_style('default', autoVer(get_template_directory_uri() . '/style.css'), false, null, 'all');

	// Register scripts
	wp_register_script('global', autoVer(get_template_directory_uri() . '/js/global.js'), array('jquery'), null, true);

	// Enqueue styles
	wp_enqueue_style('default');

	// Enqueue scripts
	wp_enqueue_script('jquery');
	wp_enqueue_script('global');
}
add_action('wp_enqueue_scripts', 'WordPressBP_scripts_styles');



/**
 * Clean up wp_head()
 *
 * http://codex.wordpress.org/Plugin_API/Action_Reference/wp_head
 */
remove_action('wp_head', 'rsd_link');
remove_action('wp_head', 'wp_generator');
//remove_action('wp_head', 'feed_links',       2);
remove_action('wp_head', 'feed_links_extra', 3);
remove_action('wp_head', 'index_rel_link');
remove_action('wp_head', 'wlwmanifest_link');
remove_action('wp_head', 'start_post_rel_link',  10, 0);
remove_action('wp_head', 'parent_post_rel_link', 10, 0);
remove_action('wp_head', 'wp_shortlink_wp_head', 10, 0);
remove_action('wp_head', 'adjacent_posts_rel_link_wp_head', 10, 0);



/**
 * Various filters
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
