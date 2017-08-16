<?php

$post = new TimberPost();
$context = Timber::get_context();
$context['post'] = $post;
if (is_active_sidebar('primary_sidebar')) {
  $context['primary_sidebar'] = Timber::get_widgets('primary_sidebar');
}
if (comments_open()) {
  $context['comment_form'] = TimberHelper::get_comment_form();
}

if (post_password_required($post->ID)) {
  Timber::render('single-protected.twig', $context);
} else {
  Timber::render(['single-' . $post->post_type . '.twig', 'single.twig'], $context);
}
