// import React, { useEffect, useRef } from "react";
// import { connect, Room } from "livekit-client";

// const LiveVideo = () => {
//   const videoRef = useRef();

//   useEffect(() => {
//     const start = async () => {
//       const room = new Room();

//       const token = await fetchToken();

//       await connect(room, "ws://localhost:7880", {
//         token,
//       });

//       const localTracks = await Room.createLocalTracks();
//       await room.localParticipant.publishTrack(localTracks[0]); // video
//       await room.localParticipant.publishTrack(localTracks[1]); // audio

//       room.on("trackSubscribed", (track, publication, participant) => {
//         if (track.kind === "video") {
//           track.attach(videoRef.current);
//         }
//       });
//     };

//     start();
//   }, []);

//   const fetchToken = async () => {
//     const url = `http://localhost:4000/getToken?identity=user1&room=demo`;
//     const res = await fetch(url);
//     const data = await res.json();
//     return data.token;
//   };

//   return <video ref={videoRef} autoPlay playsInline />;
// };

// export default LiveVideo;
