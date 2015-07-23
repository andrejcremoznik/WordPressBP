<?php //if(!is_active_sidebar('primary_sidebar')) return ?>
<aside class="aside" role="complementary">
  <ul>
    <?php if (!dynamic_sidebar('primary_sidebar')): ?>
      <li><?php _e('No active widgets', 'WordPressBP') ?></li>
    <?php endif ?>
  </ul>
</aside>
