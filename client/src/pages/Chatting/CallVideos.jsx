import React, { useState, useRef, useEffect, useContext } from "react";
import { Box, Avatar, Typography, IconButton, Paper } from "@mui/material";
import {
  Mic,
  MicOff,
  Videocam,
  VideocamOff,
  CallEnd,
  FlipCameraIos,
  Call,
} from "@mui/icons-material";
import { CurrentUser } from "~/routes/GlobalContext";
import Video from "./Video/Video";
import FormCard from "./FormCard/FormCard";
import IncomingCall from "./IncomingCall/IncomingCall";
import {
  VideoCallContext,
  VideoCallProvider,
} from "~/context/VideoCallContext";
import ChatVideoDemoUI from "../RealtimeFeature/ChatVideoDemoUI";
import HaveChatVideo from "../RealtimeFeature/HaveChatVideo";

const CallVideos = ({ children, friendCall }) => {
  const { isCalling, isCallAccepted } = useContext(VideoCallContext);
  useEffect(() => {
    console.log("rendervideocall");
  }, [isCallAccepted, isCalling]);
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
