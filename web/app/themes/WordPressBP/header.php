<!DOCTYPE html>
<html class="no-js" <?php language_attributes() ?>>
<head>
<meta charset="<?php bloginfo('charset') ?>">
<title><?php wp_title('·', true, 'right') ?></title>
<meta name="viewport" content="width=device-width,initial-scale=1">
<?php wp_head() ?>
</head>
<body <?php body_class() ?>>

<header class="header" role="banner">
  <div class="logo"><a href="<?= home_url('/') ?>" title="<?php bloginfo('name') ?>" rel="home"><?php bloginfo('name') ?></a></div>
  <nav class="nav" role="navigation">
    <?php wp_nav_menu([
      'theme_location' => 'primary',
      'container' => false
    ]) ?>
  </nav>
</header>

<div class="body">
