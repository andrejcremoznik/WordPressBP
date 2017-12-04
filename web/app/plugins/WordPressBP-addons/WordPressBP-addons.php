<?php
/**
 * Plugin Name:       WordPressBP Addons
 * Description:       Addons for the WordPressBP website
 * Version:           1.0.0
 * Author:            Andrej Cremoznik
 * Author URI:        https://keybase.io/andrejcremoznik
 * Text Domain:       WordPressBP-addons
 * Domain Path:       /languages
 */

if (!defined('WPINC')) die();

class WordPressBP_Addons {

  public function run() {
    // Actions
    add_action('init',                        [$this, 'plugin_textdomain']);
    // add_action('init',                        [$this, 'taxonomies'], 0);
    // add_action('init',                        [$this, 'post_types']);
    // add_action('pre_get_posts',               [$this, 'pre_get_posts']);
    add_action('wp_default_scripts',          [$this, 'remove_jquery_migrate']);

    // Filters
    add_filter('upload_mimes',                [$this, 'upload_mimes']);
    add_filter('body_class',                  [$this, 'body_class']);
    add_filter('jpeg_quality',                [$this, 'jpeg_quality'], 1, 0);
    add_filter('comment_form_default_fields', [$this, 'comment_form_default_fields']);
  }

  /**
   * Set plugin textdomain
   */
  public function plugin_textdomain() {
    load_plugin_textdomain(
      'WordPressBP-addons',
      false,
      dirname(plugin_basename(__FILE__)) . '/languages'
    );
  }

  /**
   * Create custom taxonomies
   */
  /*
  public function taxonomies() {
    register_taxonomy('thing', ['post-type'], [
      'labels'          => [
        'name'          => __('Things', 'WordPressBP-addons'),
        'singular_name' => __('Thing', 'WordPressBP-addons')
      ],
      'hierarchical'    => true,
      'public'          => true,
      'rewrite'         => false
    ]);
  }
  */

  /**
   * Create custom post types
   */
  /*
  public function post_types() {
    register_post_type('thing', [
      'labels'              => [
        'name'              => __('Things', 'WordPressBP-addons'),
        'singular_name'     => __('Thing', 'WordPressBP-addons')
      ],
      'supports'            => ['title', 'editor', 'thumbnail', 'comments', 'revisions'],
      'taxonomies'          => ['category', 'post_tag'],
      'hierarchical'        => false,
      'public'              => true,
      'exclude_from_search' => false,
      'delete_with_user'    => false,
      'has_archive'         => true,
      'rewrite'             => ['slug' => __('thing', 'WordPressBP-addons')]
    ]);
  }
  */

  /**
   * Modify main query
   */
  /*
  public function pre_get_posts($query) {
    // Example: Include a custom post type in main query
    if (!is_admin() && $query->is_main_query()) {
      if (is_archive() || is_single() || is_home()) {
        $query->set('post_type', ['post', 'thing']);
      }
    }
  }
  */

  /**
   * Some plugins enqueue 'jquery' which wants 'migrate'.
   * Prevent migrate from loading.
   */
  public function remove_jquery_migrate(&$scripts) {
    if (!is_admin()) {
      $scripts->remove('jquery');
      $scripts->add('jquery', false, ['jquery-core']);
    }
	}

  /**
   * Allow upload of additional file types
   */
  public function upload_mimes($mimes) {
    $mimes['svg'] = 'image/xml+svg';
    return $mimes;
  }

  /**
   * Modify classes on <body>
   */
  public function body_class($classes) {
    $url_parts = explode('/', substr($_SERVER['REQUEST_URI'], 1));
    array_pop($url_parts);
    if (empty($url_parts)) $url_parts[] = 'frontpage';
    array_splice($url_parts, 0, 0, ['path']);
    $classes[] = implode('-', $url_parts);
    return $classes;
  }

  /**
   * Set default JPEG quality for generated images
   */
  public function jpeg_quality() {
    return 70;
  }

  /**
   * Remove URL field from comment form
   */
  public function comment_form_default_fields($fields) {
    if (isset($fields['url'])) {
      unset($fields['url']);
    }
    return $fields;
  }

  /**
   * Add a new role that has access to Dashboard > Appearance but isn't Admin
   */
  private static function add_role_super_editor() {
    $super_editor = get_role('editor')->capabilities;
    $super_editor['edit_theme_options'] = true;
    add_role('super_editor', __('Super Editor'), $super_editor);
  }
  private static function remove_role_super_editor() {
    remove_role('super_editor');
  }

  /**
   * Activation
   */
  public static function activate() {
    // Create "Super Editor" role
    self::add_role_super_editor();

    // Flush rewrite rules if using custom post types or taxonomies
    // flush_rewrite_rules();
  }

  /**
   * Deactivation
   */
  public static function deactivate() {
    // Remove "Super Editor" role
    self::remove_role_super_editor();

    // Flush rewrite rules if using custom post types or taxonomies
    // flush_rewrite_rules();
  }
}

// Activate / deactivate actions
register_activation_hook(__FILE__, ['WordPressBP_Addons', 'activate']);
register_deactivation_hook(__FILE__, ['WordPressBP_Addons', 'deactivate']);

// Run plugin
function run_WordPressBP_addons() {
	$plugin = new WordPressBP_Addons();
	$plugin->run();
}
run_WordPressBP_addons();
