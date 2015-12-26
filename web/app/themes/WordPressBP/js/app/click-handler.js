var clickHandler = function(data, $el) {

  switch (data.action) {

    case 'triggerClickHandler':
      alert('Click handler triggered!');
      break;

    default:
      console.warn('Unrecognized action.');

  }

  return false;

}

module.exports = clickHandler;
