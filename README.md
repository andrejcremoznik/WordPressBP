# WordPress Boilerplate

The WordPress Boilerplate is a starting base for development of any [WordPress](http://wordpress.org)
based web project. It provides all the files and most common code patterns — the bare essentials needed
to get down and dirty quickly without wasting time setting up directory and file structure, importing
CSS resets, setting up the `functions.php` file etc.

WordPressBP is **meant for developers** developing a WordPress site **from scratch** using a scalable and modern approach.

**It is not:**

1. an end-user template
2. a [WordPress Plugin Boilerplate](https://github.com/tommcfarlin/WordPress-Plugin-Boilerplate)
3. a [WordPress Widget Boilerplate](https://github.com/tommcfarlin/WordPress-Plugin-Boilerplate)

If you need a stripped down version to manage WordPress installations with 3rd-party themes and plugins and an automated deployment process, check out my other project [ManagedWP](https://github.com/andrejcremoznik/ManagedWP).

**Index:**

* [System requirements](#system-requirements)
* [Installation](#installation)
  * [Setup script](#setup-script)
  * [Nginx web server](#nginx-web-server)
* [Development](#development)
  * [Front-end](#front-end)
    * [Including NPM dependencies](#including-npm-dependencies)
  * [Back-end](#back-end)
    * [WordPress config](#wordpress-config)
    * [Including free plugins and themes](#including-free-plugins-and-themes)
    * [Including non-free plugins and themes](#including-non-free-plugins-and-themes)
    * [Including languages](#including-languages)
* [Sync from staging or production](#sync-from-staging-or-production)
  * [Set up a new development environment](#set-up-a-new-development-environment)
* [Deployment](#deployment)
  * [How it works](#how-it-works)
  * [Deploy configuration](#deploy-configuration)
  * [First deploy](#first-deploy)
  * [Deploying and reverting](#deploying-and-reverting)
* [Recommended plugins](#recommended-plugins)
* [Contributors](#contributors)
* [License](#license)


## System requirements

* LEMP stack (Linux, Nginx, MySQL, PHP 7+)
* Git
* NodeJS (`node`) and NPM (`npm`)
* [Composer](https://getcomposer.org/)
* [WP-CLI](http://wp-cli.org/)
* gettext utilities (`msgfmt`) for i18n

Read [this Gist](https://gist.github.com/andrejcremoznik/07429341fff4f318c5dd) on how to correctly set these tools up on your development environment.


## Installation

**Quick-start guide:**

1. Clone this repository and move into it
2. Run the setup script `./setup.sh mywebsite /srv/http/mywebsite.dev`
3. Set up the web server to serve `mywebsite.dev` from `/srv/http/mywebsite.dev/web`
4. Map the server IP to `mywebsite.dev` in your local hosts file (`/etc/hosts`)
5. Login at `http://mywebsite.dev/wp/wp-login.php` (login: dev / dev)
6. Initialize Git in `/srv/http/mywebsite.dev/` and start developing

Continue reading for details.

### Setup script

```
$ ./setup.sh
Usage:
  ./setup.sh <namespace> <project_path> [<branch>]

Params:
  <namespace>:    Lowercase alphanumeric name for your project. Must not start with a number. Must be directory / file system / URL friendly.
  <project_path>: Path to directory where the project structure will be set up.
  <branch>:       Branch from which to create the project structure. Defaults to 'master'.

Example:
  ./setup.sh mything /srv/http/mything.dev
```

The script will create the directory at `project_path` if it doesn't exist. Make sure the parent directory (or `project_path` if exists) is **writable** by the user running this script. **Do not run the setup script as root** unless you're doing everything as root on your dev environment.

The script will use *composer*, *npm* and *wp* (WP-CLI) to install dependencies and setup WordPress. Make sure these tools are installed as explained [here](https://gist.github.com/andrejcremoznik/07429341fff4f318c5dd).

If you don't have or don't want to use a root MySQL account, you'll be asked to manually create a database and user for it.


### Nginx web server

Lets assume your `project_path` is `/srv/http/mywebsite.dev` and `namespace` is `mywebsite`.

Create `/etc/nginx/sites-enabled/mywebsite.dev.conf` with the following content and restart Nginx:

```
# If you have SSL enable this redirect
#server {
#  listen [::]:80;
#  listen 80;
#  server_name mywebsite.dev www.mywebsite.dev;
#  return 301 https://mywebsite.dev$request_uri;
#}

server {
  # If no SSL:
  listen [::]:80;
  listen 80;
  # Else if SSL:
  #listen [::]:443 ssl http2;
  #listen 443 ssl http2;
  #include /etc/nginx/conf.d/ssl.conf; # https://gist.github.com/andrejcremoznik/f0036b58398cafaa9b14ff04030646da#file-ssl-conf
  #ssl_certificate /srv/http/mywebsite.dev.crt;
  #ssl_certificate_key /srv/http/mywebsite.dev.key;

  server_name mywebsite.dev;
  root /srv/http/mywebsite.dev/web;
  index index.html index.php;
  access_log off;
  client_max_body_size 20m;

  # Rewrite URLs for uploaded files to production - no need to sync uploads from production
  #location /app/uploads/ { try_files $uri @production; }
  #location @production { rewrite ^ https://production.site/$request_uri permanent; }

  location / { try_files $uri $uri/ /index.php?$args; }

  location ~ \.php$ {
    try_files $uri =404;
    fastcgi_index index.php;
    include fastcgi_params;
    fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
    # PHP FPM socket:
    fastcgi_pass unix:/run/php-fpm/php-fpm.sock; # Arch
    #fastcgi_pass unix:/var/run/php/php7.2-fpm.sock; # Ubuntu
  }
}
```

To be able to access `http://mywebsite.dev` you need to map the server IP to `mywebsite.dev` domain in `/etc/hosts`. If you're running the server on your local machine, the IP is `127.0.0.1`, if you are using a virtual environment (and you should), then use the IP of that VM.

```
$ /etc/hosts

...
127.0.0.1 mywebsite.dev
```

[Complete Nginx SSL configuration for production.](https://gist.github.com/andrejcremoznik/f0036b58398cafaa9b14ff04030646da)


## Development

Go to your project at `<project_path>/repo` and initialize git or whatever versioning system you like. Note that `.gitignore` and `.gitattributes` are already present so you can quick-start by running:

```
git init
git add .
git commit -m "Initial commit"
git remote add origin git@github.com:mygithubname/mywebsite.git
git push -u origin master
```


### Front-end

Front-end dependencies are handled by NPM and will be installed in the `node_modules` sub-folder.

* `npm run watch` will watch CSS and JS in the theme directory for changes and compile on every change
* `npm run lang` will compile translations (`.po` files)
* `npm run build` will compile and minify CSS and JS and compile translations

Run `npm run` to list all available tasks as configured in `package.json`.

**Compilation details:**

JS is compiled with [Rollup](https://rollupjs.org/) from **ES2015+**. Build process is coded in `config/scripts/build-js.js` which you can adjust as needed.

CSS is compiled with `node-sass` from **Sass** sources. Build process is coded in `config/scripts/build-css.js`.

Languages are build from `.po` files with `msgfmt`. Build process is coded in `config/scripts/build-lang.js`.


#### Including NPM dependencies

* Include dependencies: `npm install <package>`
* Keep dependencies updated: `npm update`


### Back-end

Develop your template in the `web/app/themes/mywebsite`. The base template is set up to use [Timber](https://github.com/timber/timber) which allows you to write views using [Twig](https://twig.symfony.com/).

If you're going to build custom plugins put them in `web/app/plugins` and prefix the folder name with you project's namespace e.g. `mywebsite-cool-plugin`. This way they won't be ignored by `.gitignore` otherwise you'll have to modify its rules. A basic plugin is included with some neat defaults and example code that you can extend to support your theme.


#### WordPress config

WordPress configuration is set in the following files:

* `.env` - local environment settings
* `config/application.php` - global defaults
* `config/environments/<environment>.php` - environment specific defaults


#### Including free plugins and themes

Use **composer** to pull in free plugins and themes from [WordPres Packagist](https://wpackagist.org/). You can also include any packages from [Packagist](https://packagist.org/) and other compatible repositories.

* Include a plugin: `composer require wpackagist-plugin/wordpress-seo`
* Keep dependencies updated: `composer update`


#### Including non-free plugins and themes

You want to keep those out of the repository but still deploy them with the rest of the code. `.gitignore` is set up to ignore everything inside `web/app/{themes,plugins}/` unless the name starts with `<namespace>` so you can easily place non-free themes and plugin there for local development.

Then open `config/scripts/deploy-pack.js` and make sure these files are copied into the `build` directory before deploy. Look for the `TODO` comment near the top of the file for examples.

**Protip:** If you're developing multiple sites on the same dev environment and share a plugin between them (like ACF Pro), symlink it from a single source everywhere you need it. When the project is being packed for deploy, the `copy` command will resolve the symlink and copy the files instead. E.g.:

* Shared plugin: `/srv/http/shared-plugin`
* Project 1 `/srv/http/project1/web/app/plugins/shared-plugin -> /srv/http/shared-plugin` - a symlink to shared plugin
* Project 2 `/srv/http/project2/web/app/plugins/shared-plugin -> /srv/http/shared-plugin` - a symlink to shared plugin
* Then for every project copy the common plugin into `build` when deploying:
  ```
  add to: config/scripts/deploy-pack.js:
  ...
  sh.cp('-fr', 'web/app/plugins/shared-plugin', 'build/web/app/plugins/')
  ...
  ```


#### Including languages

You could set up composer to use [WP language packs by Koodimonni](https://wp-languages.github.io/) or you can manually download the language pack you need and place the files in `web/app/languages/`.

Then edit `config/scripts/deploy-pack.js` and make sure these files are copied into the `build` directory before deploy.


## Sync from staging or production

**Syncing from the server requires SSH access.** Basic SSH understanding is expected for syncing and deployment which isn't covered here.

Syncing requires `wp` (WP-CLI) also available in non-interactive shells on the server. [This gist](https://gist.github.com/andrejcremoznik/07429341fff4f318c5dd) explains that as well.

Copy `sync.sh.example` to `sync.sh`, open it and look for `TODO` comments. Set those up before you use the script.


### Set up a new development environment

1. Ensure you have SSH access to staging or production (wherever `sync.sh` points to)
2. Create a local database and user
3. Clone the repository
4. Copy `.env.example` to `.env` and set it up
5. Install dependencies and build the project
  ```
  composer install
  npm install
  npm run build
  ```
6. Sync the database `./sync.sh`
7. Set up the web server and `/etc/hosts`

If you want to push database changes upstream, you will have to figure out how to do migrations. Without that, the only way to ensure a working codebase for everybody on the team is to **only sync the database downstream.** Whenever database changes are required (WP settings, posts, pages etc.) repeat them on staging when you push and deploy the code.

Keep notes on what to configure when you push everything to production.

*Ideas / contributions for DB migrations welcome!*


## Deployment

WordPressBP includes a simple automated deployment script using `node-shell` and `node-ssh` packages. You can deploy your website by running `npm run deploy` but this requires some setup. All the configuration for deploys is in `config/scripts` directory.

Deploy requires **Git**, **SSH** and **tar**. It's been tested on Linux environments, Mac should work, but Windows probably won't.


### How it works

Run `npm run deploy` or `npm run deploy <environment>`.

1. When you run deploy, current repository `HEAD` will be build and zipped into a tarball archive
2. The tarball is uploaded to server over SSH and extracted into a temporary directory
3. Static folders and files like `uploads` are symlinked into this temporary directory
4. Finally, the live `current` directory is renamed to `previous` and the new temporary directory is renamed to `current`
5. Cleanup tasks are run to remove any temporary files from server and local folders

If there's an error with the newly deployed version, you are able to revert to previous deploy by running `npm run deploy:revert <environment>`.

If your server is correctly configured, the deployment scripts will never require root (or sudo) to any command or part of the file system.


### Deploy configuration

Copy `config/scripts/deploy-config.js.example` to `config/scripts/deploy-config.js` and open it.

* `defaultDeployEnv` - default environment to deploy to. Needs an entry in `deployEnvSSH` and `deployEnvPaths`
* `deployEnvSSH` - SSH connection parameters for all environments you want to deploy too
* `deployEnvPaths` - Path to directory where you want to deploy the files to for all environments

If your server requires public key authentication, locally the key needs to be managed by an SSH agent so that NodeJS can access it through the `SSH_AUTH_SOCK` environment variable.


### First deploy

1. Create a **writable** (for the SSH user) directory on the server where you want to store the files. This should be the path set in `deployEnvPaths` in `config/scripts/deploy-config.js`.
2. On development machine run `npm run deploy:init` or `npm run deploy:init [environment]`. This will create the needed directory structure.
3. Configure the web server to serve from `<directory_from_step_1>/current/web`.
4. Visit your website. If everything is correct you should see a `phpinfo()` page.
5. Create the database:
  ```
  $ mysql -u root -p
  create database mywebsitedb;
  grant all privileges on mywebsitedb.* to 'dbuser'@'localhost' identified by 'some_password';
  flush privileges;
  \q
  ```
6. Dump local database and import it on the server: `wp db export - | ssh user@host -p 54321 'mysql -u dbuser -psome_password mywebsitedb'` (run this locally, the `-p<password>` is intentionally without space after `-p`).
7. Set up the environment in `<directory_from_step_1>/static/.env`.
8. Make `<directory_from_step_1>/static/uploads` writable for the PHP process group:
  ```
  chown user:www-data uploads # you might need to sudo this
  chmod g+w uploads
  ```
9. Finally, deploy the code: `npm run deploy` or `npm run deploy [environment]`.


### Deploying and reverting

All commands support optional environment. If you don't specify it, the default from `config/scripts/deploy-config.js` will be used.

* `npm run deploy [environment]` will deploy the current Git `HEAD` to `environment`. If you leave out the environment, the `defaultDeployEnv` will be used.
* `npm run deploy:revert [environment]` allows you to revert **1 time** to previously deployed release.

If you need more flexibility, you can extend the deploy scripts or look into a dedicated deploy tool.


## Recommended plugins

**PLUGIN RULE #1: Do not use a plugin if doing it by yourself is reasonable!**

You don't need plugins for sliders, lightboxes, social widgets etc. and you certainly don't want plugins not being actively developed. Most WP plugins are garbage that will make your site slow and *insecure*.

Here are some developer-friendly and maintained plugins that you can use:

* [Advanced Custom Fields](https://www.advancedcustomfields.com/) - custom fields for posts
* [Polylang](http://wordpress.org/plugins/polylang/) - multilingual sites
* [Yoast SEO](http://wordpress.org/plugins/wordpress-seo/) - SEO metadata for posts, sitemap…
* [Ninja Forms](http://wordpress.org/plugins/ninja-forms/) - forms plugin

And some of my own plugins:

* [Lean Lightbox](https://github.com/andrejcremoznik/lean-lightbox) - lightbox for single image links and post galleries
* [Lean Redirect Editor](https://github.com/andrejcremoznik/lean-redirect-editor) - redirect users from any path on your hostname to any URL.


## Contributors

* [Oto Brglez](https://github.com/otobrglez)


## License

WordPressBP is licensed under the MIT license. See LICENSE.md
