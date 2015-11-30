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

* LEMP stack (Linux, Nginx, PHP 5.4+, MySQL)
* NodeJS & Node Package Manager (npm)
  * [Grunt CLI](http://gruntjs.com/getting-started#installing-the-cli)
  * [Bower](http://bower.io/)
* [Composer](https://getcomposer.org/)
* [WP-CLI](http://wp-cli.org/)

Read [this Gist](https://gist.github.com/andrejcremoznik/07429341fff4f318c5dd) on how to correctly setup these tools on your development environment.


## Quickstart guide

Once upon a time you had to do things manually. Nowadays the setup script will take care of (almost) everything.
Make sure you meet the system requirements above.


### Setup script

```
$ ./setup.sh
Usage:
 ./setup.sh <namespace> <project_path> [<branch>]

 <namespace>:    Alphanumeric name for your project. Used for namespacing functions, file and folder names etc.
 <project_path>: Path to where the plugins and themes directories will be set up.
 <branch>:       Optional: checkout a specific branch (default: master)
```

A typical command would be:

```
./setup.sh mywebsite /srv/http/myproject.dev
```

The script will create the directory at `project_path` if it doesn't exist. Make sure the parent directory (or `project_path` if exists) is **writeable** by the user running this script. **Do not run the setup script as root.** It won't do anything evil but you shouldn't take my word for it.

Later on the setup script will use *composer*, *npm*, *bower*, *grunt* and *wp* (WP_CLI) to install dependecies and setup WordPress. Make sure these tools are installed as written in [here](https://gist.github.com/andrejcremoznik/07429341fff4f318c5dd).

If you don't have or don't want to use a root MySQL account, prepare a database and user beforehand.


### Nginx

Let's assume your `project_path` is `/srv/http/myproject.dev` and `namespace` is `mywebsite`.

1. The main virtual host configuration file is `/srv/http/myproject.dev/etc/nginx.conf`. Look at the file if it requires any changes (you might need to change the fastcgi_pass). This file is specific to your system.
2. At `/srv/http/myproject.dev/repo/etc/mywebsite.conf` is shared Nginx configuration. This file is included in your code repository and loaded by the main virtual host file. If you need specific Nginx configuration to be shared among all developers and production, this is the place.
3. You need to include `/srv/http/myproject.dev/etc/nginx.conf` in your main Nginx config at `/etc/nginx/nginx.conf`. You might use a wildcard so you don't have to edit it for every new project. Inside `http { ... }` block put `include /srv/http/*/etc/nginx.conf;`.
4. Restart Nginx to load the new configuration: `sudo systemctl restart nginx.service`


## Developing

Go to your project at `<project_path>/repo` and initialize git or whatever versioning sistem you like. Note that `.gitignore` and `.gitattributes` are already present so you can quickstart by running:

```
git init
git add .
git commit -m "Initial commit"
git remote add origin git@github.com:mygithubname/myproject.git
git push -u origin master
```


### Frontend

Frontend dependecies are handled by Bower and will be installed in the `bower_modules` subfolder. Pull them in by referencing stylesheets from the Sass files and javascripts from the `concat` Grunt task configuration file.

When developing use `grunt watch` to watch stylesheets and javascripts for changes and to compile on every change.

`grunt` will compile stylesheets and javascripts, `grunt production` will also minify them.


### Backend

Develop your template in the `web/app/themes/mywebsite`.

If you're going to build custom plugins put them in `web/app/plugins` and prefix the folder name with you project's namespace as used in the setup script. This way they won't be ignored by `.gitignore` otherwise you'll have to modify that file.

Use **composer** to pull in 3rd-party plugins to your project from [WordPres Packagist](http://wpackagist.org/).


## Introducing new developers to your project

Before you get your team to co-develop your project, you will want to set up a staging environment. When done:

1. Have a look at the `sync.sh` script and set it up
1. Make sure your team members have SSH access to staging
2. Have them clone the code repository
3. Everyone should set up a MySQL database
4. Inside repo copy `.env.example` to `.env` and set it up with everyone's database settings
5. Run the sync script to get the database

So syncing the database only works downstream. Have some rules set up regarding configuration on staging and syncing. Make sure everyone sets up his changes on staging regularly and in small increments unless you figure out how to do migrations. Communicate changes to configurations to the entire team. Always keep everyone in the loop.


### Deploying with Grunt

WordPressBP includes a simple automated deployment script using Grunt. You can deploy your website by running `grunt deploy --env=production` but this requires some setup. All the configuration for deploys is in `Gruntfile.js` if you're feeling adventurous.

TODO: Instructions how to prepare the server and configure `Gruntfile.js` for automated deploys.


### Recommended plugins

**PLUGIN RULE #1: Do not use a plugin if doing it by yourself is reasonable!**

You don't need plugins for sliders, lightboxes, social widgets etc. and you certainly don't want plugins
not being actively developed.

Here are some developer-friendly and maintained plugins that you can use:

* [Advanced Custom Fields](http://wordpress.org/plugins/advanced-custom-fields/) - custom fields for posts
* [Polylang](http://wordpress.org/plugins/polylang/) - everything you need for multilingual sites
* [Yoast SEO](http://wordpress.org/plugins/wordpress-seo/) - SEO metadata for posts, sitemap…
* [WP-PageNavi](http://wordpress.org/plugins/wp-pagenavi/) - numbered pagination for archives
* [Redirect Editor](http://wordpress.org/plugins/redirect-editor/) - need to 301 redirect a URL?
* [Ninja Forms](http://wordpress.org/plugins/ninja-forms/) - works fairly well for forms


### Contributors

* [Oto Brglez](https://github.com/otobrglez)


## License

WordPressBP is licensed under the MIT license. See LICENSE.md
