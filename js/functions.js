// VIDEO MANAGER FUNCTION //

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
];
let url = window.location.search.substring(1);

async function videoManager(mediaPath, map = false, newVideo = false) {
  let docVideo = document.getElementById("video");
  let video = newVideoF();

  if (newVideo) return playVideo();

  if (map)
    return document.write(
      `All ${videos.length} videos: ${videos
        .map(
          (video) =>
            `<a href="https://senbey.net?${video}" id="decorationA">${video}</a>`
        )
        .join(", ")}`
    );

  docVideo.onerror = function () {
    playVideo(true);
  };

  if (videos.includes(url)) {
    docVideo.setAttribute("src", `${mediaPath}/media/${url.toLowerCase()}.mp4`);
    usedVideos.push(url);
  } else playVideo();

  // title shit //

  await new Promise((res) => setTimeout(() => res(true), 300));

  let x = 0;
  let titleText = titleTextGen();

  if (document.getElementById("h1"))
    document
      .getElementById("h1")
      .setAttribute(
        "title",
        `Current video: "${
          docVideo.getAttribute("src").split("/")[2].split(".")[0]
        }"`
      );

  setInterval(loop, 300);

  // functions //

  function playVideo(err = false) {
    if (
      (usedVideos.includes(video) && usedVideos.length != videos.length) ||
      err
    ) {
      video = newVideoF();
      playVideo();
    } else {
      if (usedVideos.length == videos.length) usedVideos = [];

      docVideo.setAttribute("src", `${mediaPath}/media/${video}.mp4`);
      docVideo.play();

      usedVideos.push(video);
    }
  }

  function newVideoF() {
    return videos[Math.floor(Math.random() * videos.length)];
  }

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
    let titleVideo = docVideo
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
              docVideo.getAttribute("src").split("/")[2].split(".")[0]
            }"`
          );
    }

    document.getElementsByTagName("title")[0].innerHTML = `${
      titleText[x++ % titleText.length]
    }|`;
  }

  // events //

  docVideo.onended = function () {
    if (url != docVideo.getAttribute("src").split("/")[2].split(".")[0])
      playVideo();
    else {
      docVideo.currentTime = 0;
      docVideo.play();
    }
  };
}

// VOLUME MANAGER //

document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("mute").addEventListener("wheel", function (e) {
    volume(e);
  });
});

function volume(e) {
  if (e.deltaY > 0) {
    if (Math.round(document.getElementById("video").volume * 100) / 100 > 0.1)
      document.getElementById("video").volume =
        document.getElementById("video").volume - 0.1;
  } else {
    if (Math.round(document.getElementById("video").volume * 100) / 100 < 1)
      document.getElementById("video").volume =
        document.getElementById("video").volume + 0.1;
  }
}

// REPLAY VIDEO FUNCTION //

function restartVideo() {
  document.getElementById("video").currentTime = 0;
}

// PAUSE VIDEO FUNCTION //

function pauseVideo() {
  if (document.getElementById("video").paused) {
    document.getElementById("video").play();

    document.getElementById("settingsContent").innerHTML = document
      .getElementById("settingsContent")
      .innerHTML.replace("Unpause", "Pause");
  } else {
    document.getElementById("video").pause();

    document.getElementById("settingsContent").innerHTML = document
      .getElementById("settingsContent")
      .innerHTML.replace("Pause", "Unpause");
  }
}

// MUTE MANAGER FUNCTION //

function muteManager(path) {
  let muted = true;

  document.getElementById("mute").addEventListener("click", function () {
    muter();
  });

  // function //

  function muter() {
    if (muted) {
      muted = false;
      document.getElementById("video").muted = false;
      document.getElementById("video").volume = 0.3;
      document
        .getElementById("mute")
        .setAttribute("src", `${path}/img/unmuted.svg`);
    } else {
      muted = true;
      document.getElementById("video").muted = true;
      document
        .getElementById("mute")
        .setAttribute("src", `${path}/img/muted.svg`);
    }
  }
}

// COPY TEXT FUNCTION //

async function copyURL() {
  let popup = document.getElementById("popup");
  let text = `https://senbey.net?${
    document
      .getElementById(`video`)
      .getAttribute(`src`)
      .split(`/`)[2]
      .split(`.`)[0]
  }`;

  navigator.clipboard.writeText(text).then(() => {
    popup.innerHTML = `"${text}" was copied to your clipboard!`;
  });

  popup.className = "visible";

  await new Promise((res) => setTimeout(() => res(true), 5500));

  popup.className = "";
}

// KEY BLOCKER EVENT //

document.onkeydown = function (e) {
  switch (e.keyCode) {
    default:
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
