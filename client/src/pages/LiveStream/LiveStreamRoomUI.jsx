function LiveStreamRoomUI({
  isStreamer,
  roomInfo,
  videoRef,
  partnerVideoRef,
  messages,
  viewers,
  isMicActive,
  isVideoActive,
  isScreenSharing,
  toggleMic,
  toggleVideo,
  toggleScreenShare,
  handleOwnerEndRoom,
  handleViewerLeftRoom,
  setNewMessage,
  newMessage,
  handleSendMessage,
  chatRef,
  setShowChat,
}) {
  return (
    <Box sx={{ height: "100vh", display: "flex" }}>
      {/* Main Content */}
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {/* Video Area */}
        <Box sx={{ flex: 1, bgcolor: "black", position: "relative" }}>
          {isStreamer ? (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted={isStreamer}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
              }}
            />
          ) : (
            <video
              ref={partnerVideoRef}
              autoPlay
              playsInline
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
              }}
            />
          )}

          {/* Stream Info Overlay */}
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              p: 2,
              background:
                "linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, transparent 100%)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Avatar src={roomInfo?.streamerAvatar} />
              <Typography variant="h6" color="white">
                {roomInfo?.streamerName}
              </Typography>
            </Box>
            <Badge
              badgeContent={viewers?.length}
              color="error"
              sx={{ "& .MuiBadge-badge": { fontSize: "0.8rem" } }}
            >
              <People sx={{ color: "white" }} />
            </Badge>
          </Box>

          {/* Streamer Controls */}
          {isStreamer ? (
            <Stack
              direction="row"
              spacing={1}
              sx={{
                position: "absolute",
                bottom: 16,
                left: "50%",
                transform: "translateX(-50%)",
                bgcolor: "rgba(0,0,0,0.6)",
                borderRadius: 2,
                p: 1,
              }}
            >
              {/* // Update the control buttons section */}
              <IconButton onClick={toggleMic} sx={{ color: "white" }}>
                {isMicActive ? <Mic /> : <MicOff color="error" />}
              </IconButton>
              <IconButton onClick={toggleVideo} sx={{ color: "white" }}>
                {isVideoActive ? <Videocam /> : <VideocamOff color="error" />}
              </IconButton>
              <IconButton onClick={toggleScreenShare} sx={{ color: "white" }}>
                {isScreenSharing ? <StopScreenShare /> : <ScreenShare />}
              </IconButton>
              <IconButton onClick={handleOwnerEndRoom} sx={{ color: "white" }}>
                {isScreenSharing ? <CallEnd /> : <CallEnd />}
              </IconButton>
            </Stack>
          ) : (
            <Stack
              direction="row"
              spacing={1}
              sx={{
                position: "absolute",
                bottom: 16,
                left: "50%",
                transform: "translateX(-50%)",
                bgcolor: "rgba(0,0,0,0.6)",
                borderRadius: 2,
                p: 1,
              }}
            >
              <IconButton
                onClick={handleViewerLeftRoom}
                sx={{ color: "white" }}
              >
                <ExitToApp />
              </IconButton>
            </Stack>
          )}
        </Box>
      </Box>

      {/* Chat Sidebar */}
      <Paper
        sx={{
          width: 350,
          display: "flex",
          flexDirection: "column",
          borderLeft: 1,
          borderColor: "divider",
        }}
      >
        <Box
          sx={{
            p: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h6">Live Chat</Typography>
          <IconButton onClick={() => setShowChat(false)} size="small">
            <Close />
          </IconButton>
        </Box>
        <Divider />

        {/* Messages */}
        <Box
          ref={chatRef}
          sx={{
            flex: 1,
            overflowY: "auto",
            p: 2,
            display: "flex",
            flexDirection: "column",
            gap: 1,
          }}
        >
          {messages.map((msg, idx) => (
            <Box
              key={idx}
              sx={{
                display: "flex",
                gap: 1,
                alignItems: "flex-start",
              }}
            >
              <Avatar src={msg.senderAvatar} sx={{ width: 32, height: 32 }} />
              <Box>
                <Typography variant="subtitle2" color="primary">
                  {msg.senderName}
                </Typography>
                <Typography variant="body2">{msg?.message}</Typography>
              </Box>
            </Box>
          ))}
        </Box>

        {/* Chat Input */}
        <Box
          component="form"
          onSubmit={handleSendMessage}
          sx={{
            p: 2,
            borderTop: 1,
            borderColor: "divider",
            display: "flex",
            gap: 1,
          }}
        >
          <TextField
            size="small"
            fullWidth
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <IconButton
            type="submit"
            color="primary"
            disabled={!newMessage.trim()}
          >
            <Send />
          </IconButton>
        </Box>
      </Paper>
    </Box>
  );
}

export default LiveStreamRoomUI;
