/*! WordPressBP | MIT License | https://keybase.io/andrejcremoznik */

/**
 * Babel transpilation is configured with Rollup
 * so you can use the latest and greatest ES2015+
 */

// Execute code based on a body class
// - create function expressions named after class names (with `default` as an always execute special case)
const onDomReady = {
  default: () => {
    console.log('Run on every page')
  },
  /**
   * Body class based runners
   */
  'blog': () => {
    console.log('Run on blog index')
  }
}

const onWindowLoad = {
  default: () => {
    console.log('Run after window load event')
  }
}

document.addEventListener('DOMContentLoaded', () => {
  onDomReady.default()
  Object.keys(onDomReady)
    .filter(key => key !== 'default')
    .forEach(key => {
      if (document.body.classList.contains(key)) {
        onDomReady[key]()
      }
    })
})

window.addEventListener('load', () => {
  onWindowLoad.default()
})
