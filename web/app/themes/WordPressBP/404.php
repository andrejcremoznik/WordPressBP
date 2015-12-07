<?php

$context = Timber::get_context();

$context['i18n']['missing_title'] = __('Missing page!', 'WordPressBP');
$context['i18n']['missing_description'] = __('We couldn’t find any content at this address.', 'WordPressBP');

Timber::render('404.twig', $context);
