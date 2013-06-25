<?php //if(!is_active_sidebar('sidebar1')) return; ?>
<aside class="aside" role="complementary">
	<ul>
		<?php if(!dynamic_sidebar('sidebar1')) : ?>
			<li><?php _e('No active widgets', 'WordPressBP'); ?></li>
		<?php endif ; ?>
	</ul>
</aside>
