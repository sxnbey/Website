// let video;

// if (document.addEventListener) {
//   document.addEventListener("DOMContentLoaded", function () {
//     loaded();

//     video = document
//       .getElementById("video")
//       .getAttribute("src")
//       .split("/")[2]
//       .split(".")[0];

//     video = video.toUpperCase().split("");

//     video.forEach((v) => {
//       titleText.push(`${titleText[titleText.length - 1]}${v}`);
//       titleText.push(`${titleText[titleText.length - 1]} `);
//     });
//   });
// } else if (document.attachEvent) {
//   document.attachEvent("onreadystatechange", function () {
//     loaded();

//     video = document
//       .getElementById("video")
//       .getAttribute("src")
//       .split("/")[2]
//       .split(".")[0];

//     video = video.toUpperCase().split("");

//     video.forEach((v) => {
//       titleText.push(`${titleText[titleText.length - 1]}${v}`);
//       titleText.push(`${titleText[titleText.length - 1]} `);
//     });
//   });
// }

// function loaded() {
//   setInterval(loop, 300);
// }

// var x = 0;

// var titleText = [
//   "",
//   "S",
//   "S ",
//   "S E",
//   "S E ",
//   "S E N",
//   "S E N ",
//   "S E N B",
//   "S E N B ",
//   "S E N B E",
//   "S E N B E ",
//   "S E N B E Y",
//   "S E N B E Y ",
//   "S E N B E Y .",
//   "S E N B E Y . ",
//   "S E N B E Y . N",
//   "S E N B E Y . N ",
//   "S E N B E Y . N E",
//   "S E N B E Y . N E ",
//   "S E N B E Y . N E T",
//   "S E N B E Y . N E T ",
//   "S E N B E Y . N E T -",
//   "S E N B E Y . N E T - ",
// ];

// function loop() {
//   document.getElementsByTagName("title")[0].innerHTML = `${
//     titleText[x++ % titleText.length]
//   }|`;
// }
