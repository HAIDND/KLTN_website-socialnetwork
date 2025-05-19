import React, { useState, useRef, useEffect, useContext } from "react";

import {
  VideoCallContext,
  VideoCallProvider,
} from "~/context/VideoCallContext";
import ChatVideoDemoUI from "../RealtimeFeature/ChatVideoDemoUI";
import HaveChatVideo from "../RealtimeFeature/HaveChatVideo";

const CallVideos = ({ children, friendCall }) => {
  const { isCalling, isCallAccepted } = useContext(VideoCallContext);
  useEffect(() => {}, [isCallAccepted, isCalling]);
  return (
    <>
      {(isCalling || isCallAccepted) && (
        <>
          {/* <Video /> */}
          <ChatVideoDemoUI />
          {children}
        </>
      )}
      {/* <IncomingCall /> */}
      <HaveChatVideo />
    </>
  );
};

export default CallVideos;
