<?php get_header() ?>

<main class="main" role="main">
  <?php if(have_posts()): while(have_posts()): the_post() ?>
    <article <?php post_class() ?>>
      <h1><?php the_title() ?></h1>
      <?php the_content() ?>
      <?php if(comments_open() || get_comments_number()) comments_template() ?>
    </article>
  <?php endwhile; endif ?>
</main>

<?php
  get_sidebar();
  get_footer();
