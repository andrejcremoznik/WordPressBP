/*! WordPressBP | MIT License | https://keybase.io/andrejcremoznik */

const onDomReady = {
  default: () => {
    console.log('Run on every page')
  },
  'blog': () => {
    console.log('Run if "<body>" contains class "blog".')
  }
}

const onWindowLoad = {
  default: () => {
    console.log('Run after window load event')
  }
}

// Bootstrap
const run = runners => {
  runners.default()
  Object.keys(runners)
    .filter(key => key !== 'default')
    .forEach(key => {
      if (document.body.classList.contains(key)) {
        runners[key]()
      }
    })
}

document.addEventListener('DOMContentLoaded', () => {
  run(onDomReady)
})

window.addEventListener('load', () => {
  run(onWindowLoad)
})
