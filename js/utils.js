function scrollAnimation(ID) {
  $("html, body").animate({ scrollTop: $(`#${ID}`).offset().top }, 800);
}

function copyText(text) {
  let snackbar = document.getElementById("snackbar");

  navigator.clipboard
    .writeText(text)
    .then(() => {
      snackbar.innerHTML = `<i class="far fa-clipboard"></i> | "${text}" in die Zwischenablage kopiert!`;
      snackbar.style["background-color"] = "#100c0c";
    })
    .catch((err) => {
      snackbar.innerHTML = `<i class="far fa-clipboard"></i> | Error while copying "${text}": ${err}`;
      snackbar.style["background-color"] = "red";
    });
  snackbar.className = "show";
  setTimeout(function () {
    snackbar.className = snackbar.className.replace("show", "");
  }, 3000);
}

/**
 * @param {Array} a
 */
function shuffle(a) {
  var j, x, i;
  for (i = a.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + 1));
    x = a[i];
    a[i] = a[j];
    a[j] = x;
  }
  return a;
}

document.addEventListener("DOMContentLoaded", () => {
  let i = 0;
  let a = 0;
  let isBackspacing = false;

  let textArray = shuffle([
    "Follow me on Twitter...",
    "Sub to me on YouTube...",
    "Add my Discord-bot...",
    "Sub to my OnlyFans (I don't have one yet)...",
    "Stantac is cute <3...",
    "Just look at my GitHub profile...",
  ]);

  let speedForward = 100;
  let speedWait = 1000;
  let speedBackspace = 25;

  typeWriter("output", textArray);

  function typeWriter(id, ar) {
    let element = $("#" + id),
      aString = ar[a],
      eHeader = element.children("h1");

    if (!isBackspacing) {
      if (i < aString.length) {
        eHeader.text(eHeader.text() + aString.charAt(i));

        i++;
        setTimeout(function () {
          typeWriter(id, ar);
        }, speedForward);
      } else if (i == aString.length) {
        isBackspacing = true;
        setTimeout(function () {
          typeWriter(id, ar);
        }, speedWait);
      }
    } else {
      if (eHeader.text().length > 0) {
        eHeader.text(eHeader.text().substring(0, eHeader.text().length - 1));

        setTimeout(function () {
          typeWriter(id, ar);
        }, speedBackspace);
      } else {
        isBackspacing = false;
        i = 0;
        a = (a + 1) % ar.length;
        setTimeout(function () {
          typeWriter(id, ar);
        }, 50);
      }
    }
  }
});
