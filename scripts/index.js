const socket = io("https://krkchat.glitch.me");
let reload = false;
let accessCode;

const userName = new URLSearchParams(window.location.search).get("username");

let connected = false;

socket.on("connect", () => {
  console.log("Connected to server with id: " + socket.id);
  connected = true;
  if (reload) {
    location.reload();
  }
});

setTimeout(() => {
  if (!connected) {
    document.body.innerHTML =
      "Failed to connect to server. <br> Retrying to connect............";
    document.body.style = "font-family: sans-serif; font-size: 20px";
    document.body.className = "center";
    reload = true;
  } else {
    if (userName !== null) {
      localStorage.setItem("userName", userName);
    }

    if (localStorage.getItem("accessCode") !== null) {
      accessCode = localStorage.getItem("accessCode");
    } else {
      location.href = "https://chat.krksh.site/sign-in";
    }

    socket.emit("getSessions", accessCode);
  }
}, 1000);

socket.on("retutrnData", (data) => {
  localStorage.setItem("account", data);
  changeProfileHref();
});

function tempInitializeSession(users) {
  socket.emit("TIS", users);
}

socket.on("receiveSessions", (sessions) => {
  sessions.forEach((session) => loadSession(session));
});

function requestMessages(id) {
  awaiting = id;
  socket.emit("requestMessages", id);
}

socket.on("receiveMessages", (messages) => {
  processMessages(messages);
});

function sendMessage(message) {
  messagePlaceholder.value = "";
  socket.emit("sendMessage", message, accessCode, openSession);
}

socket.on("requestMessages", (id) => {
  requestMessages(id);
});
