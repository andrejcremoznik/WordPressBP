WordPress Boilerplate
=====================

The WordPress Boilerplate is a starting base for development of any [WordPress](http://wordpress.org)
based web project. It provides all the files and most common code patterns — the bare essentials needed
to get down and dirty quickly without wasting time setting up directory and file structure, importing
CSS resets, setting up the functions.php file etc.

WordPressBP is *meant for developers* developing a WordPress site *from stratch* using *Sass/Compass* CSS
pre-processor.

*It is not:*

1. an end-user template
2. a [WordPress Plugin Boilerplate](https://github.com/tommcfarlin/WordPress-Plugin-Boilerplate)
3. a [WordPress Widget Boilerplate](https://github.com/tommcfarlin/WordPress-Plugin-Boilerplate)


Get stared with WordPressBP
---------------------------

Getting started includes the following steps:

1. Check requirements
2. Clone WordPressBP locally on your development environment
3. Run the setup script
4. Code


### Requirements

As already mentioned, this project is meant to be used with [Compass](http://compass-style.org) an
extension to the [SASS](http://sass-lang.com) CSS pre-processor. For that you will need to install Ruby
preferrably from [RVM](http://rvm.io) and the Compass gem `gem install compass`.

Since I'm only using Linux the bash setup script might break elsewhere. If it does and you feel like
fixing it, I'll gladly accept patches.

The setup script also requires Git. If you're cloning WordPressBP, then that won't be a problem. But if
you've downloaded [WordPressBP](https://github.com/andrejcremoznik/WordPressBP) directly from Github,
then the setup script is useless for you. By no means is WordPressBP useless that way but you will have
to do some manual copying and editing of files.

Ideally you will have a linux based development environment set up in a virtual machine - a devbox.


### Clone WordPressBP and apply it to your project by runing the provided setup script

*WARNING: setup.sh is a bash script. Before runing 3rd party bash scripts ALWAYS check the code to see
what it does. I won't be responsible if it scares your cat!* That being said, the script from WordPressBP
does the following:

- Exports files from `WordPressBP` repo to your "project path"
- Replaces `WordPressBP` with your provided "namespace" in all filenames (renames files)
- Replaces `WordPressBP` inside all files with your provided "namespace"

By doing so all references to "WordPressBP" will be gone giving you a fresh starting base.


#### Setup.sh

```
$ ./setup.sh
Usage:
 ./setup.sh <namespace> <project_path>

 <namespace>:    Alphanumeric name for your project. Used for namespacing functions, textdomains etc.
 <project_path>: Path to where the plugins and themes directories will be set up.
```

A typical command would be:

```
./setup.sh myproject /var/www/myproject/repo/
```

This would copy the folders `themes` and `plugins` to `/var/www/myproject/repo/` and
do the operations listed above on them and their contents.

Please see Tips below for a recommended WP installation structure.


### Notes about the code

WordPressBP gives you a `themes` and a `plugins` directory.

#### Themes directory contents

```
myproject─┬─font           # a folder for custom fonts
          ├─img            # folder for images
          ├─js             # folder for theme specific javascript
          ├─lang           # folder for theme localization files
          ├─lib            # folder for 3rd party addons (e.g. jQuery plugins)
          ├─sass           # a modular structure of Sass styles for highly organized and maintainable code
          ├─404.php        # wordpress theme file
          ├─config.rb      # compass configuration file
          ├─footer.php     # wordpress theme file
          ├─functions.php  # a well commented collection of essential theme functionality - review carefully
          ├─header.php     # wordpress theme file
          ├─index.php      # wordpress theme file
          ├─readme.md      # notes about using compass and localization
          ├─screenshot.png # a 300*225px screenshot of the theme you're developing
          └─sidebar.php    # wordpress theme file
```

Before you can enable your new theme you will at least have to generate the `style.css`. Because it's built
from Sass sources, it shouldn't be part of the repository. To build it, review `sass/style.scss`, fill in
the information in the header (theme name, description, author and such) and run `compass compile` from the
`themes/myproject` directory — where the `config.rb` file is.

Read the `readme.md` inside `themes/myproject` for details.

The second most important file after the stylesheet is the `functions.php`. It's been carefully written
with usefulness and WordPress standards in mind. Review it and familiarize yourself with the functionality
it provides. If you're unsure why something is done in a certain way, look at the
[WordPress Codex](http://codex.wordpress.org/). Try to follow set patterns and adhere to WordPress
standards to ensure maintainable and high quality code.


#### Plugins directory contents

```
enable-maintenance   # a plugin that will display an "In maintenance" message to non-admins when enabled
myproject-extensions─┬─lang                           # folder for plugin localization files
                     ├─class-myproject-extensions.php # a class for theme's extra functionality
                     ├─index.php                      # for security reasons
                     └─myproject-extensions.php       # main plugin file that loads the class on activation
```

Why the `myproject-extensions` you might ask yourself. Because sometimes something doesn't belong into the
theme's `functions.php` file. For example custom post types, custom taxonomies, main query modifications,
basically everything that would break access to content in the Dashboard if your theme were disabled.

If you're not going to use such functionality, you can safely remove one or both provided plugins.

By default the `myproject-extensions` doesn't provide any functionality. If you look at the code, however,
you will see the basic structure set up by WordPress standards and commented sample code for creating
post types, taxonomies and modifying the main query. That's probably 90% of everything you'll ever need in
a WordPress project.

*If you're going to develop custom plugins or widgets, look at the boilerplate projects by
[Tom McFarlin](https://github.com/tommcfarlin).*

* [WordPress Plugin Boilerplate](https://github.com/tommcfarlin/WordPress-Plugin-Boilerplate)
* [WordPress Widget Boilerplate](https://github.com/tommcfarlin/WordPress-Plugin-Boilerplate)



Tips
----

### WP installation on a VPS/devbox

Using [Nginx](http://wiki.nginx.org/Main) my preffered way to structure files is like this:

```
/srv/http/project─┬─backup
                  ├─code─┬─plugins─┬─myplugin1
                  │      │         └─myplugin2
                  │      └─themes─┬─mytheme1
                  │               └─mytheme2
                  ├─etc───nginx.conf
                  ├─log─┬─access.log
                  │     └─error.log
                  ├─repo───project─┬─plugins─┬─myplugin1
                  │                │         └─myplugin2
                  │                └─themes─┬─mytheme1
                  │                         └─mytheme2
                  └─webdir─┬─wp-content─┬─plugins─┬─myplugin1*
                           │            │         ├─myplugin2*
                           │            │         ├─otherplugin
                           │            │         └─<...>
                           │            ├─themes─┬─mytheme1*
                           │            │        ├─mytheme2*
                           │            │        ├─othertheme
                           └─<...>      │        └─<...>
                                        └─<...>
```

`etc` and `log` directories are for Nginx vhost and log files. I like to keep them inside the project's
directory because of better discoverability on a multisite host. For a sample Nginx configuration you
can view my [conf repository](https://github.com/andrejcremoznik/conf).

The `code` directory is holding a static copy of the project's Git repository. Custom themes and plugins
are symlinked from there into the WordPress `wp-content/plugins` and `wp-content/themes` directories.

`repo` is a directory holding a bare repository for our code. A Git post-receive hook is set up to
create a static copy in `code` after every push to this repository. The repository set up in `repo` is
defined as a remote we can push to. For an explanation read *Using Git for deployment* below.

`webdir` is the web root and holds all the WordPress core files.

`backup` is used for, well, backups.

Paths marked with an asterisk are symlinks. `/srv/http/project/webdir/wp-content/themes/mytheme1` is a
symlink to `/srv/http/project/code/themes/mytheme1`.


### Using Git for deployment

Assuming your master branch is always production ready (by using a development model like
[GitFlow](http://nvie.com/posts/a-successful-git-branching-model/)) you can use the
following approach to deploy your code:

*On production server:*

Create a bare git repository

```
[/srv/http/project]$ mkdir repo/myproject
[/srv/http/project]$ cd repo/myproject
[/srv/http/project/repo/myproject]$ git init --bare
```

Set up a post-receive hook to copy the code to the `code` directory and run Compass after every push

```
[/srv/http/project/repo/myproject]$ nano hooks/post-receive

#--- start post-receive hook
#!/bin/sh
BASE_DIR='/srv/http/project/code'
THEME_DIR='/srv/http/myproject/code/themes/mytheme1'

git archive --format=tar master | tar -xf -C $BASE_DIR
cd $THEME_DIR
compass compile -e production --force
#--- end post receive hook

[/srv/http/project/repo/myproject]$ chmod +x hooks/post-receive
[/srv/http/project/repo/myproject]$ mkdir /srv/http/project/code
```

*On development environment:*

Add a new Git remote

```
[/srv/http/project/repo/myproject]$ git remote add production user@remotehost:/srv/http/project/repo/myproject
```

To deploy am update simply push to this new remote

```
[/srv/http/project/repo/myproject]$ git push production master
```

*On production server:*

Create symlinks from the contents of `code` to appropriate locations inside `webdir`.

```
[/srv/http/project]$ ln -s code/themes/mytheme1 webdir/wp-content/themes/mytheme1
[/srv/http/project]$ ln -s code/plugins/myplugin1 webdir/wp-content/plugins/myplugin1
[/srv/http/project]$ ln -s code/plugins/myplugin2 webdir/wp-content/plugins/myplugin2
```

*IMPORTANT: The post-receive hook runs Compass to compile CSS. Make sure Compass is installed on the remote.*


Attribution
===========

WordPressBP comes with [Normalize.css by Nicolas Gallagher](https://github.com/necolas/normalize.css)
(license included) and [HTML5 Shiv](https://github.com/aFarkas/html5shiv).

All this wouldn't be possible without the excellent [WordPress CMS](http://wordpress.org) and the Free
and Libre Open Source Software.


License
=======

WordPressBP is [Public Domain](http://en.wikipedia.org/wiki/Public_domain) except for the third party
code distributed with it (currently: normalize.css) which keeps the original license.
