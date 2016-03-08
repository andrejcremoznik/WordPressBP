<?php

if (!class_exists('Timber')) {
  echo 'Timber not activated. Make sure you activate the plugin.';
  return;
}

$context = Timber::get_context();

Timber::render('404.twig', $context);
