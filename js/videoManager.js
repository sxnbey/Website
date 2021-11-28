async function videoManager(mediaPath, map = false) {
  function wait() {
    return new Promise((res) => setTimeout(() => res(true), 200));
  }

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

  let video = videos[Math.floor(Math.random() * videos.length)];

  function playVideo() {
    document
      .getElementById("video")
      .setAttribute("src", `${mediaPath}/media/${video}.mp4`);
  }

  document.getElementById("video").onerror = function () {
    playVideo();
  };

  let url = document.URL.split("?")[1];

  if (typeof url == "string" && url != "") {
    document
      .getElementById("video")
      .setAttribute("src", `${mediaPath}/media/${url}.mp4`);
  } else {
    playVideo();
  }

  if (map) document.write(videos.map((video) => video).join(", "));

  await new Promise((res) => setTimeout(() => res(true), 300));

  var x = 0;

  var titleText = [
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

  if (document.getElementById("h1")) {
    document
      .getElementById("h1")
      .setAttribute("title", `Current video: "${titleVideo}"`);
  }

  titleVideo = titleVideo.toUpperCase().split("");

  titleVideo.forEach((v) => {
    titleText.push(`${titleText[titleText.length - 1]}${v}`);
    titleText.push(`${titleText[titleText.length - 1]} `);
  });

  function loop() {
    document.getElementsByTagName("title")[0].innerHTML = `${
      titleText[x++ % titleText.length]
    }|`;
  }

  setInterval(loop, 300);
}
