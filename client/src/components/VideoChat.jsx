// import React, { useEffect, useRef, useState } from "react";
// import io from "socket.io-client";
// import Peer from "simple-peer";

// const socket = io("http://localhost:5000");

// const Videocall = () => {
//     const [me, setMe] = useState("");
//     const [stream, setStream] = useState(null);
//     const [call, setCall] = useState({});
//     const [callAccepted, setCallAccepted] = useState(false);
//     const [receivingCall, setReceivingCall] = useState(false);
//     const [caller, setCaller] = useState("");

//     const myVideo = useRef();
//     const userVideo = useRef();
//     const connectionRef = useRef();

//     useEffect(() => {
//         navigator.mediaDevices.getUserMedia({ video: true, audio: true })
//             .then((currentStream) => {
//                 setStream(currentStream);
//                 myVideo.current.srcObject = currentStream;
//             });

//         socket.on("connect", () => setMe(socket.id));

//         socket.on("callIncoming", ({ from, signal }) => {
//             setReceivingCall(true);
//             setCaller(from);
//             setCall({ from, signal });
//         });
//     }, []);

//     const callUser = (userToCall) => {
//         const peer = new Peer({ initiator: true, trickle: false, stream });

//         peer.on("signal", (data) => {
//             socket.emit("callUser", { userToCall, signalData: data, from: me });
//         });

//         peer.on("stream", (userStream) => {
//             userVideo.current.srcObject = userStream;
//         });

//         socket.on("callAccepted", (signal) => {
//             setCallAccepted(true);
//             peer.signal(signal);
//         });

//         connectionRef.current = peer;
//     };

//     const acceptCall = () => {
//         setCallAccepted(true);
//         const peer = new Peer({ initiator: false, trickle: false, stream });

//         peer.on("signal", (data) => {
//             socket.emit("acceptCall", { signal: data, to: call.from });
//         });

//         peer.on("stream", (userStream) => {
//             userVideo.current.srcObject = userStream;
//         });

//         peer.signal(call.signal);
//         connectionRef.current = peer;
//     };

//     return (
//         <div>
//             <h2>My ID: {me}</h2>

//             <video ref={myVideo} autoPlay muted style={{ width: "300px" }} />
//             {callAccepted && <video ref={userVideo} autoPlay style={{ width: "300px" }} />}

//             <button onClick={() => callUser("ID-NGUOI-NHAN")}>📞 Gọi</button>

//             {receivingCall && !callAccepted && (
//                 <div>
//                     <h4>📲 Có người gọi...</h4>
//                     <button onClick={acceptCall}>✅ Nhận</button>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default Videocall;

import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import Peer from "simple-peer";

const socket = io("http://localhost:5000");

const Videocall = () => {
  const [me, setMe] = useState("");
  const [stream, setStream] = useState(null);
  const [call, setCall] = useState({});
  const [callAccepted, setCallAccepted] = useState(false);
  const [receivingCall, setReceivingCall] = useState(false);
  const [caller, setCaller] = useState("");
  const [idFriend, setIdFriend] = useState("");

  const myVideo = useRef();
  const userVideo = useRef();
  const connectionRef = useRef();

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((currentStream) => {
        setStream(currentStream);
        myVideo.current.srcObject = currentStream;
      });

    socket.on("connect", () => setMe(socket.id));

    socket.on("callIncoming", ({ from, signal }) => {
      console.log("callIncoming", { from, signal });
      setReceivingCall(true);
      setCaller(from);
      setCall({ from, signal });
    });
  }, []);

  const callUser = (userToCall) => {
    const peer = new Peer({ initiator: true, trickle: false, stream });

    peer.on("signal", (data) => {
      socket.emit("callUser", { userToCall, signalData: data, from: me });
    });

    peer.on("stream", (userStream) => {
      userVideo.current.srcObject = userStream;
    });

    socket.on("callAccepted", (signal) => {
      setCallAccepted(true);
      peer.signal(signal);
    });

    connectionRef.current = peer;
  };

  const acceptCall = () => {
    setCallAccepted(true);
    const peer = new Peer({ initiator: false, trickle: false, stream });

    peer.on("signal", (data) => {
      socket.emit("acceptCall", { signal: data, to: call.from });
    });

    peer.on("stream", (userStream) => {
      userVideo.current.srcObject = userStream;
    });

    peer.signal(call.signal);
    connectionRef.current = peer;
  };

  return (
    <div>
      <h2>My ID: {me}</h2>

      <video ref={myVideo} autoPlay muted style={{ width: "300px" }} />
      {callAccepted && (
        <video ref={userVideo} autoPlay style={{ width: "300px" }} />
      )}
      <input type="text" onChange={(e) => setIdFriend(e.target.value)} />
      <button onClick={() => callUser(idFriend)}>📞 Gọi</button>

      {receivingCall && !callAccepted && (
        <div>
          <h4>📲 Có người gọi...</h4>
          <button onClick={acceptCall}>✅ Nhận</button>
        </div>
      )}
    </div>
  );
};

export default Videocall;
