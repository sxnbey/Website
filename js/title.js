if (document.addEventListener) {
  document.addEventListener("DOMContentLoaded", function () {
    loaded();
  });
} else if (document.attachEvent) {
  document.attachEvent("onreadystatechange", function () {
    loaded();
  });
}

function loaded() {
  setInterval(loop, 300);
}

var x = 0;

var titleText = [
  "|",
  "S|",
  "S |",
  "S E|",
  "S E |",
  "S E N|",
  "S E N |",
  "S E N B|",
  "S E N B |",
  "S E N B E|",
  "S E N B E |",
  "S E N B E Y|",
  "S E N B E Y |",
  "S E N B E Y .|",
  "S E N B E Y . |",
  "S E N B E Y . N|",
  "S E N B E Y . N |",
  "S E N B E Y . N E|",
  "S E N B E Y . N E |",
  "S E N B E Y . N E T|",
];

function loop() {
  document.getElementsByTagName("title")[0].innerHTML =
    titleText[x++ % titleText.length];
}
