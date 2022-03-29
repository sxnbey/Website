/************************************************************************************************\
*                                          DECLARATION                                           *
\************************************************************************************************/

const videos = [
  { path: "keep-my-coo", name: "Keep My Coo", artists: ["Lil Peep"] },
  { path: "live-forever", name: "Live Forever", artists: ["Lil Peep"] },
  { path: "runaway", name: "Runaway", artists: ["Lil Peep"] },
  { path: "gym-class", name: "Gym Class", artists: ["Lil Peep"] },
  { path: "benz-truck", name: "Benz Truck", artists: ["Lil Peep"] },
  { path: "16-lines", name: "16 Lines", artists: ["Lil Peep"] },
  { path: "the-brightside", name: "The Brightside", artists: ["Lil Peep"] },
  { path: "girls", name: "Girls", artists: ["Lil Peep", "Horsehead"] },
  {
    path: "hollywood-dreaming",
    name: "Hollywood Dreaming",
    artists: ["Lil Peep", "Gab3"],
  },
  { path: "backseat", name: "Backseat", artists: ["Lil Peep", "Lil Tracy"] },
  {
    path: "white-wine",
    name: "White Wine",
    artists: ["Lil Peep", "Lil Tracy"],
  },
  { path: "white-tee", name: "White Tee", artists: ["Lil Peep", "Lil Tracy"] },
  { path: "cobain", name: "Cobain", artists: ["Lil Peep", "Lil Tracy"] },
  {
    path: "witchblades",
    name: "Witchblades",
    artists: ["Lil Peep", "Lil Tracy"],
  },
  {
    path: "awful-things",
    name: "Awful Things",
    artists: ["Lil Peep", "Lil Tracy"],
  },
  { path: "beamer-boy", name: "beamer boy", artists: ["Lil Peep", "Nedarb"] },
  { path: "lil-kennedy", name: "lil kennedy", artists: ["Lil Peep", "Nedarb"] },
  {
    path: "california-world",
    name: "california world",
    artists: ["Lil Peep", "Nedarb", "Craig Xen"],
  },
  { path: "antarctica", name: "Antarctica", artists: ["$uicideboy$"] },
  { path: "2nd-hand", name: "2nd Hand", artists: ["$uicideboy$"] },
  { path: "o-pana", name: "O Pana!", artists: ["$uicideboy$"] },
  { path: "face-it", name: "Face It", artists: ["$uicideboy$"] },
  {
    path: "rag-round-my-skull",
    name: "Rag Round My Skull",
    artists: ["$uicideboy$"],
  },
  {
    path: "for-the-last-time",
    name: "For the Last Time",
    artists: ["$uicideboy$"],
  },
  { path: "oxycodon", name: "Oxycodon", artists: ["T-Low"] },
  { path: "curly-fries", name: "Curly Fries", artists: ["T-Low"] },
  { path: "crashen", name: "Crashen", artists: ["T-Low"] },
  { path: "luxus-leben", name: "Luxus Leben", artists: ["T-Low"] },
  { path: "changed", name: "Changed", artists: ["T-Low"] },
  { path: "bankaccount", name: "BANKACCOUNT", artists: ["T-Low"] },
  {
    path: "vorsichtig",
    name: "Vorsichtig",
    artists: ["T-Low", "Sevi Rin", "Heinie Nüchtern"],
  },
  {
    path: "sehnsucht",
    name: "Sehnsucht",
    artists: ["T-Low", "Miksu / Macloud"],
  },
  { path: "grad-mal-ein-jahr", name: "Grad mal ein Jahr", artists: ["makko"] },
];
let usedVideos = [];
let previousVideo;
let repeat = false;
let video = newVideoF();
let url = window.location.search.substring(1).toLowerCase().split("&");

