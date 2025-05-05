import React, { useEffect, useRef, useState } from "react";
import DailyIframe from "@daily-co/daily-js";
// import { createRoom } from "./dailyService"; // Nếu dùng backend

function DailyLive() {
  const callFrameRef = useRef(null);
  const [roomUrl, setRoomUrl] = useState("");

  const startCall = async () => {
    // ✅ Cách 1: dùng room URL có sẵn trên dashboard Daily
    const dailyRoomURL = "https://viesocial.daily.co/testroom01";
    setRoomUrl(dailyRoomURL);

    // ✅ Cách 2: Tạo room qua backend (nếu dùng backend)
    // const url = await createRoom();
    // setRoomUrl(url);
  };

  useEffect(() => {
    if (roomUrl) {
      callFrameRef.current = DailyIframe.createFrame({
        showLeaveButton: true,
        iframeStyle: {
          position: "fixed",
          width: "100%",
          height: "100%",
          border: "0",
          top: 0,
          left: 0,
        },
      });
      callFrameRef.current.join({ url: roomUrl });
    }
  }, [roomUrl]);

  return (
    <div>
      <h1>Daily Livestream</h1>
      <button onClick={startCall}>Join Livestream</button>
      <div id="video-container" />
      <iframe
        src="https://viesocial.daily.co/testroom01"
        allow="camera; microphone; fullscreen"
        width="100%"
        height="600px"
        style={{ border: 0 }}
      ></iframe>
    </div>
  );
}

export default DailyLive;
