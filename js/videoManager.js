async function videoManager(mediaPath, map = false, newVideo = false) {
  let videos = [
    "beamerboy",
    "yourfavouritedress",
    "comearound",
    "cocaineshawty",
    "californiaworld",
    "mos",
    "keepmycoo",
    "runaway",
    "gymclass",
    "benztruck",
    "girls",
    "whitewine",
    "whitetee",
    "lilkennedy",
    "cobain",
    "hellboy",
    "liljeep",
    "drugz",
    "crybaby",
    "belgium",
    "whenilie",
    "fallingdown",
    "ivebeenwaiting",
    "lifeisbeautiful",
    "16lines",
    "cryalone",
    "4goldchains",
    "savethatshit",
    "awfulthings",
    "thebrightside",
    "backseat",
    "witchblades",
    "antarctica",
    "2ndhand",
    "forthelasttime",
    "opana",
    "magazine",
    "paris",
  ];

  let video = newVideoF();

  if (newVideo) return playVideo();

  if (map) return document.write(videos.map((video) => video).join(", "));

  document.getElementById("video").onerror = function () {
    playVideo();
  };

  let url = document.URL.split("?")[1];

  if (typeof url == "string" && url != "") {
    document
      .getElementById("video")
      .setAttribute("src", `${mediaPath}/media/${url.toLowerCase()}.mp4`);
  } else {
    playVideo();
  }

  // title shit //

  await new Promise((res) => setTimeout(() => res(true), 300));

  let x = 0;

  let titleText = titleTextGen();

  if (document.getElementById("h1")) {
    document
      .getElementById("h1")
      .setAttribute(
        "title",
        `Current video: "${document
          .getElementById("video")
          .getAttribute("src")
          .split("/")[2]
          .split(".")[0]
          .toUpperCase()}"`
      );
  }

  setInterval(loop, 300);

  // functions //

  function playVideo() {
    if (
      newVideo &&
      document
        .getElementById("video")
        .getAttribute("src")
        .split("/")[2]
        .split(".")[0] == video
    ) {
      video = newVideoF();
      playVideo();
    } else
      document
        .getElementById("video")
        .setAttribute("src", `${mediaPath}/media/${video}.mp4`);
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

    let titleVideo = document
      .getElementById("video")
      .getAttribute("src")
      .split("/")[2]
      .split(".")[0];

    titleVideo = titleVideo.toUpperCase().split("");

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

      if (document.getElementById("h1")) {
        document
          .getElementById("h1")
          .setAttribute(
            "title",
            `Current video: "${document
              .getElementById("video")
              .getAttribute("src")
              .split("/")[2]
              .split(".")[0]
              .toUpperCase()}"`
          );
      }
    }

    document.getElementsByTagName("title")[0].innerHTML = `${
      titleText[x++ % titleText.length]
    }|`;
  }
}
