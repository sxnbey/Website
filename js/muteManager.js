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
          "It seems like you have no sound, please activate audio autoplay for this site manually."
        );
        alerted = true;
      }
  }, 3500);
}