document.addEventListener("DOMContentLoaded", function () {
  history.pushState(null, null, location.href.split("?")[0]);

  const contextMenu = document.getElementById("contextMenu");
  const videoE = document.getElementById("video");
  const mute = document.getElementById("mute");

  /************************************************************************************************\
  *                                CONTEXT MENU AND VOLUME STUFF                                   *
  \************************************************************************************************/

  document.body.oncontextmenu = function (e) {
    contextMenu.style = `display: block; --mouse-x: ${
      e.clientX - 30
    }px; --mouse-y: ${e.clientY - 30}px;`;

    return false;
  };

  document.body.addEventListener("click", function (e) {
    if (e.target.id != "contextMenu" && e.target.className != "contextMenuA")
      contextMenu.style.display = "none";
  });

  videoE.volume = 0.3;

  mute.title = `Current volume: ${Math.round(videoE.volume * 100) / 10}/10`;
  mute.addEventListener("wheel", function (e) {
    volume(e);
  });

  /************************************************************************************************\
  *                                        URL CHECK STUFF                                         *
  \************************************************************************************************/

  let urlBoo = false;

  videoE.addEventListener("play", function () {
    if (urlBoo == "paused") {
      pauseVideo();

      urlBoo = true;
    }
  });

  ["p=", "m=", "v=", "c=", "r=", "u="].forEach((i) => urlCheck(i));

  url.forEach((i) => {
    i = i.split("=");

    if (!url.toString().includes("p=")) return;

    switch (i[0]) {
      default:
        break;

      case "p":
        if (url.some((i) => i == "s=true")) urlBoo = "paused";

        if (urlBoo != "paused") urlBoo = true;

        playVideo(
          !i[1] || !videos.find(({ path }) => path == i[1]) ? video : i[1],
          false,
          true
        );
        break;

      case "m":
        if (i[1] == "false") muter();
        break;

      case "v":
        if (i[1] && i[1] >= 0.1 && i[1] <= 1) videoE.volume = i[1];

        mute.title = `Current volume: ${
          Math.round(videoE.volume * 100) / 10
        }/10`;
        break;

      case "c":
        videoE.currentTime = i[1];
        break;

      case "r":
        if (i[1] == "true") repeatVideo(true);
        break;
    }
  });

  function urlCheck(param) {
    let checkArr = url.filter((i) => i.startsWith(param));
    checkArr.shift();
    checkArr.forEach((i) => url.splice(url.indexOf(i), 1));
  }

  /************************************************************************************************\
  *                                        VIDEO MANAGER                                           *
  \************************************************************************************************/

  if (!urlBoo) playVideo(video, false, true);

  requestAnimationFrame(loop);

  videoE.onerror = function () {
    playVideo(true, video);
  };

  videoE.addEventListener("ended", function () {
    if (!repeat) playVideo(video);
    else restartVideo();
  });

  /************************************************************************************************\
  *                               TITLE STUFF (thank you malte <3)                                 *
  \************************************************************************************************/

  let index = 0;
  let revIndex = -1;

  async function loop(oldTitle = "") {
    let title = video.name
      .toUpperCase()
      .replaceAll(" ", "⠀")
      .split("")
      .join(" ");

    index++;

    if (title != oldTitle || index > title.length * 2 + 1) {
      index = 0;
      revIndex = -1;
    }

    document.title = `${title.slice(
      0,
      index > title.length + 1 ? revIndex-- : index
    )}|`;

    await wait(index > title.length + 1 ? 100 : 300);

    requestAnimationFrame(() => loop(title));
  }
});

/************************************************************************************************\
*                                    VIDEO MANAGER FUNCTIONS                                     *
\************************************************************************************************/

function playPreviousVideo() {
  if (previousVideo) playVideo(previousVideo, false, false, true);
  else popup("⚠ | There is no previous video.");
}

function playVideo(vid, err = false, pageLoad = false, ignoreIfUsed = false) {
  const videoE = document.getElementById("video");
  const paused = document.getElementById("paused");
  const settingsContent = document.getElementById("settingsContent");
  const contextMenu = document.getElementById("contextMenu");
  const h1 = document.getElementById("h1");

  if (typeof vid == "string") vid = videos.find(({ path }) => path == vid);

  video = vid;

  if (videoE.src)
    previousVideo = videoE.getAttribute("src").split("/")[2].split(".")[0];

  if (
    (usedVideos.includes(vid) &&
      usedVideos.length != videos.length &&
      !ignoreIfUsed) ||
    err
  ) {
    video = newVideoF();

    playVideo(video);
  } else {
    contextMenu.innerHTML = map(true);

    if (usedVideos.length >= videos.length) usedVideos = [];

    videoE.src = `${pathGen()}/media/${vid.path}.mp4`;
    videoE.play();

    if (h1)
      h1.title = `Current video: "${vid.name}" by ${vid.artists.join(", ")}`;

    if (!pageLoad)
      popup(`▶ | Now playing: "${vid.name}" by ${vid.artists.join(", ")}`);

    videoE.className = "";

    paused.className = paused.className.replace(" visible", "");

    settingsContent.innerHTML = settingsContent.innerHTML.replace(
      "Unpause",
      "Pause"
    );

    settingsContent.innerHTML = settingsContent.innerHTML.replace(
      "Unrepeat",
      "Repeat"
    );

    if (!usedVideos.includes(video)) usedVideos.push(video);
  }
}

