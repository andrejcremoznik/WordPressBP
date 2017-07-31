module.exports = function (action, data, $el) {
  switch (action) {
    case 'exampleAction':
      window.alert('Click handler triggered!')
      break

    default:
      console.warn('Unrecognized action.')
  }
  return false
}
