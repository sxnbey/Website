/************************************************************************************************\
*                                          DECLARATION                                           *
\************************************************************************************************/

const videos = [
  { path: "beamer-boy", name: "beamer boy", artist: "Lil Peep, Nedarb" },
  { path: "lil-kennedy", name: "Lil Kennedy", artist: "Lil Peep, Nedarb" },
  { path: "keep-my-coo", name: "Keep My Coo", artist: "Lil Peep" },
  { path: "runaway", name: "Runaway", artist: "Lil Peep" },
  { path: "gym-class", name: "Gym Class", artist: "Lil Peep" },
  { path: "benz-truck", name: "Benz Truck", artist: "Lil Peep" },
  { path: "girls", name: "Girls", artist: "Lil Peep, Horsehead" },
  { path: "white-wine", name: "White Wine", artist: "Lil Peep, Lil Tracy" },
  { path: "white-tee", name: "White Tee", artist: "Lil Peep, Lil Tracy" },
  { path: "cobain", name: "Cobain", artist: "Lil Peep, Lil Tracy" },
  { path: "16-lines", name: "16 Lines", artist: "Lil Peep" },
  { path: "awful-things", name: "Awful Things", artist: "Lil Peep, Lil Tracy" },
  { path: "backseat", name: "Backseat", artist: "Lil Peep, Lil Tracy" },
  { path: "witchblades", name: "Witchblades", artist: "Lil Peep, Lil Tracy" },
  { path: "live-forever", name: "Live Forever", artist: "Lil Peep" },
  {
    path: "california-world",
    name: "california world",
    artist: "Lil Peep, Nedarb, Craig Xen",
  },
  {
    path: "hollywood-dreaming",
    name: "Hollywood Dreaming",
    artist: "Lil Peep, Gab3",
  },
  { path: "antarctica", name: "Antarctica", artist: "$uicideboy$" },
  { path: "2nd-hand", name: "2nd Hand", artist: "$uicideboy$" },
  { path: "o-pana", name: "O Pana!", artist: "$uicideboy$" },
  { path: "face-it", name: "Face It", artist: "$uicideboy$" },
  {
    path: "rag-round-my-skull",
    name: "Rag Round My Skull",
    artist: "$uicideboy$",
  },
  {
    path: "for-the-last-time",
    name: "For the Last Time",
    artist: "$uicideboy$",
  },
  { path: "oxycodon", name: "Oxycodon", artist: "T-Low" },
  { path: "curly-fries", name: "Curly Fries", artist: "T-Low" },
  { path: "crashen", name: "Crashen", artist: "T-Low" },
  { path: "luxus-leben", name: "Luxus Leben", artist: "T-Low" },
  {
    path: "vorsichtig",
    name: "Vorsichtig",
    artist: "T-Low, Sevi Rin, Heinie Nüchtern",
  },
  { path: "bankaccount", name: "BANKACCOUNT", artist: "T-Low" },
  { path: "sehnsucht", name: "Sehnsucht", artist: "T-Low, Miksu / Macloud" },
  { path: "changed", name: "Changed", artist: "T-Low" },
  { path: "grad-mal-ein-jahr", name: "Grad mal ein Jahr", artist: "Makko" },
];
let video = newVideoF();
let usedVideos = [];
let url = window.location.search.substring(1).toLowerCase();
url = videos.find((i) => i.path == url);

