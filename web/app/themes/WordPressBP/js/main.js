/*! WordPressBP | MIT License | https://keybase.io/andrejcremoznik */

/**
 * Babel transpilation is configured with Rollup
 * so you can use the latest and greatest ES2015+
 */

const runners = {
  default: function () {
    console.log('Run on every page')
  },
  /**
   * Body class based runners
   * - Add your own using the 'path-*' body class
   */
  'path-frontpage': function () {
    console.log('Run on frontpage')
  }
}

document.addEventListener('DOMContentLoaded', () => {
  Object.keys(runners)
    .filter(key => key !== 'default')
    .forEach(key => {
      if (document.body.classList.contains(key)) {
        runners[key]()
      }
    })
  runners.default()
})
