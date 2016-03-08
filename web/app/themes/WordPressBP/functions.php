<?php

if (!class_exists('Timber')) {
  add_action('admin_notices', function() {
    printf(
      '<div class="error"><p>Timber not activated. Make sure you activate the plugin: <a href="%1$s#timber">%1$s</a></p></div>',
      esc_url(admin_url('plugins.php'))
    );
  });
  return;
}

Timber::$dirname = ['views'];

/**
 * Global variables
 */
define('ASSET_VERSION', 'vDEV'); // Change string during deploy

class WordPressBP extends TimberSite {

  function __construct() {

    add_action('after_setup_theme',           [$this, 'setup']);
    add_action('widgets_init',                [$this, 'widgets_init']);
    add_action('wp_enqueue_scripts',          [$this, 'scripts_styles']);

    add_filter('comment_form_default_fields', [$this, 'modify_comment_form_fields']);
    add_filter('timber_context',              [$this, 'timber_context']);
    //add_filter('get_twig',                  [$this, 'timber_twig']);

    /**
     * Clean up wp_head()
     *
     * http://codex.wordpress.org/Plugin_API/Action_Reference/wp_head
     */
    remove_action('wp_head', 'rsd_link');
    remove_action('wp_head', 'wp_generator');
    //remove_action('wp_head', 'feed_links', 2);
    remove_action('wp_head', 'feed_links_extra', 3);
    remove_action('wp_head', 'wlwmanifest_link');
    remove_action('wp_head', 'wp_shortlink_wp_head', 10, 0);
    remove_action('wp_head', 'adjacent_posts_rel_link_wp_head', 10, 0);
    remove_action('wp_head', 'rest_output_link_wp_head', 10);
    remove_action('wp_head', 'wp_oembed_add_discovery_links', 10);
    remove_action('template_redirect', 'rest_output_link_header', 11, 0);

    parent::__construct();
  }

  /**
   * Add custom values global context
   */
  function timber_context($context) {
    $context['primary_navigation'] = new TimberMenu('primary_navigation');
    $context['env'] = WP_ENV;
    $context['site'] = $this;
    $context['wp_url'] = WP_SITEURL;
    $context['i18n'] = [
      'no_content'          => __('Sorry, no content.', 'WordPressBP'),
      'missing_title'       => __('Missing page!', 'WordPressBP'),
      'missing_description' => __('We couldn’t find any content at this address.', 'WordPressBP'),
      'author'              => __('Author', 'WordPressBP'),
      'password'            => __('Password', 'WordPressBP'),
      'submit'              => __('Submit', 'WordPressBP')
    ];
    return $context;
  }

  /**
   * Add custom functions to Twig
   */
  /*
  function timber_twig($twig) {
    $twig->addExtension(new Twig_Extension_StringLoader());
    $twig->addFilter('myfoo', new Twig_Filter_Function('myfoo'));
    return $twig;
  }
  */

  /**
   * Set up theme's defaults, register various features
   */
  function setup() {

    /**
     * Load theme text domain
     *
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
     * 'image_sizes' function defined below
     */
    //add_image_size('size_name', 300, 200, true);
    //add_filter('image_size_names_choose', [$this, 'image_sizes']);

  }

  function image_sizes($sizes) {
    $sizes['size_name'] = __('New size label', 'WordPressBP');
    return $sizes;
  }

  /**
   * Set up theme's sidebars
   */
  function widgets_init() {
    register_sidebar([
      'name'          => __('Primary Sidebar', 'WordPressBP'),
      'id'            => 'primary_sidebar',
      'before_widget' => '<div id="%1$s" class="widget %2$s">',
      'after_widget'  => '</div>',
      'before_title'  => '<h3 class="widget-title">',
      'after_title'   => '</h3>'
    ]);
  }

  /**
   * Register styles and scripts for frontend
   *
   * Styles (wp_register_style, wp_enqueue_style)
   * Scripts (wp_register_script, wp_enqueue_script)
   */
  function scripts_styles() {
    // Deregister scripts
    wp_deregister_script('wp-embed');

    // Register styles
    wp_register_style('default', get_template_directory_uri() . '/assets/theme_default.css', [], ASSET_VERSION, 'all');

    // Register scripts
    wp_register_script('app', get_template_directory_uri() . '/assets/app.js', ['jquery-core'], ASSET_VERSION, true);

    // Enqueue styles
    wp_enqueue_style('default');

    // Enqueue scripts
    wp_enqueue_script('app');
  }

  /**
   * Remove URL field from comment form
   */
  function modify_comment_form_fields($fields) {
    if (isset($fields['url'])) {
      unset($fields['url']);
    }
    return $fields;
  }
}

new WordPressBP();


/**
 * Custom Twig functions
 */
/*
function myfoo($text) {
  $text .= ' bar!';
  return $text;
}
*/
