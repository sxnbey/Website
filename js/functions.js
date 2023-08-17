/************************************************************************************************\
*                               TITLE STUFF (thank you malte <3)                                 *
\************************************************************************************************/

let loopIndex = 0;
let loopRevIndex = -1;

async function loop(oldTitle = "") {
  let title = video.name.toUpperCase().replaceAll(" ", "⠀").split("").join(" ");

  loopIndex++;

  if (title != oldTitle || loopIndex > title.length * 2 + 1) {
    loopIndex = 0;
    loopRevIndex = -1;
  }

  document.title = `${title.slice(
    0,
    loopIndex > title.length + 1 ? loopRevIndex-- : loopIndex
  )}|`;

  await wait(loopIndex > title.length + 1 ? 100 : 300);

  requestAnimationFrame(() => loop(title));
}

/************************************************************************************************\
*                                         VIDEO FUNCTION                                         *
\************************************************************************************************/

function newVideoF() {
  return videos[Math.floor(Math.random() * videos.length)];
}

/************************************************************************************************\
  *                                EVERYTHING CSS/ANIMATION RELATED                                *
  \************************************************************************************************/

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

/************************************************************************************************\
*                                        VOlUME FUNCTIONS                                        *
\************************************************************************************************/

function volume(e) {
  if (e.deltaY < 0) volumeUp();
  else volumeDown();
}

function volumeUp() {
  const videoE = getEl("video");
  const mute = getEl("mute");
  const volumeSpan = getEl("volumeSpan");

  if (Math.round(videoE.volume * 100) / 100 < 1) {
    videoE.volume =
      Math.round((Math.round(videoE.volume * 10) / 10 + 0.1) * 10) / 10;

    vVolume = videoE.volume;

    mute.title = `Current volume: ${Math.round(videoE.volume * 100) / 10}/10`;
  } else popup("⚠ | The volume is on maximum.");

  if (volumeSpan) volumeSpan.innerHTML = progressBar("volume");
}

function volumeDown() {
  const videoE = getEl("video");
  const mute = getEl("mute");
  const volumeSpan = getEl("volumeSpan");

  if (Math.round(videoE.volume * 100) / 100 > 0.1) {
    videoE.volume =
      Math.round((Math.round(videoE.volume * 10) / 10 - 0.1) * 10) / 10;

    vVolume = videoE.volume;

    mute.title = `Current volume: ${Math.round(videoE.volume * 100) / 10}/10`;
  } else popup("⚠ | The volume is on minimum.");

  if (volumeSpan) volumeSpan.innerHTML = progressBar("volume");
}

/************************************************************************************************\
*                                     REPEAT VIDEO FUNCTION                                      *
\************************************************************************************************/

function repeatVideo(noPopup = false) {
  const settingsContent = getEl("settingsContent");
  const repeatA = getEl("repeatA");

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

  if (repeatA?.className == "green") repeatA.className = "red";
  else if (repeatA?.className == "red") repeatA.className = "green";
}

/************************************************************************************************\
*                                     RESTART VIDEO FUNCTION                                     *
\************************************************************************************************/

function restartVideo() {
  const videoE = getEl("video");
  const pauseA = getEl("pauseA");

  videoE.classList.remove("blurred");

  paused.classList.remove("visible");

  settingsContent.innerHTML = settingsContent.innerHTML.replace(
    "Unpause",
    "Pause"
  );

  if (pauseA) pauseA.innerHTML = "▶️";

  videoE.currentTime = 0;
  videoE.play();
}

/************************************************************************************************\
*                                         VIDEO MAPPER                                           *
\************************************************************************************************/

