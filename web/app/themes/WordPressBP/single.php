<?php

$context = Timber::get_context();
$post = new Timber\Post();
$context['post'] = $post;

if (is_active_sidebar('sidebar')) {
  $context['sidebar'] = Timber::get_widgets('sidebar');
}

Timber::render(['single-' . $post->post_type . '.twig', 'single.twig'], $context);
