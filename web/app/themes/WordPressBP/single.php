<?php

$context = Timber::get_context();
$post = Timber::query_post();
$context['post'] = $post;
$context['sidebar'] = Timber::get_widgets('primary_sidebar');
$context['comment_form'] = TimberHelper::get_comment_form();

$context['i18n']['author'] = __('Author', 'WordPressBP');
$context['i18n']['password'] = __('Password', 'WordPressBP');

if (post_password_required($post->ID)) {
  Timber::render('single-protected.twig', $context);
} else {
  Timber::render(['single-' . $post->ID . '.twig', 'single-' . $post->post_type . '.twig', 'single.twig'], $context);
}
