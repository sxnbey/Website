function videoManager(mediaPath, map = false) {
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

    video = url;
  } else {
    playVideo();
  }

  if (map) document.write(videos.map((video) => video).join(", "));

  if (document.getElementById("h1"))
    document
      .getElementById("h1")
      .setAttribute("title", `Current video: "${video}"`);
}
