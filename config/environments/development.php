<?php

define('SAVEQUERIES', true);
define('WP_DEBUG', true);
define('SCRIPT_DEBUG', true);
define('WP_CACHE', false);

function dump($var) {
  echo '<pre style="font:12px/1 monospace;">';
  die(var_dump($var));
}
