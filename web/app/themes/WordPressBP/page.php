<?php

$post = new Timber\Post();
$context = Timber::get_context();
$context['post'] = $post;
if (is_active_sidebar('primary_sidebar')) {
  $context['primary_sidebar'] = Timber::get_widgets('primary_sidebar');
}

Timber::render(['page-' . $post->post_name . '.twig', 'page.twig'], $context);
