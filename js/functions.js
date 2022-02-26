let usedVideos = [];
let videos = [
  "beamer-boy",
  "your-favourite-dress",
  "come-around",
  "cocaine-shawty",
  "california-world",
  "mos",
  "keep-my-coo",
  "runaway",
  "gym-class",
  "benz-truck",
  "girls",
  "white-wine",
  "white-tee",
  "lil-kennedy",
  "cobain",
  "hellboy",
  "lil-jeep",
  "drugz",
  "crybaby",
  "belgium",
  "when-i-lie",
  "falling-down",
  "ive-been-waiting",
  "life-is-beautiful",
  "16-lines",
  "cry-alone",
  "4-gold-chains",
  "save-that-shit",
  "awful-things",
  "the-brightside",
  "backseat",
  "witchblades",
  "antarctica",
  "2nd-hand",
  "for-the-last-time",
  "o-pana",
  "magazine",
  "paris",
  "rag-round-my-skull",
  "i-miss-my-dead-friends",
  "fuckthepopulation",
  "face-it",
  "oxycodon",
  "curly-fries",
  "crashen",
];
let url = window.location.search.substring(1);
let video = newVideoF();

// VIDEO MANAGER //

document.addEventListener("DOMContentLoaded", function () {
  // just for the volume function //

  document.getElementById("video").volume = 0.3;

  document.getElementById("mute").title = `Current volume: ${
    Math.round(document.getElementById("video").volume * 100) / 10
  }/10`;
  document.getElementById("mute").addEventListener("wheel", function (e) {
    volume(e);
  });

  document.getElementById("video").onerror = function () {
    playVideo(true, video);
  };

  if (videos.includes(url)) {
    document
      .getElementById("video")
      .setAttribute("src", `${pathGen()}/media/${url.toLowerCase()}.mp4`);
    usedVideos.push(url);
  } else playVideo(false, video, true);

  let x = 0;
  let titleText = titleTextGen();

  if (document.getElementById("h1"))
    document
      .getElementById("h1")
      .setAttribute(
        "title",
        `Current video: "${
          document
            .getElementById("video")
            .getAttribute("src")
            .split("/")[2]
            .split(".")[0]
        }"`
      );

  setInterval(loop, 300);

  // functions for the video stuff //

  function titleTextGen() {
    let titleText = [
      "",
      "S",
      "S ",
      "S E",
      "S E ",
      "S E N",
      "S E N ",
      "S E N B",
      "S E N B ",
      "S E N B E",
      "S E N B E ",
      "S E N B E Y",
      "S E N B E Y ",
      "S E N B E Y .",
      "S E N B E Y . ",
      "S E N B E Y . N",
      "S E N B E Y . N ",
      "S E N B E Y . N E",
      "S E N B E Y . N E ",
      "S E N B E Y . N E T",
      "S E N B E Y . N E T ",
      "S E N B E Y . N E T -",
      "S E N B E Y . N E T - ",
    ];
    let titleVideo = document
      .getElementById("video")
      .getAttribute("src")
      .split("/")[2]
      .split(".")[0]
      .toUpperCase()
      .replaceAll("-", "⠀");

    titleVideo = titleVideo.split("");

    titleVideo.forEach((v) => {
      titleText.push(`${titleText[titleText.length - 1]}${v}`);
      titleText.push(`${titleText[titleText.length - 1]} `);
    });

    return titleText;
  }

  function loop() {
    if (titleTextGen().toString() != titleText.toString()) {
      titleText = titleTextGen();
      x = 0;

      if (document.getElementById("h1"))
        document
          .getElementById("h1")
          .setAttribute(
            "title",
            `Current video: "${
              document
                .getElementById("video")
                .getAttribute("src")
                .split("/")[2]
                .split(".")[0]
            }"`
          );
    }

    document.getElementsByTagName("title")[0].innerHTML = `${
      titleText[x++ % titleText.length]
    }|`;
  }

  // events //

  document.getElementById("video").onended = function () {
    if (
      url !=
      document
        .getElementById("video")
        .getAttribute("src")
        .split("/")[2]
        .split(".")[0]
    )
      playVideo(false, video);
    else {
      document.getElementById("video").currentTime = 0;
      document.getElementById("video").play();
    }
  };
});

// some other functions that need to be global //

function playVideo(err = false, video, pageLoad = false) {
  if (
    (usedVideos.includes(video) && usedVideos.length != videos.length) ||
    err
  ) {
    video = newVideoF();

    playVideo(false, video);
  } else {
    if (usedVideos.length == videos.length) usedVideos = [];

    document
      .getElementById("video")
      .setAttribute("src", `${pathGen()}/media/${video}.mp4`);
    document.getElementById("video").play();

    if (!pageLoad)
      popup(
        `Now playing: "${
          document
            .getElementById("video")
            .getAttribute("src")
            .split("/")[2]
            .split(".")[0]
        }"`
      );

    document.getElementById("video").className = "";

    document.getElementById("paused").className = "";

    usedVideos.push(video);
  }
}

