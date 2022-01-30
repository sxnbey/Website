function muteManager(path) {
  let currentImg = "muted";

  document.getElementById("mute").addEventListener("click", function () {
    muter();
  });

  // functions //

  function muter() {
    switch (currentImg) {
      default:
        break;

      case "muted":
        currentImg = "unmuted";
        document.getElementById("video").muted = false;
        document.getElementById("video").volume = 0.3;
        break;

      case "unmuted":
        currentImg = "muted";
        document.getElementById("video").muted = true;
        break;
    }

    document
      .getElementById("mute")
      .setAttribute("src", `${path}/img/${currentImg}.svg`);
  }
}

// function muteManager(path) {
//   let muted = true;

//   document.getElementById("mute").addEventListener("click", function () {
//     muter();
//   });

//   // functions //

//   function muter() {
//     if (muted) {
//       muted = false;
//       document.getElementById("video").muted = false;
//       document.getElementById("video").volume = 0.3;
//       document
//         .getElementById("mute")
//         .setAttribute("src", `${path}/img/unmuted.svg`);
//     } else {
//       muted = true;
//       document.getElementById("video").muted = true;
//       document
//         .getElementById("mute")
//         .setAttribute("src", `${path}/img/muted.svg`);
//     }
//   }
// }
