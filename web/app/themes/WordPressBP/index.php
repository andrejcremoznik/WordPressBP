<?php

if (!class_exists('Timber')) {
  echo 'Timber not activated. Make sure you activate the plugin.';
  return;
}

$context = Timber::get_context();
$context['posts'] = Timber::get_posts();
$context['pagination'] = Timber::get_pagination();
if (is_active_sidebar('primary_sidebar')) {
  $context['primary_sidebar'] = Timber::get_widgets('primary_sidebar');
}

$views = ['index.twig'];

/*
if (is_home()) {
  array_unshift($views, 'home.twig');
}
*/

Timber::render($views, $context);