function newVideoF() {
  return videos[Math.floor(Math.random() * videos.length)];
}

// VOLUME MANAGER //

function volume(e) {
  if (e.deltaY < 0) volumeUp();
  else volumeDown();
}

function volumeUp() {
  if (Math.round(document.getElementById("video").volume * 100) / 100 < 1) {
    document.getElementById("video").volume =
      document.getElementById("video").volume + 0.1;

    document.getElementById("mute").title = `Current volume: ${
      Math.round(document.getElementById("video").volume * 100) / 10
    }/10`;
  } else popup("The volume is on maximum.");
}

function volumeDown() {
  if (Math.round(document.getElementById("video").volume * 100) / 100 > 0.1) {
    document.getElementById("video").volume =
      document.getElementById("video").volume - 0.1;

    document.getElementById("mute").title = `Current volume: ${
      Math.round(document.getElementById("video").volume * 100) / 10
    }/10`;
  } else popup("The volume is on minimum.");
}

// RESTART VIDEO FUNCTION //

function restartVideo() {
  document.getElementById("video").currentTime = 0;
}

// VIDEO MAPPER //

function map() {
  document.write(
    `All ${videos.length} videos: ${videos
      .map(
        (video) =>
          `<a href="${location.host}?${video}" id="decorationA">${video}</a>`
      )
      .join(", ")}`
  );
}

// PAUSE VIDEO FUNCTION //

function pauseVideo() {
  if (document.getElementById("video").paused) {
    document.getElementById("video").className = "";
    document.getElementById("video").play();

    document.getElementById("paused").className = "";

    document.getElementById("settingsContent").innerHTML = document
      .getElementById("settingsContent")
      .innerHTML.replace("Unpause", "Pause");
  } else {
    document.getElementById("video").className = "blurred";
    document.getElementById("video").pause();

    document.getElementById("paused").className = "visible";

    document.getElementById("settingsContent").innerHTML = document
      .getElementById("settingsContent")
      .innerHTML.replace("Pause", "Unpause");
  }
}

// MUTER FUNCTION //

function muter() {
  if (document.getElementById("video").muted) {
    document.getElementById("video").muted = false;
    document
      .getElementById("mute")
      .setAttribute("src", `${pathGen()}/img/unmuted.svg`);
  } else {
    document.getElementById("video").muted = true;
    document
      .getElementById("mute")
      .setAttribute("src", `${pathGen()}/img/muted.svg`);
  }
}

// POPUP FUNCTION //

let popupQueue = [];
let lastPopup;

async function popup(text, copy = false) {
  let popupE = document.getElementById("popup");

  if (!popupE) return;

  if (popupE.className == "visible")
    if (
      lastPopup != text &&
      lastPopup != `"${text}" has been copied to your clipboard!`
    )
      return popupQueue.push({ text, copy });
    else return;

  if (copy) {
    try {
      await navigator.clipboard.writeText(text);

      text = `"${text}" has been copied to your clipboard!`;
    } catch (e) {
      text = "The text could not be copied, the page was not focused.";
    }
  }

  lastPopup = text;

  popupE.innerHTML = text;
  popupE.className = "visible";

  await new Promise((res) => setTimeout(() => res(true), 2000));

  popupE.className = "";

  await new Promise((res) => setTimeout(() => res(true), 500));

  popupE.innerHTML = "";

  if (popupQueue.length > 0) {
    let queuePopup = popupQueue.shift();

    while (popupQueue.length > 0 && popupQueue[0].text == queuePopup.text)
      queuePopup = popupQueue.shift();

    await new Promise((res) => setTimeout(() => res(true), 500));

    return popup(queuePopup.text, queuePopup.copy);
  }
}

// PATH FUNCTION //

function pathGen() {
  if (document.getElementById("main")) return ".";
  else return "..";
}

// KEY EVENT //

document.onkeydown = function (e) {
  switch (e.keyCode) {
    default:
      break;

    case 78:
      playVideo(false, video);
      break;

    case 82:
      restartVideo();
      break;

    case 32:
      pauseVideo();
      break;

    case 77:
      muter();
      break;

    case 38:
      volumeUp();
      break;

    case 40:
      volumeDown();
      break;

    case 123:
    case 73:
    case 83:
    case 85:
    case 70:
    case 114:
      return false;
  }
};
