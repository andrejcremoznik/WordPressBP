http_path    = "/wp-content/themes/WordPressBP/" # path from root of domain to CSS folder with ending /

project_path = "themes/WordPressBP"      # path to asset sources relative to this config
sass_dir     = "css"    # project_path/sass_dir

images_dir   = "assets" # project_path/images_dir
fonts_dir    = "assets" # project_path/fonts_dir
css_dir      = "assets" # project_path/css_dir

relative_assets = false

preferred_syntax = :scss

sass_options = { :debug_info => true }

output_style = (environment == :production) ? :compressed : :expanded
