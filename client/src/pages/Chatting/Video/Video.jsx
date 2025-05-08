import React, { useContext, useState } from "react";
import Loading from "../Loading/Loading";
import { VideoCallContext } from "~/context/VideoCallContext";
import "./Video.css";
import {
  MdMic,
  MdMicOff,
  MdVideocam,
  MdVideocamOff,
  MdCallEnd,
  MdOutlineMessage,
  MdIosShare,
} from "react-icons/md";
import { Button, Col, Row } from "react-bootstrap";
import { Avatar } from "@mui/material";
import { FaUserLarge, FaVolumeXmark } from "react-icons/fa6";
const Video = ({ userId, friendId }) => {
  const {
    call,
    isCallAccepted,
    myVideoRef,
    partnerVideoRef,
    userStream,
    name,
    isCallEnded,
    endCall,
    opponentName,
    isMyVideoActive,
    isPartnerVideoActive,
    toggleVideo,
    isMyMicActive,
    isPartnerMicActive,
    toggleMicrophone,
    toggleFullScreen,
    toggleScreenSharingMode,
    toggleModal,
    callUser,
    hasUnreadMessages,
  } = useContext(VideoCallContext);
  const [friendID, setFriendID] = useState();
  return (
    <div className="fullscreen-call-container">
      <Row>
        {userStream ? (
          <Col xl={isCallAccepted ? 6 : 12} md={isCallAccepted ? 6 : 12}>
            <div className="video-paper">
              <h5 className="video-name">{name || "Name"}</h5>
              <div className="video-avatar">
                <video
                  playsInline
                  muted
                  ref={myVideoRef}
                  onClick={toggleFullScreen}
                  autoPlay
                  className={
                    isCallAccepted
                      ? "video-main fullscreen-video"
                      : "video-small"
                  }
                  style={{ opacity: isMyVideoActive ? 1 : 0 }}
                />
                <Avatar
                  className={`avatar-background ${
                    isMyVideoActive ? "avatar-hidden" : "avatar-visible"
                  }`}
                  size={100}
                  icon={
                    !name && (
                      <FaUserLarge size={45} style={{ marginBottom: "8px" }} />
                    )
                  }
                >
                  {name?.[0]?.toUpperCase()}
                </Avatar>
                {!isMyMicActive && (
                  <FaVolumeXmark className="mic-off-icon" size={42} />
                )}
              </div>
            </div>
          </Col>
        ) : (
          <p>Loading...</p>
        )}

        {isCallAccepted && !isCallEnded && partnerVideoRef && (
          <Col xl={6} md={6}>
            <div className="video-paper">
              <h5 className="video-name">
                {call.name || opponentName || "Name"}
              </h5>
              <div className="video-avatar">
                <video
                  playsInline
                  ref={partnerVideoRef}
                  onClick={toggleFullScreen}
                  autoPlay
                  className="video-main"
                  style={{ opacity: isPartnerVideoActive ? 1 : 0 }}
                />
                <Avatar
                  className={`avatar-background ${
                    isPartnerVideoActive ? "avatar-hidden" : "avatar-visible"
                  }`}
                  size={100}
                  icon={
                    !opponentName &&
                    !call.name && (
                      <FaUserLarge size={45} style={{ marginBottom: "8px" }} />
                    )
                  }
                >
                  {(opponentName || call.name)?.slice(0, 1).toUpperCase()}
                </Avatar>
                {!isPartnerMicActive && (
                  <FaVolumeXmark className="mic-off-icon" size={42} />
                )}
              </div>
            </div>
          </Col>
        )}
      </Row>

      {userStream && (
        <div className="video-controls">
          <Button onClick={toggleMicrophone} className="video-control-btn">
            {isMyMicActive ? <MdMic size={25} /> : <MdMicOff size={25} />}
          </Button>

          <Button onClick={toggleVideo} className="video-control-btn">
            {isMyVideoActive ? (
              <MdVideocam size={25} />
            ) : (
              <MdVideocamOff size={25} />
            )}
          </Button>
          {/* <input
            type="text"
            value={friendID}
            onChange={(e) => setFriendID(e.target.value)}
          />
          <Button onClick={() => callUser(friendID)}>Call</Button> */}
          {isCallAccepted && !isCallEnded && (
            <>
              <Button
                className="video-control-btn"
                onClick={toggleScreenSharingMode}
              >
                <MdIosShare size={23} />
              </Button>

              <Button className="video-control-btn" onClick={toggleModal}>
                <MdOutlineMessage size={22} />
                {hasUnreadMessages && <div className="notification-dot" />}
              </Button>

              <Button className="decline-call-btn" onClick={endCall}>
                <MdCallEnd size={22} />
              </Button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Video;
