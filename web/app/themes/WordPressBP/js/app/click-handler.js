var clickHandler = function (data, $el) {
  switch (data.action) {

    case 'triggerClickHandler':
      console.log('Click handler triggered!')
      break

    default:
      console.warn('Unrecognized action.')

  }

  return false
}

module.exports = clickHandler
