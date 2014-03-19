<!DOCTYPE html>
<html class="no-js" <?php language_attributes() ?>>
<head>
<meta charset="<?php bloginfo('charset') ?>">
<title><?php wp_title('·', true, 'right') ?></title>
<meta name="viewport" content="width=device-width,initial-scale=1">
<script>(function(h,c){if(/MSIE (\d+\.\d+);/.test(navigator.userAgent)){var v=new Number(RegExp.$1);c=c+' ie'+v}h.className=c}(document.documentElement,'js'))</script>
<?php wp_head() ?>
</head>
<body <?php body_class() ?>>

<header class="header" role="banner">
	<div class="logo"><a href="<?= site_url("/") ?>" title="<?php bloginfo('name') ?>" rel="home"><?php bloginfo('name') ?></a></div>
	<nav class="nav" role="navigation">
		<?php wp_nav_menu(array(
			'theme_location' => 'primary',
			'container' => false
		)) ?>
	</nav>
</header>

<div class="body">
