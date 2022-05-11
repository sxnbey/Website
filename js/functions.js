/************************************************************************************************\
*                                          DECLARATION                                           *
\************************************************************************************************/

const url = location.search.substring(1).toLowerCase().split("&");
let bufferCount = 0;
let usedVideos = [];
let previousVideo;
let repeat = false;
let video = newVideoF();
let vVolume = 0.3;

history.pushState(null, null, location.href.split("?")[0]);

document.addEventListener("DOMContentLoaded", function () {
  const contextMenu = document.getElementById("contextMenu");
  const videoE = document.getElementById("video");
  const mute = document.getElementById("mute");
  const settingsSVG = document.getElementById("settingsSVG");
  const settings = document.getElementById("settings");
  const h1 = document.getElementById("h1");
  const a = Array.from(document.getElementsByTagName("a")).filter((i) =>
    i.classList.contains("animate")
  );

  /************************************************************************************************\
  *                                       iOS CHECK STUFF                                          *
  \************************************************************************************************/

  if (
    [
      "iPad Simulator",
      "iPhone Simulator",
      "iPod Simulator",
      "iPad",
      "iPhone",
      "iPod",
    ].includes(navigator.platform) ||
    (navigator.userAgent.includes("Mac") && "ontouchend" in document)
  )
    popup(
      "It seems that you are using an iOS device. This website is not optimized for iOS devices as I am not able to test the site on them.",
      false,
      false,
      5000
    );

  /************************************************************************************************\
  *                                        404 PAGE STUFF                                          *
  \************************************************************************************************/

  if (document.getElementsByClassName("404")[0]) {
    let errorPath = location.href.replace(
      `${location.protocol}//${location.host}`,
      ""
    );

    document.getElementById("errorPath").innerHTML =
      errorPath == "/errors/404.html"
        ? ""
        : errorPath.length > 35
        ? errorPath.slice(0, 35) + "..."
        : errorPath;
  }

  /************************************************************************************************\
  *                                       BUFFERING STUFF                                          *
  \************************************************************************************************/

  videoE.addEventListener("waiting", async function () {
    if (videoE.networkState == 2 && videoE.currentTime > 0.2) bufferCount++;

    if (bufferCount >= 3) {
      bufferCount = 0;

      if (!videoE.paused) {
        pauseVideo();

        popup("⚠ | The video was paused for 10s due to connection problems.");

        await wait(10000);

        if (videoE.paused) pauseVideo();
      }
    }
  });

  /************************************************************************************************\
  *                                CONTEXT MENU AND VOLUME STUFF                                   *
  \************************************************************************************************/

  document.body.addEventListener("contextmenu", function (e) {
    contextMenu.style = `display: block; --mouse-x: ${
      e.clientX - 30
    }px; --mouse-y: ${e.clientY - 30}px;`;

    e.preventDefault();
  });

  document.body.addEventListener("click", function (e) {
    if (
      e.target.id != "contextMenu" &&
      !e.target.classList.contains("contextMenuA")
    )
      contextMenu.style.display = "none";
  });

  videoE.volume = vVolume;

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

  ["p=", "m=", "v=", "c=", "r="].forEach((i) => urlCheck(i));

  url.forEach((i) => {
    i = i.split("=");

    if (!url.toString().includes("p=")) return;

    switch (i[0]) {
      default:
        break;

      case "p":
        if (url.some((i) => i == "s=true")) urlBoo = "paused";

        if (urlBoo != "paused") urlBoo = true;

        if (cookieCheck() && !url.find((u) => u == "c=0"))
          playVideo(Cookies.get("path"), false, false);
        else
          playVideo(
            !videos.find(({ path }) => path == i[1]) ? video : i[1],
            false,
            false
          );
        break;

      case "m":
        if (i[1] == "false") muter();
        break;

      case "v":
        if (i[1] >= 0.1 && i[1] <= 1) vVolume = i[1];

        mute.title = `Current volume: ${i[1] * 10}/10`;
        break;

      case "c":
        if (cookieCheck() && i[1] != "0")
          videoE.currentTime = Cookies.get("currentTime");
        else videoE.currentTime = i[1];
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
  *                                          COOKIE STUFF                                          *
  \************************************************************************************************/
  if (typeof custom == "undefined") {
    if (!Cookies.get("cookiesAccepted"))
      popup(
        "This website uses cookies to improve your experience. If you don't agree, click the cross. <br /> <a id='cookieYES'><b>✓ I agree</b></a> <a id='cookieNO'><b>✗ I don't agree</b></a>",
        false,
        true
      );

    if (cookieCheck() && !urlBoo) {
      playVideo(Cookies.get("path"), false, false);

      videoE.currentTime = Cookies.get("currentTime");

      urlBoo = true;
    }

    videoE.addEventListener("timeupdate", function () {
      if (Cookies.get("cookiesAccepted") == "true") {
        Cookies.set("currentTime", videoE.currentTime, { expires: 365 });
        Cookies.set("path", video.path, { expires: 365 });
      }
    });
  }

  /************************************************************************************************\
  *                                        VIDEO MANAGER                                           *
  \************************************************************************************************/

  if (!urlBoo) playVideo(video, false, false);

  requestAnimationFrame(loop);

  videoE.addEventListener("error", function () {
    playVideo(video, true);
  });

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

  /************************************************************************************************\
  *                                EVERYTHING CSS/ANIMATION RELATED                                *
  \************************************************************************************************/

  [h1, ...a].forEach((i) => animation(i));

  function animation(el) {
    if (!el) return;

    el.addEventListener("mouseover", function (e) {
      el.classList.add(
        e.clientX - el.getBoundingClientRect().left >
          el.getBoundingClientRect().width / 2
          ? "right"
          : "left"
      );
    });

    el.addEventListener("mouseout", function () {
      el.classList.remove("right", "left");
    });
  }

  settingsSVG.addEventListener("mouseover", function () {
    settings.classList.add("hover");
    settingsSVG.classList.add("hover");
  });

  settingsSVG.addEventListener("mouseout", async function () {
    await wait(50);

    if (settings.matches(":hover") || settingsSVG.matches(":hover")) return;

    settings.classList.remove("hover");
    settingsSVG.classList.remove("hover");
  });

  settings.addEventListener("mouseout", async function () {
    await wait(50);

    if (settings.matches(":hover") || settingsSVG.matches(":hover")) return;

    settings.classList.remove("hover");
    settingsSVG.classList.remove("hover");
  });
});

/************************************************************************************************\
*                                          COOKIE STUFF                                          *
\************************************************************************************************/

function cookieYesF() {
  Cookies.set("cookiesAccepted", true, { expires: 365 });
}

function cookieNoF() {
  Cookies.set("cookiesAccepted", false, { expires: 365 });
  Cookies.remove("currentTime");
  Cookies.remove("path");
}

function cookieCheck() {
  return Cookies.get("cookiesAccepted") == "true" &&
    Cookies.get("currentTime") &&
    Cookies.get("path") &&
    typeof custom == "undefined"
    ? true
    : false;
}

/************************************************************************************************\
*                                    VIDEO MANAGER FUNCTIONS                                     *
\************************************************************************************************/

function playPreviousVideo() {
  if (previousVideo) playVideo(previousVideo, false, true, true);
  else popup("⚠ | There is no previous video.");
}

async function playVideo(
  vid = video,
  err = false,
  otherStuff = true,
  ignoreIfUsed = false
) {
  const videoE = document.getElementById("video");
  const paused = document.getElementById("paused");
  const settingsContent = document.getElementById("settingsContent");
  const contextMenu = document.getElementById("contextMenu");
  const h1 = document.getElementById("h1");

  if (typeof vid == "string") vid = videos.find(({ path }) => path == vid);

  video = vid;

  if (
    (usedVideos.includes(vid) &&
      usedVideos.length != videos.length &&
      !ignoreIfUsed) ||
    err
  ) {
    video = newVideoF();

    playVideo();
  } else {
    if (!otherStuff) {
      videoE.volume = 0;
      videoE.style.opacity = 0;
    }

    contextMenu.innerHTML = map(true);

    bufferCount = 0;

    if (usedVideos.length >= videos.length) usedVideos = [];

    if (otherStuff) previousVideo = videoE.src.split("/")[4].split(".")[0];

    $("#video").animate(
      {
        volume: 0,
        opacity: 0,
      },
      300
    );

    await wait(otherStuff ? 300 : 0);

    videoE.src = `${pathGen("media")}/${vid.path}.mp4`;
    videoE.play();

    $("#video").animate(
      {
        volume: vVolume,
        opacity: 1,
      },
      300
    );

    if (h1)
      h1.title = `Current video: "${vid.name}" by ${vid.artists.join(", ")}`;

    if (otherStuff)
      popup(`▶ | Now playing: "${vid.name}" by ${vid.artists.join(", ")}`);

    videoE.classList.remove("blurred");

    paused.classList.remove("visible");

    settingsContent.innerHTML = settingsContent.innerHTML.replace(
      "Unpause",
      "Pause"
    );

    settingsContent.innerHTML = settingsContent.innerHTML.replace(
      "Unrepeat",
      "Repeat"
    );

    repeat = false;

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

function repeatVideo(noPopup = false) {
  const settingsContent = document.getElementById("settingsContent");

  if (repeat) {
    settingsContent.innerHTML = settingsContent.innerHTML.replace(
      "Unrepeat",
      "Repeat"
    );

    repeat = false;

    if (!noPopup) popup("⟳ | The video is now unrepeated.");
  } else {
    settingsContent.innerHTML = settingsContent.innerHTML.replace(
      "Repeat",
      "Unrepeat"
    );

    repeat = true;

    if (!noPopup) popup("⟳ | The video is now repeated.");
  }
}

/************************************************************************************************\
*                                     RESTART VIDEO FUNCTION                                     *
\************************************************************************************************/

function restartVideo() {
  const videoE = document.getElementById("video");

  videoE.classList.remove("blurred");

  paused.classList.remove("visible");

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
      "<p class='contextMenuP'>Choose a video:</p><br />" +
      videos
        .filter((i) => i != video)
        .map(
          ({ path, name, artists }) =>
            `<a onclick="playVideo('${path}', false, true, true)" class="contextMenuA">"${name}" by ${artists[0]}</a>`
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
    videoE.classList.remove("blurred");
    videoE.play();

    paused.classList.remove("visible");

    settingsContent.innerHTML = settingsContent.innerHTML.replace(
      "Unpause",
      "Pause"
    );
  } else {
    videoE.classList.add("blurred");
    videoE.pause();

    paused.classList.add("visible");

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

  mute.src = `${pathGen("img")}/${videoE.muted ? "muted" : "unmuted"}.svg`;
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

async function popup(text, copy = false, cookiePopup = false, time = 2000) {
  const popupE = document.getElementById("popup");
  const textE = document.getElementById("text");

  if (popupVisible == "cookiePopup" || !popupE) return;

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
      popupQueue.push({ text, copy, cookiePopup, time });
    return;
  }

  if (cookiePopup) {
    popupE.innerHTML = text;

    const cookieYES = document.getElementById("cookieYES");
    const cookieNO = document.getElementById("cookieNO");

    popupVisible = "cookiePopup";

    if (popupE.classList.contains("muchText")) textE.classList.add("blurred");

    popupE.classList.add("visible");

    [cookieYES, cookieNO].forEach((i) =>
      i.addEventListener(
        "click",
        function () {
          if (i.id == "cookieYES") cookieYesF();
          else cookieNoF();

          popupE.classList.remove("visible");

          if (popupE.classList.contains("muchText"))
            textE.classList.remove("blurred");

          popupVisible = false;
        },
        { once: true }
      )
    );
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

  if (popupE.classList.contains("muchText")) textE.classList.add("blurred");

  popupE.innerHTML = text;

  popupE.classList.add("visible");

  await wait(time);

  popupE.classList.remove("visible");

  if (popupE.classList.contains("muchText")) textE.classList.remove("blurred");

  await wait(1000);

  if (popupQueue.length > 0) {
    let queuePopup = popupQueue.shift();

    popupVisible = false;

    popup(
      queuePopup.text,
      queuePopup.copy,
      queuePopup.cookiePopup,
      queuePopup.time
    );
  } else popupVisible = false;
}

/************************************************************************************************\
*                                         PATH FUNCTION                                          *
\************************************************************************************************/

function pathGen(folder) {
  return document.getElementsByClassName("404")[0]
    ? `${location.protocol}//${location.host}/${folder}`
    : document.getElementById("main")
    ? typeof custom != "undefined"
      ? `../${folder}${folder == "media" ? "/custom" : ""}`
      : `./${folder}`
    : typeof custom != "undefined"
    ? `../../${folder}${folder == "media" ? "/custom" : ""}`
    : `../${folder}`;
}

/************************************************************************************************\
*                                       REDIRECT FUNCTION                                        *
\************************************************************************************************/

// if a custom thing is false, put it in a string //

async function redirect(
  url,
  customPath = false,
  customMute = false,
  customVolume = false,
  customTime = false,
  customPause = false,
  customRepeat = false
) {
  const videoE = document.getElementById("video");
  const textE = document.getElementById("text");
  const vVolume = videoE.volume;

  if (textE) textE.classList.add("fadeout");

  $("#video").animate(
    {
      volume: 0,
      opacity: 0,
    },
    300
  );

  await wait(300);

  location.href =
    url +
    `?p=${customPath || video.path}&m=${
      !!!window.chrome ? "true" : customMute || videoE.muted
    }&v=${customVolume || Math.round(vVolume * 100) / 100}&c=${
      customTime || videoE.currentTime
    }&s=${customPause || videoE.paused}&r=${customRepeat || repeat}`;
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
      playVideo();
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

//  $$$$$$\  $$$$$$$$\ $$\   $$\ $$$$$$$\  $$$$$$$$\ $$\     $$\
// $$  __$$\ $$  _____|$$$\  $$ |$$  __$$\ $$  _____|\$$\   $$  |
// $$ /  \__|$$ |      $$$$\ $$ |$$ |  $$ |$$ |       \$$\ $$  /
// \$$$$$$\  $$$$$\    $$ $$\$$ |$$$$$$$\ |$$$$$\      \$$$$  /
//  \____$$\ $$  __|   $$ \$$$$ |$$  __$$\ $$  __|      \$$  /
// $$\   $$ |$$ |      $$ |\$$$ |$$ |  $$ |$$ |          $$ |
// \$$$$$$  |$$$$$$$$\ $$ | \$$ |$$$$$$$  |$$$$$$$$\     $$ |
//  \______/ \________|\__|  \__|\_______/ \________|    \__|
