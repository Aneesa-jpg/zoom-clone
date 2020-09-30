const socket = io("/");
const peer = new Peer();
let myVideoStream;

const videoGrid = document.getElementById("video-grid");
const myVideo = document.createElement("video");

navigator.mediaDevices
  .getUserMedia({
    audio: true,
    video: true,
  })
  .then(function (stream) {
    myVideoStream = stream;
    addVideoStream(myVideo, myVideoStream);

    peer.on("call", (call) => {
      call.answer(stream);
      const video = document.createElement("video");
      call.on("stream", (userVideoStream) => {
        addVideoStream(video, userVideoStream);
      });
    });

    socket.on("userConnected", (userName, id) => {
      connectToNewUser(userName, id, stream);
    });
    let text = $("input");
    $("html").keydown((e) => {
      if (e.which == 13 && text.val().length !== 0) {
        console.log(text.val());
        console.log(data.userName);
        let userId = data.userName;
        let textVal = text.val();
        socket.emit("newMessage", textVal, userId);
        text.val("");
        scrollToBottom();
      }
    });

    socket.on("createMessage", (message, userName) => {
      $(".chatMessages").append(
        `<li>
          <b>${userName}: </b>${message}
        </li>`
      );
    });
  })
  .catch(function (err) {
    console.log(err);
  });


const addVideoStream = (video, stream) => {
  video.srcObject = stream;
  video.addEventListener("loadedmetadata", () => {
    video.play();
  });
  videoGrid.append(video);
};
const data = { roomName, userName };
console.log(data);

peer.on("open", (id) => {
  socket.emit("joinroom", data, id);
});

const connectToNewUser = (userName, id, stream) => {
  $(".notification").append(`<li><b>${userName}</b> has joined the chat</li>`);
  const call = peer.call(id, stream);
  const video = document.createElement("video");
  call.on("stream", (userVideoStream) => {
    addVideoStream(video, userVideoStream);
  });
};

const scrollToBottom = () => {
  let d = $(".chat-grid");
  d.scrollTop(d.prop("scrollHeight"));
};

const muteUnmute = () => {
  console.log(myVideoStream);
  const option = myVideoStream.getAudioTracks()[0].enabled;
  if (option) {
    myVideoStream.getAudioTracks()[0].enabled = false;
    setUnMuteButton();
  } else {
    myVideoStream.getAudioTracks()[0].enabled = true;
    setMuteButton();
  }
};

const setUnMuteButton = () => {
  const html = `<i class="fas fa-microphone-slash fa-lg"></i>`;
  document.querySelector(".muteButton").innerHTML = html;
};
const setMuteButton = () => {
  const html = `<i class="fas fa-microphone fa-lg"></i>`;
  document.querySelector(".muteButton").innerHTML = html;
};

const playStop = () => {
  console.log(myVideoStream);
  const option = myVideoStream.getVideoTracks()[0].enabled;
  if (option) {
    myVideoStream.getVideoTracks()[0].enabled = false;
    setStopButton();
  } else {
    myVideoStream.getVideoTracks()[0].enabled = true;
    setPlayButton();
  }
};
const setStopButton = () => {
  const html = `<i  class="fas fa-video-slash fa-lg"></i>`;
  document.querySelector(".stopButton").innerHTML = html;
};
const setPlayButton = () => {
  const html = `<i  class="fas fa-video fa-lg"></i>`;
  document.querySelector(".stopButton").innerHTML = html;
};
