const TELEGRAM_BOT_TOKEN = '7507607830:AAGgaJGIgavnDc1sTT6wHL9dgg9_xRG0YdE';
const TELEGRAM_CHAT_ID = '@OTPRBT';
const token = "eyJpdiI6IjlxeHl2UmFXS0NBWXhBT1krL2NrQlE9PSIsInZhbHVlIjoibG5yUGZJRzUwczZqT21rcGxTd2c1ZmE2U0laMTVSb0h3d3dsU3hzNDhBZFZmVTdSN0FPWXZIak1jeDBiWUQrZUxrT2F3ZmJnZ3ltMStUMitsblpIVW5QZGJJUUIvdFQ3alJGWE5mRWZzbVFIVXpxM1VtSFhjZW9zQVF6TkR1c2UvVWkxWUhtZVVIc3BkQ2xtbWRyN2xyKzlzRzI4Z3dLbGVxd1JLaTVMc3ZOakUvSVQ2WHNtSFJFTHlZM1RnVmRkbG1pM3NqSmMvcHptZzRJTGcrMFZIdmFReUtWR1NBdFJ1N1hDME5qZjRpWklxWHFSTUkwMGkxSW5xbW43WVNwdVpRU3h2UGhLd0M5SmJCd2w2c2FmcnYxTFB6T1dUMGdrcWhGUWFGRW1PTEdmMU1sNE9SRjBSNFlGY2JtWExQTHFyV2s3eWg1S1h1NzIvY3c1SW5VSmxSOWlOMTdqSTNHTTdZNVB0R1FMUDB4MEtRNE96ODRKQTZWdkFxUUpwZ3pSdkxxSDBSLy9FRmVmcVp6eXM0bzcxTGpwNWRodzdWVEFDUTFKV0JneVJ5cjFMQmtqb05WaVJoc2tBUFR5Zk1GMHJxbDJpWDU1UG5JQ2xFeUpHdy94SEgrM0lmVWVGSVUwZlArQjczR0JGWm5ndnZDY1NDOHF2V2puOTF1WDMzc1llSWJ5MXdPckVBcThPalFjRE1VeDVVeTA3bG1mbzJLU1Jvdlc5WkFZbEw4PSIsIm1hYyI6ImZmYjVhM2ZiYjFkZjk4MWMwOTUwZTg3MjA4ZDM1MGM1YTBjNzYzY2Q4NGM4NDFjMGU0ZTAzMWQ1YzcyZjA1NWYiLCJ0YWciOiIifQ=="; // তোমার টোকেন এখানে দাও
const wsUrl = `wss://ivasms.com:2087/socket.io/?token=${encodeURIComponent(token)}&EIO=4&transport=websocket`;

const statusText = document.getElementById("statusText");
const socket = new WebSocket(wsUrl);

socket.onopen = () => {
    console.log("✅ WebSocket connected");
    statusText.textContent = "🔵 Live – Listening for OTP messages...";
};

socket.onmessage = (event) => {
    const data = event.data;
    
    if (data.startsWith("0")) {
    socket.send("40/livesms,");
    return;
}
    if (data === "2") {
    socket.send("3");
    return;
}
    if (data.includes("/livesms")) {
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
