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
let repeat = false;
let video = newVideoF();
let urlBoo = false;
let url = window.location.search.substring(1).toLowerCase().split("&");

document.addEventListener("DOMContentLoaded", function () {
  history.pushState(null, null, location.href.split("?")[0]);

  const contextMenu = document.getElementById("contextMenu");
  const videoE = document.getElementById("video");
  const mute = document.getElementById("mute");
  const h1 = document.getElementById("h1");

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

  let checkArr = url.filter((i) => i.startsWith("p="));
  checkArr.shift();
  checkArr.forEach((i) => url.splice(url.indexOf(i), 1));

  videoE.addEventListener("play", function () {
    if (urlBoo == "paused") {
      pauseVideo();

      urlBoo = true;
    }
  });

  url.forEach((i) => {
    i = i.split("=");

    if (url[url.length - 1] != "u=true" || url.length <= 1) return;

    switch (i[0]) {
      default:
        break;

      case "p":
        if (url.some((i) => i == "s=true")) urlBoo = "paused";

        playVideo(
          !i[1] || !videos.find((vid) => vid.path == i[1]) ? video : i[1],
          false,
          true
        );
        break;

      case "m":
        if (i[1] == "false") muter();
        break;

      case "v":
        videoE.volume = i[1];

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

      case "u":
        if (urlBoo != "paused") urlBoo = true;
        break;
    }
  });

  /************************************************************************************************\
  *                                        VIDEO MANAGER                                           *
  \************************************************************************************************/

  if (!urlBoo) playVideo(video, false, true);

  requestAnimationFrame(loop);

  videoE.onerror = function () {
    playVideo(true, video);
  };

  videoE.onended = function () {
    if (!repeat) playVideo(video);
    else restartVideo();
  };

  /************************************************************************************************\
  *                               TITLE STUFF (thank you malte <3)                                 *
  \************************************************************************************************/

  let index = 0;
  let revIndex = -1;

  async function loop(oldTitle = "") {
    if (h1)
      h1.setAttribute(
        "title",
        `Current video: "${video.name}" by ${video.artists.join(", ")}`
      );

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

function playVideo(vid, err = false, pageLoad = false, menu = false) {
  const videoE = document.getElementById("video");
  const paused = document.getElementById("paused");
  const settingsContent = document.getElementById("settingsContent");
  const contextMenu = document.getElementById("contextMenu");

  if (typeof vid == "string") vid = videos.find((i) => i.path == vid);

  video = vid;

  if (
    (usedVideos.includes(vid) && usedVideos.length != videos.length && !menu) ||
    err
  ) {
    video = newVideoF();

    playVideo(video);
  } else {
    contextMenu.innerHTML = map(true);

    if (usedVideos.length >= videos.length) usedVideos = [];

    videoE.src = `${pathGen()}/media/${vid.path}.mp4`;
    videoE.play();

    if (!pageLoad)
      popup(`Now playing: "${vid.name}" by ${vid.artists.join(", ")}`);

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

    if (!pageload) popup("The video is now unrepeated.");
  } else {
    settingsContent.innerHTML = settingsContent.innerHTML.replace(
      "Repeat",
      "Unrepeat"
    );

    repeat = true;

    if (!pageload) popup("The video is now repeated.");
  }
}

/************************************************************************************************\
*                                     RESTART VIDEO FUNCTION                                     *
\************************************************************************************************/

function restartVideo() {
  const videoE = document.getElementById("video");

  videoE.className = "";

  paused.className = "";

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
      "<p>Choose a song:</p>" +
      videos
        .filter((i) => i != video)
        .map(
          (vid) =>
            `<a onclick="playVideo('${vid.path}', false, false, true)" class="contextMenuA">"${vid.name}" by ${vid.artists[0]}</a>`
        )
        .join("<br />")
    );
  else
    document.write(
      `All ${videos.length} videos: ${videos
        .map(
          (vid) =>
            `"<a onclick="redirect('../', '${
              vid.path
            }', false, false)" class="decorationA disclaimer">${
              vid.name
            }</a>" by ${vid.artists.join(", ")}`
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

/************************************************************************************************\
*                                         MUTE FUNCTION                                          *
\************************************************************************************************/

function muter() {
  const videoE = document.getElementById("video");
  const mute = document.getElementById("mute");

  if (videoE.muted) {
    videoE.muted = false;
    mute.src = `${pathGen()}/img/unmuted.svg`;
  } else {
    videoE.muted = true;
    mute.src = `${pathGen()}/img/muted.svg`;
  }
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

  if (!popupE) return;

  if (popupVisible) {
    if (text.startsWith("Now playing: "))
      popupQueue = popupQueue.filter(
        ({ text: ftext }) => !ftext.startsWith("Now playing: ")
      );

    if (
      ![lastPopup, ...popupQueue.map((i) => i.text)].includes(
        copy ? `"${text}" has been copied to your clipboard!` : text
      )
    )
      popupQueue.push({ text, copy });
    return;
  }

  if (copy) {
    try {
      await navigator.clipboard.writeText(text);

      text = `"${text}" has been copied to your clipboard!`;
    } catch (e) {
      text = "The text could not be copied, the page was not focused.";
    }
  }

  lastPopup = text;

  popupVisible = true;

  popupE.innerHTML = text;
  popupE.className += " visible";

  await wait(2000);

  popupE.className = popupE.className.replace(" visible", "");

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

function redirect(url, videoPath = false, currentTime = true, repeated = true) {
  const videoE = document.getElementById("video");

  window.location.href =
    url +
    `?p=${videoPath ? videoPath : video.path}&m=${
      !!!window.chrome ? "true" : videoE.muted
    }&v=${Math.round(videoE.volume * 100) / 100}&c=${
      currentTime ? videoE.currentTime : 0
    }&s=${videoE.paused}&r=${repeated ? repeat : false}&u=true`;
}

/************************************************************************************************\
*                                           KEY EVENT                                            *
\************************************************************************************************/

document.onkeydown = function (e) {
  switch (e.keyCode) {
    default:
      break;

    case 78:
      playVideo(video);
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
