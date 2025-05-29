const TELEGRAM_BOT_TOKEN = '8068322135:AAFha-ZYRcoVh4I4Isch1Y46qDxpf5C3GI8';
const TELEGRAM_CHAT_ID = '@OTPRBT';
const token = "eyJpdiI6Ik1QRGdvcDRkTkxHekxGR2ZaaUtiaHc9PSIsInZhbHVlIjoiTHcwakU3WWFyWUM4NFkzMDRTUzZsQ2F6blpqSXV3anlRM1g0OWVER2hVRzZhbTZ2c0pLajF3dXJmdmZKWjlHSTBqRkZPQ3pZQk1tVHMydDc2UlFCZ0ppYlpYdmlpU0luOGRwL0dhdENZVDZLVTFGeUJrbTVVbkhUbnhmL0JIK1hFUXczRjNHdXRhM2t4YXRQc09jSnZaN1BVMlgwMjFRcEdONWpBc252WlVMQjlnU20wNC9pVGhGdmN2T21BWmIzZlFtbHc3eEVhYm5venFUUmpKUFI3clhaRXhHOEE2QmdTdFNSSExra25sTGUyYXVEdDduVDRRTE5BZ1ZCd2dHQklwL21FN2l1MjNuczlqbnBXWkM3aC9CV25zYlYxMyt0NVgwQUIxODEzYUpqNUVDT2xlc0lUKzAvaGNhbXFGVnBLS3o1aHNSb0N2K1F0YTY2QWlYc2d3NUNpY3B4TTN6eWRPKzVFYVFFWDA2NVJzM01GYU1PeEpobUVOTnlZalc4OEFYNnhtWGRGUC9DUWhGbDl0SURzY3ZjK3RnbTgwTisvbzFhZWxGc0ZWY0xoZFoySEVaYmZPNFZER1lHNW80S21KeE5vd09sYklPYk12ejBSbzE4MFpKcWw4WWxHNlB5Q2E4SmVCakpDcXBydUtpTkxTNGJkUzZvVTVvNDhyZTI1M1h5VC9tUTFvOXdDRThMVWwvSnlTbWtuckRwT3F3RG5KbHVUcVdHK05VPSIsIm1hYyI6IjgzNzUyZDdmNjEyOTRhNmViMjBiYmIxOTg4Y2NlOTczYzVjZDAyNjQwZjNmMWZkM2UyNDE0MGNlZmVmNmZiMTUiLCJ0YWciOiIifQ=="; // তোমার টোকেন এখানে দাও
const wsUrl = `wss://ivasms.com:2087/socket.io/?token=${encodeURIComponent(token)}&EIO=4&transport=websocket`;

const statusText = document.getElementById("statusText");
const socket = new WebSocket(wsUrl);

socket.onopen = () => {
  console.log("✅ WebSocket connected");
  statusText.textContent = "🔵 Live – Listening for OTP messages...";
};

socket.onmessage = (event) => {
  const data = event.data;
  if (data.startsWith("42/livesms")) {
    try {
      const payload = JSON.parse(data.slice(data.indexOf("[")));
      const messageData = payload[1];
      
      const bdTime = new Date().toLocaleString("en-GB", {
        timeZone: "Asia/Dhaka",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
      });
      
      const regex = /\b\d{4,}\b|\b\d{2,}-\d{2,}\b/;
      const match = messageData.message.match(regex);
      const otp = match ? match[0] : "Not Detected";
      
      const messageText = `
✨ <b>TG World OTP Received</b> ✨

⏰ <b>Time:</b> ${bdTime}
📞 <b>Number:</b> ${messageData.recipient}
🔧 <b>Service:</b> ${messageData.originator}

🔑 <b>OTP Code:</b> <code>${otp}</code>

<blockquote>${messageData.message}</blockquote>

━━━━━━━━━━━━━━━━━━━━
📝 <b>Note:</b> আমাদের চ্যানেলে জয়েন হয়ে নিন 👇
🚀 <a href="https://t.me/allinworldbackup">@allinworldbackup</a>
      `;
      
      fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: TELEGRAM_CHAT_ID,
            text: messageText,
            parse_mode: "HTML"
          })
        })
        .then(res => res.json())
        .then(data => console.log("📤 Sent to Telegram:", data))
        .catch(err => console.error("❌ Telegram Error:", err));
      
    } catch (err) {
      console.error("❌ Message Parse Error:", err);
    }
  }
};

socket.onerror = (error) => {
  console.error("❌ WebSocket Error:", error);
  statusText.textContent = "🔴 Error – Unable to connect.";
};

socket.onclose = () => {
  console.warn("⚠️ WebSocket closed");
  statusText.textContent = "🔴 Offline – Connection closed.";
};