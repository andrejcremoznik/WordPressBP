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


## System requirements

* LEMP stack (Linux, Nginx, PHP 5.6+, MySQL)
* NodeJS (`node`, `npm`)
* [Composer](https://getcomposer.org/)
* [WP-CLI](http://wp-cli.org/)
* gettext utilities (`msgfmt`) for i18n

Read [this Gist](https://gist.github.com/andrejcremoznik/07429341fff4f318c5dd) on how to correctly set these tools up on your development environment.


## Quick-start guide

The setup script will take care of (almost) everything to get you started.
Make sure you meet the system requirements above.


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

The script will create the directory at `project_path` if it doesn't exist. Make sure the parent directory (or `project_path` if exists) is **writable** by the user running this script. **Do not run the setup script as root.** It won't do anything evil but you shouldn't take my word for it.

Later on the setup script will use *composer*, *npm* and *wp* (WP-CLI) to install dependencies and setup WordPress. Make sure these tools are installed as explained [here](https://gist.github.com/andrejcremoznik/07429341fff4f318c5dd).

If you don't have or don't want to use a root MySQL account, prepare a database and user beforehand.


### Nginx

Let's assume your `project_path` is `/srv/http/mywebsite.dev` and `namespace` is `mywebsite`.

1. The main virtual host configuration file is `/srv/http/mywebsite.dev/etc/nginx.conf`. Look at the file if it requires any changes (you might need to change the `fastcgi_pass`). This file is specific to your system.
2. At `/srv/http/mywebsite.dev/repo/config/nginx/mywebsite.conf` is shared Nginx configuration. This file is included in your code repository and loaded by the main virtual host file. If you need specific Nginx configuration to be shared among all developers and production, this is the place.
3. You need to include `/srv/http/mywebsite.dev/etc/nginx.conf` in your system Nginx config at `/etc/nginx/nginx.conf`. Inside the `http { ... }` block put `include /srv/http/*/etc/nginx.conf;`.
4. Restart Nginx to load the new configuration: `sudo systemctl restart nginx.service`

By default your website will be accessible at `http://<namespace>.dev`. Map `mywebsite.dev` to the correct IP address in your `hosts` file.


## Developing

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

When developing use `npm run watch` to watch CSS and JS for changes and to compile on every change.

`npm run build` will compile all assets and minify them.

Run `npm run` to list all available tasks as configured in `package.json`.


### Back-end

Develop your template in the `web/app/themes/mywebsite`. The base template is set up to use [Timber](https://github.com/timber/timber) which allows you to write views using [Twig](https://twig.symfony.com/).

If you're going to build custom plugins put them in `web/app/plugins` and prefix the folder name with you project's namespace e.g. `mywebsite-cool-plugin`. This way they won't be ignored by `.gitignore` otherwise you'll have to modify its rules. A basic plugin is included with some neat defaults and example code that you can extend to support your theme.

Use **composer** to pull in 3rd-party libraries and WP plugins from [WordPres Packagist](https://wpackagist.org/)  to your project. E.g. `composer require wpackagist-plugin/wordpress-seo`.


## Introducing new developers to your project

Before you get your team to co-develop your project, you will want to set up a staging environment (see [Deploying](#deploying)). You'll also need WP-CLI available on the server to non-interactive shells (set up the PATH at the very top of `.bashrc`). When done:

1. Have a look at the `sync.sh` script and set it up
2. Make sure your team members have SSH access to staging
3. Have them clone the code repository
4. Everyone should set up a MySQL database
5. Inside repo copy `.env.example` to `.env` and set it up
6. Run the sync script to get the database from staging
7. In Nginx config at `<project_path>/etc/nginx.conf` uncomment and configure the block to rewrite URLs for file uploads. This way you don't have to sync the `uploads` folder from the server.

Syncing the database only works downstream. Have some rules set up regarding configuration on staging and syncing. Make sure everyone sets up their changes on staging regularly and in small increments unless you figure out how to do migrations. Communicate configuration changes to the entire team. Always keep everyone in the loop.


## Deploying

WordPressBP includes a simple automated deployment script using Node Shell and SSH packages. You can deploy your website by running `npm run deploy [production]` but this requires some setup. All the configuration for deploys is in `config/scripts` directory.

Deploy requires **Git**, **SSH** and **tar**. It's been tested on Linux environments, Mac should work, but Windows probably won't.


### How it works

Run `npm run deploy` or `npm run deploy <environment>`.

1. When you run deploy, current repository `HEAD` will be build and zipped into an tarball archive
2. The tarball is uploaded to server over SSH and extracted into a temporary directory
3. Static folders and files like `uploads` are symlinked into this temporary directory
4. Finally, the live `current` directory is renamed to `previous` and the new temporary directory is renamed to `current`
5. Cleanup tasks are run to remove any temporary files from server and local folders.

If there's an error with the newly deployed version, you are able to revert to previous deploy by running `npm run deploy:revert <environment>`.


### Configuration

Edit `config/scripts/deploy-config.js`.

`deployEnvSSH` holds all environments you want to deploy too. If you don't specify an environment when running `npm run deploy`, scripts will default to `staging`.

Every environment defines parameters for an SSH connection. `agent` points to an SSH agent socket. It's strongly advisable to have your SSH keys managed by an agent so instead of working around this with a different type of connection, [better configure your system](https://wiki.archlinux.org/index.php/SSH_Keys#SSH_agents).

`phpProcessGroup` should be the name of the group the PHP process runs as. This usually defaults to `www-data`. Deploy scripts use this to set writable permissions for things like `uploads`.

`deployEnvPaths` holds the paths to deploy directories for all environments. It's recommended to use `/srv/http` as the base for your websites. **This directory needs to be writable by the configured user.**


### First deploy

First you need to set up folders, Nginx and the database on the server.

1. Run `npm run deploy:init [environment]`. This will set up the basic skeleton at the configured remote path.
2. Create the database on server:
  ```
  $ mysql -u root -p
  CREATE NEW DATABASE mywebsite;
  GRANT ALL PRIVILEGES ON *.mywebsite TO 'someuser'@'localhost' IDENTIFIED BY 'somepassword';
  FLUSH PRIVILEGES;
  \q
  ```
3. Set up Nginx on server. Use local config as an example. Web root should be path configured in `deploy-config.js` + `/current/web`.
4. Configure the `.env` file that the script warned about. Use the local file as an example. Don't forget to configure the salts.
5. Deploy the project: `npm run deploy [environment]`
6. Populate the database by exporting locally and importing on server or simply visiting the website in browser and running the installation script.


### Deploying and reverting

`npm run deploy [environment]` will deploy the current Git `HEAD` so make sure you're on the correct spot.

If you deploy broken code, you can revert **1 time** to the previous release by running `npm run deploy:revert [environment]`.

If you need more flexibility, you can extend the deploy scripts or look into a dedicated deploy tool.


## Recommended plugins

**PLUGIN RULE #1: Do not use a plugin if doing it by yourself is reasonable!**

You don't need plugins for sliders, lightboxes, social widgets etc. and you certainly don't want plugins not being actively developed. Most WP plugins are garbage that will make your site slow and *insecure*.

Here are some developer-friendly and maintained plugins that you can use:

* [Advanced Custom Fields](http://wordpress.org/plugins/advanced-custom-fields/) - custom fields for posts
* [Polylang](http://wordpress.org/plugins/polylang/) - everything you need for multilingual sites
* [Yoast SEO](http://wordpress.org/plugins/wordpress-seo/) - SEO metadata for posts, sitemap…
* [WP-PageNavi](http://wordpress.org/plugins/wp-pagenavi/) - numbered pagination for archives
* [Redirect Editor](http://wordpress.org/plugins/redirect-editor/) - need to 301 redirect a URL?
* [Ninja Forms](http://wordpress.org/plugins/ninja-forms/) - works fairly well for forms


## Contributors

* [Oto Brglez](https://github.com/otobrglez)


## License

WordPressBP is licensed under the MIT license. See LICENSE.md
