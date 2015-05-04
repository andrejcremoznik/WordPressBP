<?php get_header() ?>

<main class="main" role="main">
  <?php if(have_posts()): while(have_posts()): the_post() ?>
    <article <?php post_class() ?>>
      <header>
        <h1><a href="<?php the_permalink() ?>"><?php the_title() ?></a></h1>
        <p class="post-meta">
          <span class="date"><time datetime="<?php the_time('c') ?>" pubdate><?php the_time(get_option('date_format')) ?></time></span>
          <span class="category"><?php _e('Category', 'WordPressBP') ?>: <?php the_category(', ') ?></span>
          <span class="tags"><?php the_tags(__('Tags', 'WordPressBP').': ',', ') ?></span>
          <span class="author"><?php _e('Author', 'WordPressBP')?>: <?php the_author_posts_link() ?></span>
        </p>
      </header>
      <?php the_excerpt() ?>
    </article>
  <?php endwhile; else: ?>
    <article class="no-results">
      <h1><?php _e('Sorry, no posts matched your criteria.', 'WordPressBP') ?></h1>
    </article>
  <?php endif ?>
</main>

<?php
  get_sidebar();
  get_footer();
