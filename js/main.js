/************************************************************************************************\
*                                          DECLARATION                                           *
\************************************************************************************************/

// WEITER DIE VARIABLEN ZUORDNEN UND DANN ANFANGEN FUNCTIONS UMZUSCHREIBEN

const url = location.search.substring(1).toLowerCase().split("&");
let usedVideos = [];
let previousVideo;
let repeat = false;
let video = newVideoF();
let vVolume = 0.3;
let lastPercent;

history.pushState(null, null, location.href.split("?")[0]);

document.addEventListener("DOMContentLoaded", function () {
  const contextMenu = getEl("contextMenu");
  const videoE = getEl("video");
  const mute = getEl("mute");
  const settingsSVG = getEl("settingsSVG");
  const settings = getEl("settings");
  const h1 = getEl("h1");
  const a = Array.from(document.getElementsByTagName("a")).filter((i) =>
    i.classList.contains("animate")
  );

  /************************************************************************************************\
  *                                        404 PAGE STUFF                                          *
  \************************************************************************************************/

  if (document.getElementsByClassName("404")[0]) {
    getEl("errorPath").innerHTML =
      location.pathname == "/errors/404.html"
        ? ""
        : location.pathname.length > 35
        ? location.pathname.slice(0, 35) + "..."
        : location.pathname;
  }

  /************************************************************************************************\
  *                                       BUFFERING STUFF                                          *
  \************************************************************************************************/

  let bufferCount = 0;

  videoE.addEventListener("waiting", async function () {
    if (videoE.networkState == 2 && videoE.currentTime > 0.2) bufferCount++;

    if (bufferCount != 3) return;

    bufferCount = 0;

    if (!videoE.paused) return;

    pauseVideo();

    popup(
      "⚠ | The video was paused for 10s due to buffering.\nFYI: You can still unpause the video."
    );

    await wait(10000);

    if (videoE.paused) pauseVideo();
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
      ["contextMenuA", "contextMenuB"].every(
        (i) => !e.target.classList.contains(i)
      )
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
  let pausedBoo;

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
        if (url.some((i) => i == "s=true")) {
          urlBoo = "paused";

          pausedBoo = true;
        }

        if (urlBoo != "paused") urlBoo = true;

        playVideo(
          cookieCheck() && // just to make sure the cookies store a video and the current site is the main page
            url.toString().replace(/[^=]/g, "").length != 1 && // is to make sure that the video from the url gets played if the one attribute is a video
            !url.find((u) => u == "c=0") // is to make sure that the url is not from the disclaimer page
            ? Cookies.get("path") // is both true, the video from the cookie is played
            : !videos.find(({ path }) => path == i[1]) // if not, it checks if the video from the url is not in the videos array
            ? video // if true, if plays the default video
            : i[1], // if false, it plays the url video
          false,
          true
        );
        break;

      case "m":
        if (i[1] == "false" && url.toString().replace(/[^=]/g, "").length != 1)
          muter();
        break;

      case "v":
        if (i[1] >= 0.1 && i[1] <= 1) vVolume = i[1];

        mute.title = `Current volume: ${i[1] * 10}/10`;
        break;

      case "c":
        videoE.currentTime =
          cookieCheck() && i[1] != "0" ? Cookies.get("currentTime") : i[1];
        break;

      case "r":
        if (i[1] == "true") repeatVideo(true);
        break;
    }
  });

  function urlCheck(param) {
    const checkArr = url.filter((i) => i.startsWith(param));
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
        0,
        "cookie"
      );

    if (cookieCheck() && !urlBoo) {
      playVideo(Cookies.get("path"), false, true);

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
  *                                     STARTING THE VIDEO                                         *
  \************************************************************************************************/

  if (!urlBoo) playVideo(video, false, true);

  /************************************************************************************************\
  *                                      CALLING THE LOOP                                          *
  \************************************************************************************************/

  requestAnimationFrame(loop);

  /************************************************************************************************\
  *                                     ERROR AND END EVENT                                        *
  \************************************************************************************************/

  videoE.addEventListener("error", function () {
    playVideo(video, true);
  });

  videoE.addEventListener("ended", function () {
    if (!repeat) playVideo(video);
    else restartVideo();
  });

  /************************************************************************************************\
  *                                EVERYTHING CSS/ANIMATION RELATED                                *
  \************************************************************************************************/

  [h1, ...a].forEach((i) => animation(i));

  settingsSVG.addEventListener("mouseover", function () {
    settings.classList.add("hover");
    settingsSVG.classList.add("hover");
  });

  [settings, settingsSVG].forEach((el) =>
    el.addEventListener("mouseout", async function () {
      await wait(50);

      if (settings.matches(":hover") || settingsSVG.matches(":hover")) return;

      settings.classList.remove("hover");
      settingsSVG.classList.remove("hover");
    })
  );

  /************************************************************************************************\
  *                                         PROLLY USELESS                                         * 
  \************************************************************************************************/

  srcPause();
});

