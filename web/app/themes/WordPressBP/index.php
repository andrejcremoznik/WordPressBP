<?php

$context = Timber::get_context();
$context['posts'] = new Timber\PostQuery();

$views = ['index.twig'];

// if (is_home()) {
//   array_unshift($views, 'home.twig');
// }

Timber::render($views, $context);
