# WordPress Boilerplate

The WordPress Boilerplate is a starting base for development of any [WordPress](http://wordpress.org)
based web project. It provides all the files and most common code patterns — the bare essentials needed
to get down and dirty quickly without wasting time setting up directory and file structure, importing
CSS resets, setting up the `functions.php` file etc.

WordPressBP is **meant for developers** developing a WordPress site **from stratch** using
**Sass/Compass** CSS pre-processor.

**It is not:**

1. an end-user template
2. a [WordPress Plugin Boilerplate](https://github.com/tommcfarlin/WordPress-Plugin-Boilerplate)
3. a [WordPress Widget Boilerplate](https://github.com/tommcfarlin/WordPress-Plugin-Boilerplate)


## System requirements

* Ruby and [Compass](http://compass-style.org) `gem install compass`
* Nodejs and [Grunt CLI](http://gruntjs.com/getting-started#installing-the-cli)


## Quickstart guide


### Setup.sh

```
$ ./setup.sh
Usage:
 ./setup.sh <namespace> <project_path>

 <namespace>:    Alphanumeric name for your project. Used for namespacing functions, file and folder names etc.
 <project_path>: Path to where the plugins and themes directories will be set up.
```

A typical command would be:

```
./setup.sh myproject /var/www/myproject/repo/
```


### Recommended plugins for developers

**PLUGIN RULE #1: Do not use plugins if doing it by yourself is reasonable!**

You don't need plugins for sliders, lightboxes, social widgets etc. and you certainly don't want plugins
not being actively developed.

Here are some developer-friendly and maintained plugins that you can use:

* [Advanced Custom Fields](http://wordpress.org/plugins/advanced-custom-fields/) - custom fields for posts
* [Polylang](http://wordpress.org/plugins/polylang/) - everything you need for multilingual sites
* [WordPress SEO](http://wordpress.org/plugins/wordpress-seo/) - SEO metadata for posts, sitemap…
* [WP-PageNavi](http://wordpress.org/plugins/wp-pagenavi/) - numbered pagination for archives
* [Redirect Editor](http://wordpress.org/plugins/redirect-editor/) - need to 301 redirect a URL?
* [Ninja Forms](http://wordpress.org/plugins/ninja-forms/) - works fairly well for forms


## Attribution

WordPressBP comes with [Normalize.css by Nicolas Gallagher](https://github.com/necolas/normalize.css).


### Contributors

* [Oto Brglez](https://github.com/otobrglez)


## License

WordPressBP is [CC0](http://creativecommons.org/publicdomain/zero/1.0/) except for the third party
code distributed with it (currently: normalize.css) which keeps the original license.