function map(contextMenu = false, page) {
  if (contextMenu)
    return (
      "<p class='contextMenuP'>Choose a video:</p><br />" +
      videos
        .filter((i) => i != video)
        .map(
          ({ path, name, artists }) =>
            `<a onclick="playVideo('${path}', false, false, true)" class="contextMenuA"><b class="contextMenuB">${name.replace(
              " ",
              "&nbsp;"
            )}</b> by ${artists[0].replace(" ", "&nbsp;")}</a>`
        )
        .join("<br />")
    );
  else
    document.write(
      `All ${videos.length} videos: ${videos
        .map(
          ({ path, name, artists }) =>
            `"<a onclick="redirect('../${
              typeof custom != "undefined" ? `../../custom/${page}` : ""
            }', '${path}', false, false, '0')" class="decorationA disclaimer">${name.replace(
              " ",
              "&nbsp;"
            )}</a>" by ${artists.join(", ").replace(" ", "&nbsp;")}`
        )
        .join("; ")}`
    );
}

/************************************************************************************************\
*                                      PAUSE VIDEO FUNCTION                                      *
\************************************************************************************************/

async function pauseVideo() {
  const videoE = getEl("video");
  const paused = getEl("paused");
  const settingsContent = getEl("settingsContent");
  const pauseA = getEl("pauseA");

  if (videoE.paused) {
    videoE.classList.remove("blurred");
    videoE.play();

    paused.classList.remove("visible");

    settingsContent.innerHTML = settingsContent.innerHTML.replace(
      "Unpause",
      "Pause"
    );

    if (pauseA) pauseA.innerHTML = "▶️";
  } else {
    videoE.classList.add("blurred");
    videoE.pause();

    paused.classList.add("visible");

    settingsContent.innerHTML = settingsContent.innerHTML.replace(
      "Pause",
      "Unpause"
    );

    if (pauseA) pauseA.innerHTML = "⏸️";
  }
}

/************************************************************************************************\
*                                         PROLLY USELESS                                         * 
\************************************************************************************************/

async function srcPause() {
  const paused = getEl("paused");

  if (!paused) await wait(300);

  paused.src = `${pathGen("img")}/paused.svg`;
}

/************************************************************************************************\
*                                         MUTE FUNCTION                                          *
\************************************************************************************************/

function muter() {
  const videoE = getEl("video");
  const mute = getEl("mute");
  const muteA = getEl("muteA");

  videoE.muted = !videoE.muted;

  mute.src = `${pathGen("img")}/${videoE.muted ? "muted" : "unmuted"}.svg`;

  if (muteA && videoE.muted) muteA.innerHTML = "🔇";
  else if (muteA) muteA.innerHTML = "🔊";
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
let popupTimer = 0;
let popupLastPercent;

async function popup(text, time = 2000, other = false) {
  const popupE = getEl("popup");
  const textE = getEl("text");

  if (other == "copy")
    text = `${location.protocol}//${location.host}${
      typeof folder != "undefined" ? `/${folder}` : ""
    }?p=${video.path}`;

  // queue check

  if (
    popupVisible == "cookiePopup" ||
    !popupE ||
    (popupVisible == "infoPopup" && other != "copy")
  )
    return;

  if (other == "copy" || (other == "info" && !popupE.innerHTML.includes("▰")))
    await popupOut(true, popupVisible ? true : false);
  else if (popupVisible) {
    if (text.startsWith("▶ |"))
      popupQueue = popupQueue.filter(
        ({ text: ftext }) => !ftext.startsWith("▶ |")
      );

    if (
      ![lastPopup, ...popupQueue.map(({ text }) => text)].includes(
        other == "copy"
          ? `✓ | "${text}" has been copied to your clipboard!`
          : text
      )
    )
      popupQueue.push({ text, time, other });

    return;
  }

  // cookie popup

  if (other == "cookie") {
    popupE.innerHTML = text;

    const cookieYES = getEl("cookieYES");
    const cookieNO = getEl("cookieNO");

    popupVisible = "cookiePopup";

    if (popupE.classList.contains("muchText")) textE.classList.add("blurred");

    popupE.classList.add("visible");

    [cookieYES, cookieNO].forEach((i) =>
      i.addEventListener(
        "click",
        function () {
          if (i.id == "cookieYES") cookieYesF();
          else cookieNoF();

          popupOut(true, false);
        },
        { once: true }
      )
    );

    return;
  }

  // copy popup

  if (other == "copy") {
    try {
      await navigator.clipboard.writeText(text);

      text = `✓ | "${text}" has been copied to your clipboard!`;
    } catch (e) {
      text = `⚠ | The text could not be copied. Error: ${e}`;
    }
  }

  // normal popup shit

  lastPopup = text;

  if (other == "info") popupVisible = "infoPopup";
  else popupVisible = true;

  if (popupE.classList.contains("muchText")) textE.classList.add("blurred");

  if (other == "info") popupE.innerHTML = progressBar("string");
  else popupE.innerHTML = text;

  popupE.classList.add("visible");

  // info popup

  if (other == "info") {
    popupTimer = 0;

    const interval = setInterval(async function () {
      const progressBarSpan = getEl("progressBarSpan");
      const artistsSpan = getEl("artistsSpan");
      const timeSpan = getEl("timeSpan");
      const percent = percentF();

      if (!progressBarSpan || !artistsSpan || !timeSpan)
        return clearInterval(interval);

      if (
        popupLastPercent != percent ||
        !artistsSpan?.innerHTML.split("b")[0] ==
          progressBar("artists").split("b")[0] ||
        !progressBarSpan?.innerHTML
      )
        progressBarSpan.innerHTML = progressBar();

      artistsSpan.innerHTML = progressBar("artists");

      timeSpan.innerHTML = progressBar("time");

      if (++popupTimer == 140) {
        await popupOut();

        clearInterval(interval);
      }
    }, 50);
  }

  await wait(time);

  if (other == "info" || popupE.innerHTML.includes("▰")) return;

  await popupOut(false);

  if (popupQueue.length > 0) {
    let queuePopup = popupQueue.shift();

    popupVisible = false;

    popup(queuePopup.text, queuePopup.time, queuePopup.other);
  } else popupVisible = false;
}

async function popupOut(booChange = true, waitt = true) {
  const popupE = getEl("popup");
  const textE = getEl("text");

  popupE.classList.remove("visible");

  if (popupE.classList.contains("muchText")) textE.classList.remove("blurred");

  if (waitt) await wait(500);

  if (booChange) popupVisible = false;
}

function progressBar(popupThing = false) {
  const videoE = getEl("video");
  const percent = percentF();
  popupLastPercent = percent;
  const mins = Math.floor(videoE.currentTime / 60) % 60 || 0;
  const secs = Math.floor(videoE.currentTime % 60) || 0;
  const fullMins = Math.floor(videoE.duration / 60) % 60 || 0;
  const fullSecs = Math.floor(videoE.duration % 60) || 0;

  if (popupThing == "string")
    return `<span id="artistsSpan">${progressBar(
      "artists"
    )}</span><span id="progressBarSpan" style="white-space: nowrap;">${progressBar()}</span> <span id="timeSpan">${progressBar(
      "time"
    )}</span><br /><span id="controlsSpan">${progressBar("controls")}</span>`;

  if (popupThing == "time")
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}&nbsp;/&nbsp;${fullMins
      .toString()
      .padStart(2, "0")}:${fullSecs.toString().padStart(2, "0")}`;

  if (popupThing == "artists")
    return `<b>${video.name.replace(" ", "&nbsp;")}</b> by ${video.artists
      .join(", ")
      .replace(" ", "&nbsp;")}<br />`;

  if (popupThing == "controls")
    return `<b><a title="Copy link" onclick="clickManager('popup')">🔗</a>&nbsp;|&nbsp;<a title="Repeat/Unrepeat" id="repeatA" onclick="clickManager('repeat')" class="${
      repeat ? "green" : "red"
    }">⟳</a>&nbsp;|&nbsp;<a title="Pause/Unpause" id="pauseA" onclick="clickManager('pause')">${
      videoE.paused ? "⏸️" : "▶️"
    }</a>&nbsp;|&nbsp;<a title="New video" onclick="clickManager('playVideo')">⏭</a>&nbsp;|&nbsp;<a title="Mute/Unmute" id="muteA" onclick="clickManager('muter')">${
      videoE.muted ? "🔇" : "🔊"
    }</a>&nbsp;<br style="display: ${
      mobileCheck() ? "block" : "none"
    };" /><a onclick="clickManager('volumeDown')">-</a>&nbsp;<span id="volumeSpan">${progressBar(
      "volume"
    )}</span>/10&nbsp;<a onclick="clickManager('volumeUp')">+</a></b>`;

  if (popupThing == "volume") return Math.round(vVolume * 100) / 10;

  if (popupThing) return popup("", 5000, "info");

  let bar = new Array(10).fill("═");
  const char = "▰";
  const front = "╞";
  const end = "╡";

  bar.splice(percent, 0, char);

  bar = bar.map((item, i) => {
    if (item == char) return item;

    return `<a onclick='clickManager("skipTo", ${i})'>${item}</a>`;
  });

  return `${front}${bar.join("")}${end}`;
}

