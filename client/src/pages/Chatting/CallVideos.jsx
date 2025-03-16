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
import Peer from "simple-peer";
import Video from "./Video/Video";
import FormCard from "./FormCard/FormCard";
import IncomingCall from "./IncomingCall/IncomingCall";
import { VideoCallProvider } from "~/context/Context";

const CallVideos = ({ friendCall }) => {
  return (
    <VideoCallProvider>
      {" "}
      <Video />
      <FormCard />
      <IncomingCall />
    </VideoCallProvider>
  );
};

export default CallVideos;
