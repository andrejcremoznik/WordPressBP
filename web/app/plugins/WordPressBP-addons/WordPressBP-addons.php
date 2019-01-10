<?php
/**
 * Plugin Name: WordPressBP Addons
 * Description: Addons for the WordPressBP website
 * Version:     1.0.0
 * Author:      Andrej Cremoznik
 * Author URI:  https://keybase.io/andrejcremoznik
 * Text Domain: WordPressBP-addons
 * Domain Path: /languages
 */

if (!defined('WPINC')) die();

class WordPressBP_Addons {

  public function run() {
    // Actions
    add_action('init', [$this, 'plugin_textdomain'], 0);
    // add_action('init', [$this, 'taxonomies'], 0);
    // add_action('init', [$this, 'post_types']);
    // add_action('pre_get_posts', [$this, 'pre_get_posts']);
    add_action('wp_default_scripts', [$this, 'remove_jquery_migrate']);

    // Filters
    add_filter('upload_mimes', [$this, 'upload_mimes']);
    add_filter('jpeg_quality', [$this, 'jpeg_quality'], 1, 0);
    add_filter('comment_form_default_fields', [$this, 'comment_form_default_fields']);

    // Disable update nagging because we're managing everything with composer
    add_action('admin_init', [$this, 'disable_update_nag']);
    add_action('schedule_event', [$this, 'filter_cron_events']);
    add_filter('pre_site_transient_update_themes', [$this, 'last_checked_atm']);
    add_filter('pre_site_transient_update_plugins', [$this, 'last_checked_atm']);
    add_filter('pre_site_transient_update_core', [$this, 'last_checked_atm']);
    add_action('pre_set_site_transient_update_themes', [$this, 'last_checked_atm'], 21, 1);
    add_action('pre_set_site_transient_update_plugins', [$this, 'last_checked_atm'], 21, 1);

    // Disable trash output by wp_head()
    // - https://core.trac.wordpress.org/browser/tags/5.0.1/src/wp-includes/default-filters.php
    remove_action('wp_head', 'rsd_link');
    remove_action('wp_head', 'wp_generator');
    // remove_action('wp_head', 'feed_links', 2); // Uncomment if no blog
    remove_action('wp_head', 'feed_links_extra', 3);
    remove_action('wp_head', 'wlwmanifest_link');
    remove_action('wp_head', 'wp_shortlink_wp_head', 10, 0);
    remove_action('wp_head', 'adjacent_posts_rel_link_wp_head', 10, 0);
    remove_action('wp_head', 'rest_output_link_wp_head', 10);
    remove_action('wp_head', 'wp_oembed_add_discovery_links', 10);
    remove_action('template_redirect', 'rest_output_link_header', 11, 0);
    // Disable emojis
    remove_action('wp_head', 'print_emoji_detection_script', 7);
    remove_action('admin_print_scripts', 'print_emoji_detection_script');
    remove_action('wp_print_styles', 'print_emoji_styles');
    remove_action('admin_print_styles', 'print_emoji_styles');
    remove_filter('the_content_feed', 'wp_staticize_emoji');
    remove_filter('comment_text_rss', 'wp_staticize_emoji');
    remove_filter('wp_mail', 'wp_staticize_emoji_for_email');
    add_filter('wp_resource_hints', [$this, 'disable_emoji_dns_prefetch'], 10, 2);
    add_filter('tiny_mce_plugins', function ($plugins) {
      return is_array($plugins) ? array_diff($plugins, ['wpemoji']) : [];
    });
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
   * Set default JPEG quality for generated images
   */
  public function jpeg_quality() {
    return 65;
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
    add_role('super_editor', __('Super Editor', 'WordPressBP-addons'), $super_editor);
  }
  private static function remove_role_super_editor() {
    remove_role('super_editor');
  }

  /**
   * Disable update checking and nagging.
   */
  public function disable_update_nag() {
    global $current_user;
    $current_user->allcaps['update_plugins'] = 0;
    remove_action('admin_notices', 'update_nag', 3);
    remove_action('network_admin_notices', 'update_nag', 3);
    remove_action('admin_notices', 'maintenance_nag');
    remove_action('network_admin_notices', 'maintenance_nag');
    remove_action('load-update-core.php', 'wp_update_themes');
    remove_action('load-update-core.php', 'wp_update_plugins');
    wp_clear_scheduled_hook('wp_update_themes');
    wp_clear_scheduled_hook('wp_update_plugins');
    wp_clear_scheduled_hook('wp_version_check');
  }

  public function filter_cron_events($event) {
    switch ($event->hook) {
      case 'wp_version_check':
      case 'wp_update_plugins':
      case 'wp_update_themes':
      case 'wp_maybe_auto_update':
        $event = false;
        break;
    }
    return $event;
  }

  public function last_checked_atm() {
    global $wp_version;
    $current = (object)[];
    $current->updates = [];
    $current->version_checked = $wp_version;
    $current->last_checked = time();
    return $current;
  }

  /**
   * Disable prefetching DNS location of emojis
   */
  public function disable_emoji_dns_prefetch($urls, $type) {
    if ($type === 'dns-prefetch') {
      foreach ($urls as $key => $url) {
        if (strpos($url, 'https://s.w.org/images/core/emoji/') !== false) {
          unset($urls[$key]);
        }
      }
    }
    return $urls;
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
