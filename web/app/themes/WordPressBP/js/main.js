/*! WordPressBP | MIT License | https://keybase.io/andrejcremoznik */

/**
 * Babel transpilation is configured with Rollup
 * so you can use the latest and greates ES2015+
 */

import $ from 'jquery'

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

$(() => {
  Object
    .keys(runners)
    .filter(key => key !== 'default')
    .forEach(key => {
      if (document.body.classList.contains(key)) {
        runners[key]()
      }
    })
  runners.default()
})