function newVideoF() {
  return videos[Math.floor(Math.random() * videos.length)];
}

/************************************************************************************************\
*                                        VOlUME FUNCTIONS                                        *
\************************************************************************************************/

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
  } else popup("⚠ | The volume is on maximum.");
}

function volumeDown() {
  const videoE = document.getElementById("video");
  const mute = document.getElementById("mute");

  if (Math.round(videoE.volume * 100) / 100 > 0.1) {
    videoE.volume = videoE.volume - 0.1;

    mute.title = `Current volume: ${Math.round(videoE.volume * 100) / 10}/10`;
  } else popup("⚠ | The volume is on minimum.");
}

/************************************************************************************************\
*                                     REPEAT VIDEO FUNCTION                                      *
\************************************************************************************************/

function repeatVideo(pageload = false) {
  const settingsContent = document.getElementById("settingsContent");

  if (repeat) {
    settingsContent.innerHTML = settingsContent.innerHTML.replace(
      "Unrepeat",
      "Repeat"
    );

    repeat = false;

    if (!pageload) popup("⟳ | The video is now unrepeated.");
  } else {
    settingsContent.innerHTML = settingsContent.innerHTML.replace(
      "Repeat",
      "Unrepeat"
    );

    repeat = true;

    if (!pageload) popup("⟳ | The video is now repeated.");
  }
}

/************************************************************************************************\
*                                     RESTART VIDEO FUNCTION                                     *
\************************************************************************************************/

function restartVideo() {
  const videoE = document.getElementById("video");

  videoE.className = "";

  paused.className = paused.className.replace(" visible", "");

  settingsContent.innerHTML = settingsContent.innerHTML.replace(
    "Unpause",
    "Pause"
  );

  videoE.currentTime = 0;
  videoE.play();
}

/************************************************************************************************\
*                                         VIDEO MAPPER                                           *
\************************************************************************************************/

function map(contextMenu = false) {
  if (contextMenu)
    return (
      "<p>Choose a video:</p>" +
      videos
        .filter((i) => i != video)
        .map(
          ({ path, name, artists }) =>
            `<a onclick="playVideo('${path}', false, false, true)" class="contextMenuA">"${name}" by ${artists[0]}</a>`
        )
        .join("<br />")
    );
  else
    document.write(
      `All ${videos.length} videos: ${videos
        .map(
          ({ path, name, artists }) =>
            `"<a onclick="redirect('../', '${path}', false, false, '0')" class="decorationA disclaimer">${name}</a>" by ${artists.join(
              ", "
            )}`
        )
        .join("; ")}`
    );
}

/************************************************************************************************\
*                                      PAUSE VIDEO FUNCTION                                      *
\************************************************************************************************/

async function pauseVideo() {
  const videoE = document.getElementById("video");
  const paused = document.getElementById("paused");
  const settingsContent = document.getElementById("settingsContent");

  if (videoE.paused) {
    videoE.className = "";
    videoE.play();

    paused.className = paused.className.replace(" visible", "");

    settingsContent.innerHTML = settingsContent.innerHTML.replace(
      "Unpause",
      "Pause"
    );
  } else {
    videoE.className = "blurred";
    videoE.pause();

    paused.className += " visible";

    settingsContent.innerHTML = settingsContent.innerHTML.replace(
      "Pause",
      "Unpause"
    );
  }
}

/************************************************************************************************\
*                                         MUTE FUNCTION                                          *
\************************************************************************************************/