/************************************************************************************************\
*                                        COOKIE FUNCTIONS                                        *
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

function removeAllCookies() {
  Cookies.remove("cookiesAccepted");
  Cookies.remove("currentTime");
  Cookies.remove("path");

  popup("✓ | All cookies have been deleted.");
}

/************************************************************************************************\
*                                    VIDEO MANAGER FUNCTIONS                                     *
\************************************************************************************************/

function playPreviousVideo() {
  if (previousVideo) playVideo(previousVideo, false, false, true);
  else popup("⚠ | There is no previous video.");
}

async function playVideo(
  vid = video,
  err = false,
  pageLoad = false,
  ignoreIfUsed = false
) {
  const videoE = getEl("video");
  const paused = getEl("paused");
  const settingsContent = getEl("settingsContent");
  const contextMenu = getEl("contextMenu");
  const pauseA = getEl("pauseA");
  const repeatA = getEl("repeatA");
  const apple = navigator.vendor == "Apple Computer, Inc.";

  if (typeof vid == "string") vid = videos.find(({ path }) => path == vid);

  video = vid;

  if (pageLoad && apple) videoE.autoplay = false;

  if (
    (usedVideos.includes(vid) &&
      usedVideos.length != videos.length &&
      !ignoreIfUsed) ||
    err
  ) {
    video = newVideoF();

    playVideo();
  } else {
    if (pageLoad) {
      videoE.volume = 0;
      videoE.style.opacity = 0;
    }

    contextMenu.innerHTML = map(true);

    bufferCount = 0;

    if (usedVideos.length >= videos.length) usedVideos = [];

    if (!pageLoad) previousVideo = videoE.src.split("/")[4].split(".")[0];

    $("#video").animate(
      {
        volume: 0,
        opacity: 0,
      },
      300
    );

    await wait(!pageLoad ? 300 : 0);

    videoE.src = `${pathGen("media")}/${vid.path}.mp4`;

    if (!(pageLoad && apple)) videoE.play();
    else {
      videoE.classList.add("blurred");

      paused.classList.add("visible");

      settingsContent.innerHTML = settingsContent.innerHTML.replace(
        "Pause",
        "Unpause"
      );
    }

    $("#video").animate(
      {
        volume: vVolume,
        opacity: 1,
      },
      300
    );

    if (!pageLoad)
      popup(
        `▶ | Now playing: <b>${vid.name.replace(
          " ",
          "&nbsp;"
        )}</b> by ${vid.artists.join(", ").replace(" ", "&nbsp;")}`
      );

    if (!(pageLoad && apple)) {
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

      if (pauseA) pauseA.innerHTML = "▶️";

      if (repeatA) repeatA.className = "red";
    }

    repeat = false;

    if (!usedVideos.includes(video)) usedVideos.push(video);
  }
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

    case "KeyI":
      progressBar(true);
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

/************************************************************************************************\
  *                                       iOS CHECK STUFF                                          *
  \************************************************************************************************/

// if (
//   [
//     "iPad Simulator",
//     "iPhone Simulator",
//     "iPod Simulator",
//     "iPad",
//     "iPhone",
//     "iPod",
//   ].includes(navigator.platform) ||
//   (navigator.userAgent.includes("Mac") && "ontouchend" in document)
// )
//   popup(
//     "⚠ | It seems that you are using an iOS device. This website is not optimized for iOS devices as I am not able to test the site on them.",
//     5000
//   );
