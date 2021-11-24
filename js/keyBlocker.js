document.onkeydown = function (e) {
  switch (e.keyCode) {
    default:
      break;

    case 123:
    case 73:
    case 83:
    case 85:
    case 70:
      return false;
  }
};
