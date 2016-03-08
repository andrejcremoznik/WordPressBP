module.exports = function (data, $el) {
  switch (data.action) {
    case 'exampleAction':
      window.alert('Click handler triggered!')
      break

    default:
      console.warn('Unrecognized action.')
  }
  return false
}
