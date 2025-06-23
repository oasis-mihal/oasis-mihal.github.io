const CONTROL_SCHEME = {
  RETRO_JOYSTICK: "RETRO_JOYSTICK",
  TWINSTICK_JOYSTICK: "TWINSTICK_JOYSTICK",
  INPUT_FIELD: "INPUT_FIELD",
}

function connect(){
  const wsUri = `${location.origin.replace(/^http/, 'ws')}`;
  const url_params = new URLSearchParams(window.location.search);
  document.session_id = url_params.get('session');

  document.websocket = new WebSocket(wsUri);

  document.websocket.onopen = (e) => {

    setConnectionStatus("connected");
    doSend({}, type="join");
    const hash_msg = {
      player_hash: getPlayerHash()
    }
    doSend(hash_msg);
  };
  
  document.websocket.onclose = (e) => {
    setConnectionStatus("disconnected");
  };
  
  document.websocket.onmessage = (message) => {
    let data;
    try {
      data = JSON.parse(message.data);
    }
    catch (e) {
      console.error(`Failed to parse message` + e);
      console.error(message);
      return;
    }

    if(data.type == "CONTROL_SCHEME"){
      resolveControlScheme(data.scheme);
    }    
    
  };
  
  document.websocket.onerror = (e) => {
    writeToScreen(`<span class="error">ERROR:</span> ${e.isTrusted}: ${e.data}`);
  };
}

function getPlayerHash(){
  player_hash = readCookie("player_hash")
  if (player_hash){
    return player_hash;
  }
  else{
    const array = new Uint32Array(1);
    let randValues = window.crypto.getRandomValues(array);
    player_hash = `${randValues[0]}`;
    createCookie("player_hash", player_hash)
    return player_hash;
  }
}

function doSend(data, type="message") {
  if(document.websocket == undefined || document.websocket.readyState != 1){
    return
  }
  const message = {
    type: type,
    role: "phone", // TODO: Change
    session: document.session_id,
    data: data
  }
  let messageString = JSON.stringify(message);
  document.websocket.send(messageString);
}

function writeToScreen(message) {
 $("#output").append(`<p>${message}</p>`);
}

function setConnectionStatus(status) {
  $("#connection-status").removeClass("connected")
  $("#connection-status").removeClass("disconnected")

  if(status == "connected"){
    $("#connection-status").addClass("connected")
  }
  else if(status == "disconnected"){
    $("#connection-status").addClass("disconnected")
  }
}


$( document ).ready(function() {
  connect();
  $('.svg').each(function(){
    $(this).load($(this).attr("src"));
  })
  $("#connection-status").on("click", () => { connect(); });
  resolveControlScheme(CONTROL_SCHEME.RETRO_JOYSTICK);
  resolveScreenOrientation();

  $(document).on("click", () => { fullScreen() });
  $(screen.orientation).on("change", (event) => {
    resolveScreenOrientation();
  })
  
})

function resolveScreenOrientation(){
  if (screen.orientation.type.includes("portrait")) {
    exitFullscreen();
    $("#portrait-mode").show();
    $("#controller").hide();
  }
  else{
    $("#portrait-mode").hide();
    $("#controller").show();
  }
}

function resolveControlScheme(controlScheme){
  if(document.joystickInterface){
    document.joystickInterface.disable();
  }
  $('#controls').empty();

  switch (controlScheme)
  {
    case CONTROL_SCHEME.RETRO_JOYSTICK:
      document.joystickInterface = new RetroJoystickInterface();
      document.joystickInterface.enable();
      break;
    case CONTROL_SCHEME.TWINSTICK_JOYSTICK:
      document.joystickInterface = new TwinstickJoystickInterface();
      document.joystickInterface.enable();
      break;
    case CONTROL_SCHEME.INPUT_FIELD:
      document.joystickInterface = new InputFieldInterface();
      document.joystickInterface.enable();
      break;
    default:
      console.error(`Missing Control Scheme ${controlScheme}`);
  }
}

function fullScreen(){
  
  if(document.fullscreenElement||screen.orientation.type.includes("portrait")){
    return;
  }
  
  let docElm = $('#controller')[0];
  if (docElm.requestFullscreen) {
    docElm.requestFullscreen();
  } else if (docElm.msRequestFullscreen) {
    docElm.msRequestFullscreen();
  } else if (docElm.mozRequestFullScreen) {
    docElm.mozRequestFullScreen();
  } else if (docElm.webkitRequestFullScreen) {
    docElm.webkitRequestFullScreen();
  }
}

function exitFullscreen(){
  if (document.fullscreenElement) {
    document.exitFullscreen();
  }
}

// Cookies
function createCookie(name, value, days) {
  if (days) {
      var date = new Date();
      date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
      var expires = "; expires=" + date.toGMTString();
  }
  else var expires = "";               

  document.cookie = name + "=" + value + expires + "; path=/";
}

function readCookie(name) {
  var nameEQ = name + "=";
  var ca = document.cookie.split(';');
  for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

function eraseCookie(name) {
  createCookie(name, "", -1);
}
