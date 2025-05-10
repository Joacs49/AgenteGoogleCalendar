const form = document.getElementById("whatsappForm");
const statusElement = document.getElementById("status");

const webhookUrl = window.config.webhookUrl;
const numberPhone = window.config.numberPhone;

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData(form);
  const remoteJid = formData.get("remoteJid");
  const fromMe = remoteJid === numberPhone;
  const messageType = formData.get("messageType");

  let message = {};

  if (messageType === "text") {
    message = {
      conversation: formData.get("textMessage"),
    };
  } else if (messageType === "audio") {
    if (!window.base64Audio) {
      statusElement.innerText = "⚠️ No hay audio grabado";
      statusElement.style.color = "orange";
      return;
    }

    message = {
      audioMessage: {
        base64: window.base64Audio, // 🔁 Aquí usamos el base64
        mimetype: "audio/wav; codecs=opus",
        ptt: true,
      },
    };
  }

  const data = {
    body: {
      instance: formData.get("instance"),
      data: {
        key: {
          remoteJid: remoteJid,
          fromMe: fromMe,
        },
        pushName: formData.get("pushName"),
        messageType: messageType,
        message: message,
      },
    },
  };

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      statusElement.innerText = "✅ Datos enviados correctamente";
      statusElement.style.color = "green";
    } else {
      statusElement.innerText = "❌ Error al enviar";
      statusElement.style.color = "red";
    }
  } catch (error) {
    statusElement.innerText = "❌ Error de red";
    statusElement.style.color = "red";
    console.error(error);
  }
});
