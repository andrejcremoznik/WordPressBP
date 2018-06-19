<?php

/*
// NOTE: If you need to rely on a plugin (like ACF) uncomment this snippet
if (!function_exists('get_field') && !is_admin()) {
  wp_die(sprintf(
    '<b>WordPressBP</b> template requires <a href="https://www.advancedcustomfields.com/">ACF PRO</a> plugin. After installing the plugin enable it in the <a href="%s">Dashboard</a>.',
    admin_url('plugins.php')
  ));
}
*/

new Timber\Timber();
Timber::$dirname = ['views'];
Timber::$cache = WP_CACHE;

class WordPressBP extends Timber\Site {

  private $asset_version = 'vDEV'; // String replaced with a timestamp during deploy

  public $cache_itr; // Cache iteration

  public function __construct() {
    // Get cache iteration
    $this->cache_itr = $this->get_cache_itr();

    // Run action hooks
    add_action('after_setup_theme',     [$this, 'setup']);
    // add_action('widgets_init',          [$this, 'widgets_init']);
    add_action('wp_enqueue_scripts',    [$this, 'scripts_styles']);
    add_action('save_post',             [$this, 'flush_theme_cache']);
    add_action('deleted_post',          [$this, 'flush_theme_cache']);

    // Run filters
    add_filter('body_class',            [$this, 'body_class']);
    add_filter('timber/context',        [$this, 'timber_context']);
    add_filter('timber/twig',           [$this, 'timber_twig']);
    add_filter('timber/cache/location', [$this, 'timber_cache']);

    // NOTE: Hide ACF admin on production
    // if (WP_ENV == 'production') {
    //   add_filter('acf/settings/show_admin', '__return_false');
    // }

    /**
     * Clean up wp_head()
     * http://codex.wordpress.org/Plugin_API/Action_Reference/wp_head
     */
    remove_action('wp_head', 'rsd_link');
    remove_action('wp_head', 'wp_generator');
    // remove_action('wp_head', 'feed_links', 2);
    remove_action('wp_head', 'feed_links_extra', 3);
    remove_action('wp_head', 'wlwmanifest_link');
    remove_action('wp_head', 'wp_shortlink_wp_head', 10, 0);
    remove_action('wp_head', 'adjacent_posts_rel_link_wp_head', 10, 0);
    remove_action('wp_head', 'rest_output_link_wp_head', 10);
    remove_action('wp_head', 'wp_oembed_add_discovery_links', 10);
    remove_action('template_redirect', 'rest_output_link_header', 11, 0);

    parent::__construct();
  }

  private function get_cache_itr() {
    $cache_itr = wp_cache_get('theme_cache_itr');
    if ($cache_itr === false) {
      $cache_itr = 1;
      wp_cache_set('theme_cache_itr', $cache_itr);
    }
    return $cache_itr;
  }

  /**
   * Add custom values global Timber context
   */
  public function timber_context($context) {
    $context['site'] = [
      'name' => $this->name,
      'charset' => $this->charset,
      'language' => $this->language,
      'theme_uri' => $this->theme->uri,
      'env' => WP_ENV
    ];

    // Menus
    $context['menus'] = [
      'primary' => new Timber\Menu('primary', ['depth' => 2])
    ];

    return $context;
  }

  /**
   * Add custom functions to Twig
   */
  public function timber_twig($twig) {
    $twig->enableStrictVariables();
    return $twig;
  }

  /**
   * Timber cache directory
   */
  public function timber_cache() {
    return CACHE_DIR . '/timber/';
  }

  /**
   * Set up theme's defaults, register various features
   */
  public function setup() {

    /**
     * Load theme text domain
     * https://developer.wordpress.org/themes/functionality/internationalization/
     */
    load_theme_textdomain('WordPressBP', get_template_directory() . '/languages');

    /**
     * Custom editor style
     *
     * To enable custom styles for the visual editor add editor_theme_default.css
     * to the template assets subdirectory and uncomment the line below
     */
    //add_editor_style('assets/editor-default.css');

    /**
     * Register navigation menus
     */
    register_nav_menus([
      'primary' => __('Primary Navigation', 'WordPressBP')
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
     * 'image_sizes' function defined below
     */
    //add_image_size('size_name', 300, 200, true);
    //add_filter('image_size_names_choose', [$this, 'image_sizes']);

  }
  /*
  function image_sizes($sizes) {
    $sizes['size_name'] = __('New size label', 'WordPressBP');
    return $sizes;
  }
  */

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
   * Set up theme's sidebars
   */
  public function widgets_init() {
    register_sidebar([
      'name'          => __('Sidebar', 'WordPressBP'),
      'id'            => 'sidebar',
      'before_widget' => '<div id="%1$s" class="widget %2$s">',
      'after_widget'  => '</div>',
      'before_title'  => '<h3 class="widget__title">',
      'after_title'   => '</h3>'
    ]);
  }

  /**
   * Register styles and scripts for frontend
   *
   * Styles (wp_register_style, wp_enqueue_style)
   * Scripts (wp_register_script, wp_enqueue_script, wp_localize_script)
   */
  public function scripts_styles() {
    // Deregister scripts
    wp_deregister_script('wp-embed');

    // Register styles
    wp_register_style('default', get_template_directory_uri() . '/assets/default.css', [], $this->asset_version, 'all');

    // Register scripts
    wp_register_script('app', get_template_directory_uri() . '/assets/app.js', [], $this->asset_version, true);

    // Enqueue styles
    wp_enqueue_style('default');

    // Enqueue scripts
    wp_enqueue_script('app');
  }

  /**
   * Helper to invalidate theme's caches by
   * increasing the theme cache iterator
   *
   * - see below for an example function how to correctly use the cache
   */
  public function flush_theme_cache() {
    wp_cache_incr('theme_cache_itr');
  }


  /**
   * NOTE: Example how to use caching for expensive operations done by the theme.
   * - Outside of this class use $theme->cache_itr to get the current iterator.
   * - Iterator will automatically increase whenever a post is saved or deleted.
   */
  /*
  public function do_something_expensive() {
    // Create a unique cache key using the cache iterator
    $cache_key = 'expensive_operation_' . $this->cache_itr;
    // Get result from cache
    $expensive_operation = wp_cache_get($cache_key);
    // If there is no cache, recreate it
    if ($expensive_operation === false) {
      $expensive_operation = 'The result of something you do not want to run on every load.';
      wp_cache_set($cache_key, $expensive_operation);
    }
    // Return result
    return $expensive_operation;
  }
  */
}

$theme = new WordPressBP();