function muter() {
  const videoE = document.getElementById("video");
  const mute = document.getElementById("mute");

  videoE.muted = !videoE.muted;

  mute.src = `${pathGen()}/img/${videoE.muted ? "muted" : "unmuted"}.svg`;
}

/************************************************************************************************\
*                                         WAIT FUNCTION                                          *
\************************************************************************************************/

function wait(ms) {
  return new Promise((res) => setTimeout(() => res(true), ms));
}

/************************************************************************************************\
*                                        POPUP FUNCTION                                          *
\************************************************************************************************/

let popupQueue = [];
let lastPopup;
let popupVisible = false;

async function popup(text, copy = false) {
  const popupE = document.getElementById("popup");
  const textE = document.getElementById("text");

  if (!popupE) return;

  if (popupVisible) {
    if (text.startsWith("▶ | Now playing: "))
      popupQueue = popupQueue.filter(
        ({ text: ftext }) => !ftext.startsWith("▶ | Now playing: ")
      );

    if (
      ![lastPopup, ...popupQueue.map(({ text }) => text)].includes(
        copy ? `✓ | "${text}" has been copied to your clipboard!` : text
      )
    )
      popupQueue.push({ text, copy });
    return;
  }

  if (copy) {
    try {
      await navigator.clipboard.writeText(text);

      text = `✓ | "${text}" has been copied to your clipboard!`;
    } catch (e) {
      text = "⚠ | The text could not be copied, the page was not focused.";
    }
  }

  lastPopup = text;

  popupVisible = true;

  if (popupE.className.includes("muchText")) textE.className += " blurred";

  popupE.innerHTML = text;
  popupE.className += " visible";

  await wait(2000);

  popupE.className = popupE.className.replace(" visible", "");

  if (popupE.className.includes("muchText"))
    textE.className = textE.className.replace(" blurred", "");

  await wait(1000);

  if (popupQueue.length > 0) {
    let queuePopup = popupQueue.shift();

    popupVisible = false;

    popup(queuePopup.text, queuePopup.copy);
  } else popupVisible = false;
}

/************************************************************************************************\
*                                         PATH FUNCTION                                          *
\************************************************************************************************/

function pathGen() {
  return document.getElementById("main") ? "." : "..";
}

/************************************************************************************************\
*                                       REDIRECT FUNCTION                                        *
\************************************************************************************************/

function redirect(
  url,
  customPath = false,
  customMute = false,
  customVolume = false,
  customTime = false,
  customPause = false,
  customRepeat = false
) {
  const videoE = document.getElementById("video");

  window.location.href =
    url +
    `?p=${customPath ? customPath : video.path}&m=${
      !!!window.chrome ? "true" : customMute ? customMute : videoE.muted
    }&v=${
      customVolume ? customVolume : Math.round(videoE.volume * 100) / 100
    }&c=${customTime ? customTime : videoE.currentTime}&s=${
      customPause ? customPause : videoE.paused
    }&r=${customRepeat ? customRepeat : repeat}`;
}

/************************************************************************************************\
*                                       5S SKIP FUNCTIONS                                        *
\************************************************************************************************/

function fiveSecBack() {
  const videoE = document.getElementById("video");

  videoE.currentTime -= 5;

  popup("⤌ | 5 seconds were rewound.");
}

function fiveSecForward() {
  const videoE = document.getElementById("video");

  videoE.currentTime += 5;

  popup("⤍ | 5 seconds were fast forwarded.");
}

/************************************************************************************************\
*                                           KEY EVENT                                            *
\************************************************************************************************/

document.addEventListener("keydown", function (e) {
  if (!["KeyR", "F5"].some((i) => i == e.code)) e.preventDefault();

  switch (e.code) {
    default:
      break;

    case "KeyN":
      playVideo(video);
      break;

    case "KeyR":
      repeatVideo();
      break;

    case "KeyS":
      restartVideo();
      break;

    case "KeyM":
      muter();
      break;

    case "KeyP":
      playPreviousVideo();
      break;

    case "Space":
      pauseVideo();
      break;

    case "ArrowUp":
      volumeUp();
      break;

    case "ArrowDown":
      volumeDown();
      break;

    case "ArrowLeft":
      fiveSecBack();
      break;

    case "ArrowRight":
      fiveSecForward();
      break;
  }
});
