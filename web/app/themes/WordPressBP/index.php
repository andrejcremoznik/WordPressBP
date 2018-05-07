<?php

$context = Timber::get_context();
$context['posts'] = new Timber\PostQuery();

if (is_active_sidebar('sidebar')) {
  $context['sidebar'] = Timber::get_widgets('sidebar');
}

$views = ['index.twig'];

// if (is_home()) {
//   array_unshift($views, 'home.twig');
// }

Timber::render($views, $context);
