SASS/Compass instructions
=========================

This project uses SASS CSS preprocessor. To compile
CSS from SASS sources, do the following:


Install the necessary tools
---------------------------

1. ruby (from packet manager or preferably [RVM](http://rvm.io))
2. `gem install compass --no-ri --no-rdoc`

To keep your gems up-to-date:

2. `gem update --no-ri --no-rdoc`


Compile static CSS
------------------

Execute the following in the directory with the `config.rb` file.

To compile static CSS once:
* `compass compile`

To compile static CSS for production:
* `compass compile -e production --force`

To watch SASS files for changes and recompile on every change:
* `compass watch`


Translation instructions
========================

While building your theme write all strings in US English
and wrap them properly for translations with gettext:
[I18n for WordPress Developers](http://codex.wordpress.org/I18n_for_WordPress_Developers)

The textdomain is set in the functions.php file.

Compile all translatable strings in the en_US.pot file.

Copy en_US.pot to `locale.po` e.g.:
* `cp en_US.pot sl_SI.po`

Translate the .po file

Compile the translation
* `msgfmt sl_SI.po -o sl_SI.mo`
