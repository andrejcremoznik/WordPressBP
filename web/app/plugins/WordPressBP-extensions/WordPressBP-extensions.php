<?php
/*
Plugin Name: WordPressBP Extensions
Description: Provides extensions for the WordPressBP website
Author:
Author URI:
Version: 1.0.0
*/

// If this file is called directly, abort.
if (!defined('WPINC')) die();

class WordPressBP_extensions {

  protected $plugin_slug = 'WordPressBP-extensions';

  protected static $instance = null;

  private function __construct() {

    add_action('init',   [$this, 'plugin_textdomain']);

    //add_filter('locale', [$this, 'dashboard_lang']);

    //add_action('init',   [$this, 'taxonomies'], 0);
    //add_action('init',   [$this, 'post_types']);

    //add_action('pre_get_posts', [$this, 'main_query']);
  }

  public static function get_instance() {
    if (self::$instance == null) self::$instance = new self;
    return self::$instance;
  }

  public static function activate($network_wide) {
    if (function_exists('is_multisite') && is_multisite()) {
      if ($network_wide) {
        $blog_ids = self::get_blog_ids();
        foreach ($blog_ids as $blog_id) {
          switch_to_blog($blog_id);
          self::single_activate();
        }
        restore_current_blog();
      } else {
        self::single_activate();
      }
    } else {
      self::single_activate();
    }
  }

  public static function deactivate($network_wide) {
    if (function_exists('is_multisite') && is_multisite()) {
      if ($network_wide) {
        $blog_ids = self::get_blog_ids();
        foreach ($blog_ids as $blog_id) {
          switch_to_blog($blog_id);
          self::single_deactivate();
        }
        restore_current_blog();
      } else {
        self::single_deactivate();
      }
    } else {
      self::single_deactivate();
    }
  }

  private static function get_blog_ids() {
    global $wpdb;
    $sql = "SELECT blog_id FROM $wpdb->blogs WHERE archived = '0' AND spam = '0' AND deleted = '0'";
    return $wpdb->get_col($sql);
  }

  /**
   * Activation functionality
   */
  private static function single_activate() {
    // Flush rewrite rules if using custom post types or taxonomies
    // flush_rewrite_rules();
  }

  /**
   * Deactivation functionality
   */
  private static function single_deactivate() {
    // Flush rewrite rules if using custom post types or taxonomies
    // flush_rewrite_rules();
  }


  /**
   * Set plugin textdomain
   */
  public function plugin_textdomain() {
    load_plugin_textdomain(
      $this->plugin_slug,
      false,
      plugin_basename(dirname(__FILE__)) . '/lang'
    );
  }


  /**
   * Force en_US in WP Dashboard when a another locale is used
   */
  /*
  public function dashboard_lang($locale) {
    return (is_admin()) ? 'en_US' : $locale;
  }
  */


  /**
   * Create custom taxonomies
   */
  /*
  public function taxonomies() {
    $domain = $this->plugin_slug;

    register_taxonomy('slug', ['post-type'], [
      'labels'          => [
        'name'          => __('Names', $domain),
        'singular_name' => __('Name', $domain)
      ],
      'hierarchical'    => true,
      //'update_count_callback' => '_update_post_term_count', // uncomment if hierarchical == false
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
    $domain = $this->plugin_slug;

    register_post_type('slug', [
      'labels'              => [
        'name'              => __('Names', $domain),
        'singular_name'     => __('Name', $domain)
      ],
      'supports'            => ['title', 'editor', 'author', 'thumbnail', 'comments', 'revisions'],
      'taxonomies'          => ['category', 'post_tag']
      'public'              => true,
      'exclude_from_search' => true,
      'has_archive'         => true,
      'rewrite'             => ['slug' => __('slug', $domain)]
    ]);
  }
  */


  /*
   * Modify main query
   */
  /*
  public function main_query($query) {
    if (!is_admin() && $query->is_main_query()) {

      // Example: Include a custom post type in query
      if (is_archive() || is_single() || is_home())
        $query->set('post_type', ['post', 'my_post_type']);

    }
  }
  */

}


// Activate / deactivate actions
register_activation_hook(__FILE__, ['WordPressBP_extensions', 'activate']);
register_deactivation_hook(__FILE__, ['WordPressBP_extensions', 'deactivate']);

// Run plugin
add_action('plugins_loaded', ['WordPressBP_extensions', 'get_instance']);
