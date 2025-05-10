let mediaRecorder;
let audioChunks = [];
window.audioBlobUrl = null;      // URL temporal del audio (para escuchar)
window.base64Audio = null;       // Audio en base64 (para enviar)

// Función para convertir Blob a base64
function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result); // Incluye el prefijo: data:audio/ogg;...
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

// Mostrar campos según el tipo de mensaje
document.getElementById("messageType").addEventListener("change", function () {
  const messageType = this.value;

  document.getElementById("textMessageContainer").style.display =
    messageType === "text" ? "block" : "none";
  document.getElementById("audioMessageContainer").style.display =
    messageType === "audio" ? "block" : "none";
});

// Iniciar grabación
document.getElementById("startRecording").addEventListener("click", async () => {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  mediaRecorder = new MediaRecorder(stream);
  audioChunks = [];

  mediaRecorder.ondataavailable = (event) => {
    audioChunks.push(event.data);
  };

  mediaRecorder.onstop = async () => {
    const audioBlob = new Blob(audioChunks, { type: "audio/ogg; codecs=opus" });
    window.audioBlobUrl = URL.createObjectURL(audioBlob);

    const audioElement = document.getElementById("audioPlayback");
    audioElement.src = window.audioBlobUrl;
    audioElement.style.display = "block";

    // Convertir y guardar en base64
    window.base64Audio = await blobToBase64(audioBlob);
    console.log("Audio en base64 listo para enviar:");
    console.log(window.base64Audio); // Puedes verlo por consola
  };

  mediaRecorder.start();
  document.getElementById("startRecording").style.display = "none";
  document.getElementById("stopRecording").style.display = "inline";
});

// Detener grabación
document.getElementById("stopRecording").addEventListener("click", () => {
  mediaRecorder.stop();
  document.getElementById("startRecording").style.display = "inline";
  document.getElementById("stopRecording").style.display = "none";
});