function percentF() {
  const videoE = getEl("video");

  return Math.floor((videoE.currentTime / videoE.duration) * 10);
}

function skipTo(percent) {
  const videoE = getEl("video");

  videoE.currentTime = (percent / 10) * videoE.duration;
}

function clickManager(func, skipToPoint) {
  popupTimer -= 60;

  if (popupTimer < 0) popupTimer = 0;

  switch (func) {
    default:
      break;

    case "popup":
      popup("", 2000, "copy");
      break;

    case "repeat":
      repeatVideo();
      break;

    case "pause":
      pauseVideo();
      break;

    case "playVideo":
      playVideo();
      break;

    case "muter":
      muter();
      break;

    case "volumeDown":
      volumeDown();
      break;

    case "volumeUp":
      volumeUp();
      break;

    case "skipTo":
      skipTo(skipToPoint);
      break;
  }
}

/************************************************************************************************\
*                                         PATH FUNCTION                                          *
\************************************************************************************************/

function pathGen(folder) {
  return document.getElementsByClassName("404")[0]
    ? `${location.protocol}//${location.host}/${folder}`
    : getEl("main")
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
  const videoE = getEl("video");
  const textE = getEl("text");

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
  const videoE = getEl("video");

  videoE.currentTime -= 5;

  // popup("⤌ | 5 seconds were rewound.");
}

function fiveSecForward() {
  const videoE = getEl("video");

  videoE.currentTime += 5;

  // popup("⤍ | 5 seconds were fast forwarded.");
}

/************************************************************************************************\
*                                         MOBILE CHECK                                           *
\************************************************************************************************/

function mobileCheck() {
  let check = false;

  (function (a) {
    if (
      /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(
        a
      ) ||
      /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
        a.substr(0, 4)
      )
    )
      check = true;
  })(navigator.userAgent || navigator.vendor || window.opera);

  return check;
}

/************************************************************************************************\
*                                      GET ELEMENT FUNCTION                                      *
\************************************************************************************************/

function getEl(el) {
  return document.getElementById(el);
}
