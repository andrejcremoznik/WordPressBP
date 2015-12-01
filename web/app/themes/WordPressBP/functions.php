<?php

/**
 * Global variables
 */
define('ASSET_VERSION', 'vDEV'); // Change during deploy with Grunt

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
   * To enable custom styles for the visual editor add editor_theme_default.css
   * to the template assets subdirectory and uncomment the line below
   */
  //add_editor_style('assets/editor_theme_default.css');

  /**
   * Register navigation menus
   */
  register_nav_menus([
    'primary_navigation' => __('Primary Navigation', 'WordPressBP')
  ]);

  /**
   * Enable support for certain theme features
   */
  add_theme_support('title-tag');
  add_theme_support('automatic-feed-links');
  add_theme_support('html5', ['search-form', 'comment-form', 'comment-list', 'gallery', 'caption']);
  add_theme_support('post-thumbnails');
  //add_theme_support('post-formats', ['aside', 'gallery', 'link', 'image', 'quote', 'video', 'audio']);
  //add_theme_support('custom-header');
  //add_theme_support('custom-background');

  /**
   * Custom thumbnail sizes
   *
   * Define custom image sizes with 'add_image_size'.
   *
   * To list any of the defined sizes in WP media manager dropdown
   * uncomment the 'image_size_names_choose' filter and add them to the
   * 'WordPressBP_image_sizes' function defined below
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
  register_sidebar([
    'name' => __('Primary Sidebar', 'WordPressBP'),
    'id'   => 'primary_sidebar'
  ]);
}
add_action('widgets_init', 'WordPressBP_widgets_init');



/**
 * Register styles and scripts for frontend
 *
 * Styles (wp_register_style, wp_enqueue_style)
 * Scripts (wp_register_script, wp_enqueue_script)
 */
function WordPressBP_scripts_styles() {
  // Register styles
  wp_register_style('default', get_template_directory_uri() . '/assets/theme_default.css', [], ASSET_VERSION, 'all');

  // Register scripts
  wp_register_script('top',    get_template_directory_uri() . '/assets/top.js',    [], ASSET_VERSION, false);
  wp_register_script('bottom', get_template_directory_uri() . '/assets/bottom.js', ['jquery'], ASSET_VERSION, true);

  // Enqueue styles
  wp_enqueue_style('default');

  // Enqueue scripts
  wp_enqueue_script('top');
  wp_enqueue_script('bottom');
}
add_action('wp_enqueue_scripts', 'WordPressBP_scripts_styles');



/**
 * Clean up wp_head()
 *
 * http://codex.wordpress.org/Plugin_API/Action_Reference/wp_head
 */
remove_action('wp_head', 'rsd_link');
remove_action('wp_head', 'wp_generator');
//remove_action('wp_head', 'feed_links', 2);
remove_action('wp_head', 'feed_links_extra', 3);
remove_action('wp_head', 'index_rel_link');
remove_action('wp_head', 'wlwmanifest_link');
remove_action('wp_head', 'start_post_rel_link', 10, 0);
remove_action('wp_head', 'parent_post_rel_link', 10, 0);
remove_action('wp_head', 'wp_shortlink_wp_head', 10, 0);
remove_action('wp_head', 'adjacent_posts_rel_link_wp_head', 10, 0);



/**
 * Extra
 */
/*
function modify_excerpt_more($more) {
  global $post;
  return ' &hellip;</p><p><a class="excerpt-more" href="' . get_permalink($post->ID) . '">' . __('Continue reading', 'WordPressBP') . '</a>';
}
add_filter('excerpt_more', 'modify_excerpt_more');

function modify_excerpt_length($length) {
  return 35; // number of words
}
add_filter('excerpt_length', 'modify_excerpt_length');
*/

function nav_next_link_attr() {
  return 'class="nav-prev"';
}
function nav_prev_link_attr() {
  return 'class="nav-next"';
}
add_filter('next_posts_link_attributes',        'nav_next_link_attr');
add_filter('previous_posts_link_attributes',    'nav_prev_link_attr');
add_filter('next_comments_link_attributes',     'nav_next_link_attr');
add_filter('previous_comments_link_attributes', 'nav_prev_link_attr');

/*
function modify_body_classes($classes) {
  global $post;
  if (is_active_sidebar('primary_sidebar')) $classes[] = 'has-sidebar';
  return $classes;
}
add_filter('body_class', 'modify_body_classes');

function modify_post_classes($classes) {
  if (!post_password_required() && has_post_thumbnail())
    $classes[] = 'has-post-thumbnail';

  return $classes;
}
add_filter('post_class', 'modify_post_classes');
*/

function modify_comment_form_fields($fields) {
  if (isset($fields['url']))
    unset($fields['url']);

  return $fields;
}
add_filter('comment_form_default_fields', 'modify_comment_form_fields');


/**
 * Dev helpers
 */
function dd($data) {
  die(var_dump($data));
}