document.addEventListener("DOMContentLoaded", function () {
  const contextMenu = document.getElementById("contextMenu");
  const videoE = document.getElementById("video");
  const mute = document.getElementById("mute");
  const h1 = document.getElementById("h1");
  const settingsContent = document.getElementById("settingsContent");

  /************************************************************************************************\
  *                                CONTEXT MENU AND VOLUME STUFF                                   *
  \************************************************************************************************/

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

  videoE.volume = 0.3;

  mute.title = `Current volume: ${Math.round(videoE.volume * 100) / 10}/10`;
  mute.addEventListener("wheel", function (e) {
    volume(e);
  });

  /************************************************************************************************\
  *                                        VIDEO MANAGER                                           *
  \************************************************************************************************/

  videoE.onerror = function () {
    playVideo(true, video);
  };

  if (videos.includes(url)) {
    videoE.setAttribute("src", `${pathGen()}/media/${url.path}.mp4`);

    usedVideos.push(url);

    video = url;
  } else playVideo(false, video, true);

  requestAnimationFrame(loop);

  if (url == videoE.getAttribute("src").split("/")[2].split(".")[0])
    settingsContent.innerHTML = settingsContent.innerHTML.replace(
      "Repeat",
      "Unrepeat"
    );

  /************************************************************************************************\
  *                              TITLE STUFF (thank you stantac <3)                                *
  \************************************************************************************************/

  let index = 0;
  let length = 30;

  async function loop(oldTitle = "") {
    if (h1)
      h1.setAttribute(
        "title",
        `Current video: "${video.name}" by ${video.artist}`
      );

    let title = `senbey.net-${video.name}`
      .toUpperCase()
      .replaceAll(" ", "⠀")
      .split("")
      .join(" ");

    if (title != oldTitle || index > title.length + length) {
      index = 0;
    }

    index++;

    document.title = `${title.slice(
      index >= length ? index - length : 0,
      index
    )}${index % 2 ? "|" : ""}`;

    await wait(index > title.length ? 70 : 300);

    requestAnimationFrame(() => loop(title));
  }

  document.getElementById("video").onended = function () {
    const videoE = document.getElementById("video");

    if (url.path != videoE.getAttribute("src").split("/")[2].split(".")[0])
      playVideo(false, video);
    else {
      videoE.currentTime = 0;
      videoE.play();
    }
  };
});

/************************************************************************************************\
*                                    VIDEO MANAGER FUNCTIONS                                     *
\************************************************************************************************/

function playVideo(err = false, vid, pageLoad = false) {
  const videoE = document.getElementById("video");
  const paused = document.getElementById("paused");
  const settingsContent = document.getElementById("settingsContent");

  if ((usedVideos.includes(vid) && usedVideos.length != videos.length) || err) {
    video = newVideoF();

    playVideo(false, video);
  } else {
    if (usedVideos.length >= videos.length) usedVideos = [];

    videoE.setAttribute("src", `${pathGen()}/media/${vid.path}.mp4`);
    videoE.play();

    if (!pageLoad) popup(`Now playing: "${vid.name}" by ${vid.artist}`);

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

    usedVideos.push(vid);
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

/************************************************************************************************\
*                                     RESTART VIDEO FUNCTION                                     *
\************************************************************************************************/

function restartVideo() {
  const videoE = document.getElementById("video");

  videoE.currentTime = 0;
  videoE.play();
}

/************************************************************************************************\
*                                         VIDEO MAPPER                                           *
\************************************************************************************************/

function map(playWS = false) {
  if (playWS)
    document.write(
      videos
        .map(
          (video) =>
            `<a id="contextMenuA" onclick="playWS(\`${video.path}\`)">"${
              video.name
            }" by ${
              video.artist.length > 10
                ? video.artist.split(",")[0]
                : video.artist
            }</a>`
        )
        .join("<br />")
    );
  else
    document.write(
      `All ${videos.length} videos: ${videos
        .map(
          (video) =>
            `<a href="https://${location.host}?${video.path}" id="decorationA">${video.name}</a>`
        )
        .join(", ")}`
    );
}

/************************************************************************************************\
*                                      PAUSE VIDEO FUNCTION                                      *
\************************************************************************************************/

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

/************************************************************************************************\
*                                         MUTE FUNCTION                                          *
\************************************************************************************************/

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

/************************************************************************************************\
*                                         PATH FUNCTION                                          *
\************************************************************************************************/

function pathGen() {
  return document.getElementById("main") ? "." : "..";
}

/************************************************************************************************\
*                              PLAY FUNCTION FOR THE CONTEXT MENU                                *
\************************************************************************************************/

function playWS(vid) {
  const videoE = document.getElementById("video");
  const paused = document.getElementById("paused");
  const settingsContent = document.getElementById("settingsContent");

  videoE.setAttribute("src", `${pathGen()}/media/${vid}.mp4`);

  video = videos.find((i) => i.path == vid);

  popup(`Now playing: "${video.name}" by ${video.artist}`);

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

/************************************************************************************************\
*                                           KEY EVENT                                            *
\************************************************************************************************/

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
