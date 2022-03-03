const videos = [
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
  "hollywood-dreaming",
  "switch-up",
  "live-forever",
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
  "luxus-leben",
  "vorsichtig",
  "bankaccount",
  "grad-mal-ein-jahr",
];
let video = newVideoF();
let usedVideos = [];
let url = window.location.search.substring(1).toLowerCase();

// VIDEO MANAGER //

document.addEventListener("DOMContentLoaded", function () {
  const contextMenu = document.getElementById("contextMenu");
  const videoE = document.getElementById("video");
  const mute = document.getElementById("mute");
  const h1 = document.getElementById("h1");
  const settingsContent = document.getElementById("settingsContent");

  // for the context menu //

  document.body.oncontextmenu = function (event) {
    contextMenu.style = `display: block; --mouse-x: ${
      event.clientX - 30
    }px; --mouse-y: ${event.clientY - 30}px;`;

    return false;
  };

  document.body.onclick = function (event) {
    if (
      !["contextMenuA", "contextMenu"].some((i) => event.target.id.includes(i))
    )
      contextMenu.style.display = "none";
  };

  // for the volume function //

  videoE.volume = 0.3;

  mute.title = `Current volume: ${Math.round(videoE.volume * 100) / 10}/10`;
  mute.addEventListener("wheel", function (e) {
    volume(e);
  });

  // video manager stuff //

  videoE.onerror = function () {
    playVideo(true, video);
  };

  if (videos.includes(url)) {
    videoE.setAttribute("src", `${pathGen()}/media/${url}.mp4`);
    usedVideos.push(url);
  } else playVideo(false, video, true);

  let x = 0;
  let titleText = titleTextGen();

  if (document.getElementById("h1"))
    h1.setAttribute(
      "title",
      `Current video: "${
        videoE.getAttribute("src").split("/")[2].split(".")[0]
      }"`
    );

  requestAnimationFrame(loop);

  // for the repeat video function //

  if (url == videoE.getAttribute("src").split("/")[2].split(".")[0])
    settingsContent.innerHTML = settingsContent.innerHTML.replace(
      "Repeat",
      "Unrepeat"
    );

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
    let titleVideo = videoE
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

  async function loop() {
    if (titleTextGen().toString() != titleText.toString()) {
      titleText = titleTextGen();
      x = 0;

      if (h1)
        h1.setAttribute(
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

    await wait(300);

    requestAnimationFrame(loop);
  }

  // events //

  document.getElementById("video").onended = function () {
    const videoE = document.getElementById("video");

    if (url != videoE.getAttribute("src").split("/")[2].split(".")[0])
      playVideo(false, video);
    else {
      videoE.currentTime = 0;
      videoE.play();
    }
  };
});

// some other functions that need to be global //

function playVideo(err = false, video, pageLoad = false) {
  const videoE = document.getElementById("video");
  const paused = document.getElementById("paused");
  const settingsContent = document.getElementById("settingsContent");

  if (
    (usedVideos.includes(video) && usedVideos.length != videos.length) ||
    err
  ) {
    video = newVideoF();

    playVideo(false, video);
  } else {
    if (usedVideos.length >= videos.length) usedVideos = [];

    videoE.setAttribute("src", `${pathGen()}/media/${video}.mp4`);
    videoE.play();

    if (!pageLoad)
      popup(
        `Now playing: "${
          videoE.getAttribute("src").split("/")[2].split(".")[0]
        }"`
      );

    videoE.className = "";

    paused.className = "";

    settingsContent.innerHTML = settingsContent.innerHTML.replace(
      "Unpause",
      "Pause"
    );

    settingsContent.innerHTML = settingsContent.innerHTML.replace(
      "Unrepeat",
      "Repeat"
    );

    url = "";

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
  const videoE = document.getElementById("video");
  const mute = document.getElementById("mute");

  if (Math.round(videoE.volume * 100) / 100 < 1) {
    videoE.volume = videoE.volume + 0.1;

    mute.title = `Current volume: ${Math.round(videoE.volume * 100) / 10}/10`;
  } else popup("The volume is on maximum.");
}

function volumeDown() {
  const videoE = document.getElementById("video");
  const mute = document.getElementById("mute");

  if (Math.round(videoE.volume * 100) / 100 > 0.1) {
    videoE.volume = videoE.volume - 0.1;

    mute.title = `Current volume: ${Math.round(videoE.volume * 100) / 10}/10`;
  } else popup("The volume is on minimum.");
}

// REPEAT VIDEO FUNCTION //

function repeatVideo() {
  const videoE = document.getElementById("video");
  const settingsContent = document.getElementById("settingsContent");

  if (url == videoE.getAttribute("src").split("/")[2].split(".")[0]) {
    url = "";

    settingsContent.innerHTML = settingsContent.innerHTML.replace(
      "Unrepeat",
      "Repeat"
    );

    popup("The video is now unrepeated.");
  } else {
    url = videoE.getAttribute("src").split("/")[2].split(".")[0];

    settingsContent.innerHTML = settingsContent.innerHTML.replace(
      "Repeat",
      "Unrepeat"
    );

    popup("The video is now repeated.");
  }
}

// RESTART VIDEO FUNCTION //

function restartVideo() {
  const videoE = document.getElementById("video");

  videoE.currentTime = 0;
  videoE.play();
}

// VIDEO MAPPER //

function map(playWS = false) {
  if (playWS)
    document.write(
      videos
        .map(
          (video) =>
            `<a id="contextMenuA" onclick="playWS(\`${video}\`)">${video}</a>`
        )
        .join("<br />")
    );
  else
    document.write(
      `All ${videos.length} videos: ${videos
        .map(
          (video) =>
            `<a href="https://${location.host}?${video}" id="decorationA">${video}</a>`
        )
        .join(", ")}`
    );
}

// PAUSE VIDEO FUNCTION //

function pauseVideo() {
  const videoE = document.getElementById("video");
  const paused = document.getElementById("paused");
  const settingsContent = document.getElementById("settingsContent");

  if (videoE.paused) {
    videoE.className = "";
    videoE.play();

    paused.className = "";

    settingsContent.innerHTML = settingsContent.innerHTML.replace(
      "Unpause",
      "Pause"
    );
  } else {
    videoE.className = "blurred";
    videoE.pause();

    paused.className = "visible";

    settingsContent.innerHTML = settingsContent.innerHTML.replace(
      "Pause",
      "Unpause"
    );
  }
}

// MUTER FUNCTION //

function muter() {
  const videoE = document.getElementById("video");
  const mute = document.getElementById("mute");

  if (videoE.muted) {
    videoE.muted = false;
    mute.setAttribute("src", `${pathGen()}/img/unmuted.svg`);
  } else {
    videoE.muted = true;
    mute.setAttribute("src", `${pathGen()}/img/muted.svg`);
  }
}

// WAIT FUNCTION //

function wait(ms) {
  return new Promise((res) => setTimeout(() => res(true), ms));
}

// POPUP FUNCTION //

let popupQueue = [];
let lastPopup;

async function popup(text, copy = false) {
  const popupE = document.getElementById("popup");

  if (!popupE) return;

  if (
    popupE.className == " visible" ||
    popupE.className == "main visible" ||
    (popupE.className == "" && popupE.innerHTML != "") ||
    (popupE.className == "main" && popupE.innerHTML != "")
  )
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
  popupE.className += " visible";

  await wait(2000);

  popupE.className = popupE.className.replace(" visible", "");

  await wait(500);

  popupE.innerHTML = "";

  if (popupQueue.length > 0) {
    popupE.innerHTML = "any text, so no other popup can be triggered";

    let queuePopup = popupQueue.shift();

    while (
      (popupQueue.length > 0 &&
        popupQueue[0].text.startsWith("Now playing: ")) ||
      (popupQueue.length > 0 && popupQueue[0].text == queuePopup.text)
    )
      queuePopup = popupQueue.shift();

    await wait(500);

    popupE.innerHTML = "";

    return popup(queuePopup.text, queuePopup.copy);
  }
}

// PATH FUNCTION //

function pathGen() {
  return document.getElementById("main") ? "." : "..";
}

// CONTEXT MENU FUNCTIONS //

function playWS(video) {
  const videoE = document.getElementById("video");
  const paused = document.getElementById("paused");
  const settingsContent = document.getElementById("settingsContent");

  videoE.setAttribute("src", `${pathGen()}/media/${video}.mp4`);

  popup(
    `Now playing: "${videoE.getAttribute("src").split("/")[2].split(".")[0]}"`
  );

  videoE.className = "";

  paused.className = "";

  settingsContent.innerHTML = settingsContent.innerHTML.replace(
    "Unpause",
    "Pause"
  );

  settingsContent.innerHTML = settingsContent.innerHTML.replace(
    "Unrepeat",
    "Repeat"
  );

  url = "";

  if (!usedVideos.includes(video)) usedVideos.push(video);
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
      repeatVideo();
      break;

    case 83:
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
    case 85:
    case 70:
    case 114:
      return false;
  }
};
