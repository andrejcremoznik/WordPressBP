<?php if(post_password_required()) return ?>

<section id="comments" class="comments-area">
  <?php if(have_comments()): ?>

    <h2 class="comments-title"><?php
      printf(
        _n('One thought on &ldquo;%2$s&rdquo;', '%1$s thoughts on &ldquo;%2$s&rdquo;', get_comments_number(), 'WordPressBP'),
        number_format_i18n(get_comments_number()),
        get_the_title()
      );
    ?></h2>

    <?php if(get_comment_pages_count() > 1 && get_option('page_comments')): ?>
      <nav id="comment-nav-above" class="comment-navigation" role="navigation">
        <h4 class="visuallyhidden"><?php _e('Comment navigation', 'WordPressBP') ?></h1>
        <?php previous_comments_link(__('&larr; Older Comments', 'WordPressBP')) ?>
        <?php next_comments_link(__('Newer Comments &rarr;', 'WordPressBP')) ?>
      </nav>
    <?php endif ?>

    <ol class="comment-list"><?php
      wp_list_comments(array(
        'style'      => 'ol',
        'short_ping' => true,
        'avatar_size'=> 34
      ));
    ?></ol>

    <?php if(get_comment_pages_count() > 1 && get_option('page_comments')): ?>
      <nav id="comment-nav-below" class="comment-navigation" role="navigation">
        <h4 class="visuallyhidden"><?php _e('Comment navigation', 'WordPressBP') ?></h1>
        <?php previous_comments_link(__('&larr; Older Comments', 'WordPressBP')) ?>
        <?php next_comments_link(__('Newer Comments &rarr;', 'WordPressBP')) ?>
      </nav>
    <?php endif ?>

    <?php if(!comments_open()): ?>
      <p class="no-comments"><?php _e('Comments are closed.', 'WordPressBP') ?></p>
    <?php endif ?>

  <?php endif ?>

  <?php comment_form() ?>
</section>
