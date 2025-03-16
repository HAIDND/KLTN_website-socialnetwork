import { Grid } from "@mui/material";
import ChatFriend from "~/components/ChatFriend";
import NewPost from "../NewFeed/newPost";
import RightListFriend from "~/components/Elements/Friend/RightListFriend";
import ChatRealtimeWindow from "./ChatRealtimeWindow";
import { useContext, useState } from "react";
import { CurrentUser } from "~/routes/GlobalContext";
import ChatList from "../Chatting/ChatList";
import RealtimeChatList from "./RealtimeChatList";
import IncomingCall from "../Chatting/IncomingCall/IncomingCall";
import Video from "../Chatting/Video/Video";

function RealtimeChat() {
  const [receiver, setReceiver] = useState(null);
  const handleSetReceiver = (receiver) => {
    setReceiver(receiver);
  };

  return (
    <>
      <Grid container>
        <Grid
          item
          flex={2}
          sx={{ overflow: "auto" }}
          display={{ xs: "none", md: "block" }}
        ></Grid>
        <Grid item flex={3} sx={{ mt: 12, height: "100%", overflow: "auto" }}>
          <ChatRealtimeWindow receiver={receiver} />
          <Video />
        </Grid>
        <Grid item flex={3} sx={{ mt: 12, height: "100%", overflow: "auto" }}>
          <RealtimeChatList onClickReceiver={handleSetReceiver} />
        </Grid>
      </Grid>
    </>
  );
}

export default RealtimeChat;
