/*! WordPressBP | MIT License | https://keybase.io/andrejcremoznik */

/**
 * Babel transpilation is configured with Rollup
 * so you can use the latest and greatest ES2015+
 */

// Run on DOM ready
const runners = {
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

// Run on window load
const lazyRunners = {
  default: () => {
    console.log('Run after window load event')
  }
}

document.addEventListener('DOMContentLoaded', () => {
  runners.default()
  Object.keys(runners)
    .filter(key => key !== 'default')
    .forEach(key => {
      if (document.body.classList.contains(key)) {
        runners[key]()
      }
    })
})

window.addEventListener('load', () => {
  lazyRunners.default()
})
