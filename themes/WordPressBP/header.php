<!DOCTYPE html>
<!--[if lt IE 9]><html class="no-js lt-ie9" <?php language_attributes() ?>><![endif]-->
<!--[if gte IE 9]><!--><html class="no-js" <?php language_attributes() ?>><!--<![endif]-->
<head>
<meta charset="<?php bloginfo('charset') ?>">
<title><?php wp_title('', true) ?></title>
<meta name="viewport" content="width=device-width">
<script>(function(H){H.className=H.className.replace(/\bno-js\b/,'js')})(document.documentElement)</script>
<!--[if lt IE 9]><script src="<?= get_template_directory_uri() ?>/lib/html5shiv.js"></script><![endif]-->
<?php wp_head() ?>
</head>
<body <?php body_class() ?>>

<header class="header" role="banner">
	<div class="logo"><a href="<?= site_url("/") ?>" title="<?php bloginfo('name') ?>" rel="home"><?php bloginfo('name') ?></a></div>
	<nav class="nav" role="navigation">
		<?php wp_nav_menu(array(
			'theme_location' => 'primary',
			'container' => false,
		)) ?>
	</nav>
</header>

<div class="body">
