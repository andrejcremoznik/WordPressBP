<?php get_header(); ?>

<div class="main" role="main">
	<?php if(have_posts()): while(have_posts()): the_post(); ?>
		<article <?php post_class(); ?>>
			<header>
				<h1><a href="<?php the_permalink() ?>"><?php the_title(); ?></a></h1>
				<p class="post-meta">
					<span class="meta date"><time datetime="<?php the_time('c'); ?>" pubdate><?php the_time(get_option('date_format')); ?></time></span>
					<span class="meta category"><?php _e('Category', 'WordPressBP'); echo ': '; the_category(', '); ?></span>
					<span class="meta tags"><?php the_tags(__('Tags', 'WordPressBP').': ',', '); ?></span>
					<span class="meta author"><?php _e('Author', 'WordPressBP'); echo ': '; the_author_posts_link(); ?></span>
				</p>
			</header>
			<?php the_excerpt(); ?>
		</article>
	<?php endwhile; else: ?>
		<article class="no-results">
			<h1><?php _e('Sorry, no posts matched your criteria.', 'WordPressBP'); ?></h1>
		</article>
	<?php endif; ?>
</div>

<?php get_sidebar(); ?>

<?php get_footer(); ?>
