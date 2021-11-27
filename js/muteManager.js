function muteManager(path) {
  let currentImg = "muted",
    alerted = false;

  function muter() {
    switch (currentImg) {
      default:
        break;

      case "muted":
        currentImg = "unmuted";
        document.getElementById("audio").volume = 0.3;
        break;

      case "unmuted":
        currentImg = "muted";
        document.getElementById("audio").volume = 0;
        break;
    }

    document
      .getElementById("mute")
      .setAttribute("src", `${path}/img/${currentImg}.svg`);
  }

  document.getElementById("mute").addEventListener("click", function (img) {
    muter();
  });

  setTimeout(function () {
    if (!alerted)
      if (document.getElementById("audio").paused) {
        alert(
          'It seems like you have no sound, please activate audio autoplay for this site manually.\nIf you don\'t know how to activate it, on some browsers it is enough to go to "Info" and then click on "Back to the website".'
        );
        alerted = true;
      }
  }, 3000);
}
