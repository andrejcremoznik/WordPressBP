<?php get_header() ?>

<main class="main" role="main">
  <?php
    if (have_posts())
    {
      while (have_posts())
      {
        the_post();
        get_template_part('loop', 'default');
      }
    }
    else
    {
      get_template_part('loop', 'empty');
    }
  ?>
</main>

<?php
  get_sidebar();
  get_footer();
