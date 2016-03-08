<?php

if (!class_exists('Timber')) {
  echo 'Timber not activated. Make sure you activate the plugin.';
  return;
}

$post = new TimberPost();
$context = Timber::get_context();
$context['post'] = $post;
if (is_active_sidebar('primary_sidebar')) {
  $context['primary_sidebar'] = Timber::get_widgets('primary_sidebar');
}

Timber::render(['page-' . $post->post_name . '.twig', 'page.twig'], $context);
