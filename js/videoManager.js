function videoManager(mediaPath, map) {
  let videos = [
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
    "antarctica",
    "2ndhand",
    "forthelasttime",
    "opana",
    "magazine",
    "paris",
  ];

  function playVideo() {
    let video = videos[Math.floor(Math.random() * videos.length)];

    document
      .getElementById("video")
      .setAttribute("src", `${mediaPath}/media/${video}.mp4`);

    document
      .getElementById("audio")
      .setAttribute("src", `${mediaPath}/media/${video}.mp3`);

    document.getElementById("audio").volume = 0.3;
  }

  document.getElementById("video").onerror = function () {
    playVideo();
  };

  let url = document.URL.split("?")[1];

  if (typeof url == "string" && url != "") {
    document
      .getElementById("video")
      .setAttribute("src", `${mediaPath}/media/${url}.mp4`);

    document
      .getElementById("audio")
      .setAttribute("src", `${mediaPath}/media/${url}.mp3`);

    document.getElementById("audio").volume = 0.3;
  } else {
    playVideo();
  }

  if (map) document.write(videos.map((video) => video).join(", "));
}
