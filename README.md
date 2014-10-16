# WordPress Boilerplate

The WordPress Boilerplate is a starting base for development of any [WordPress](http://wordpress.org)
based web project. It provides all the files and most common code patterns — the bare essentials needed
to get down and dirty quickly without wasting time setting up directory and file structure, importing
CSS resets, setting up the `functions.php` file etc.

WordPressBP is **meant for developers** developing a WordPress site **from stratch** using
**Sass** CSS pre-processor.

**It is not:**

1. an end-user template
2. a [WordPress Plugin Boilerplate](https://github.com/tommcfarlin/WordPress-Plugin-Boilerplate)
3. a [WordPress Widget Boilerplate](https://github.com/tommcfarlin/WordPress-Plugin-Boilerplate)


## System requirements

* LEMP stack (Linux, Nginx, PHP, MySQL)
* NodeJS & Node Package Manager (npm)
  * [Grunt CLI](http://gruntjs.com/getting-started#installing-the-cli) `sudo npm install -g grunt-cli`
  * [Bower](http://bower.io/) `sudo npm install -g bower`
* [Composer](https://getcomposer.org/) - installed as 'composer' in user's $PATH
* [WP-CLI](http://wp-cli.org/) - installed as 'wp' in user's $PATH


## Quickstart guide

1. Configure your web server (see details below)
2. Run the `setup` script (see details below)
  1. Example: `./setup.sh myproject /srv/http/myproject/repo`
3. Edit the **.env** file - setup database access, environment and salts
4. Edit **composer.json** - fill in the required metadata then run `composer install`
5. Run `npm install` to install Node build tools
6. Run `bower install` to install Bower front-end assets
7. Run `grunt` to compile all front-end assets
8. Setup WordPress with WP-CLI
  1. `wp db create`
  2. `wp core install --url=<url> --title=<site-title> --admin_user=<username> --admin_password=<password> --admin_email=<email>`
  3. `wp site empty --yes`
  4. `wp theme activate <namespace>` - the same namespace as used in the setup script
9. Make `web/app/uploads` directory writeable by the webserver
10. Visit your new site eg. *http://mysite.dev*
  1. Login is at *http://mysite.dev/wp/wp-login.php*


### Web server setup example

Directory structure:

```
/srv/http/mysite.dev ┬ etc ─ nginx.conf
                     ├ log ┬ access.log
                     │     └ error.log
                     └ repo
```

* `nginx.conf` - Nginx configuration from my [conf](https://github.com/andrejcremoznik/conf/tree/master/nginx) repository. If you're using WordPressBP installed into the `repo` directory, then the `root` path for the server would be `/srv/http/mysite.dev/repo/web`.
* `log` - Contains server logs - has to be writable by Nginx
* `repo` - The directory you'd use for <project_path> when using the `setup` script.


### Setup script

```
$ ./setup.sh
Usage:
 ./setup.sh <namespace> <project_path>

 <namespace>:    Alphanumeric name for your project. Used for namespacing functions, file and folder names etc.
 <project_path>: Path to where the plugins and themes directories will be set up.
```

A typical command would be:

```
./setup.sh myproject /srv/http/myproject/repo/
```


### Recommended plugins

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

WordPressBP is [CC0](http://creativecommons.org/publicdomain/zero/1.0/) except for any third party
code distributed with it (currently: normalize.css) which keeps the original license. Contributions
to this project should adhere to the CC0 license.
