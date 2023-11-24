import React, {
  useCallback,
  useEffect,
  useState,
} from "react";
import {  useSocket } from "./SocketContext";
import ReactPlayer from "react-player";
import peer from "./services/peer";
export const Room = () => {
  const socket = useSocket();
  const [remoteId, setRemoteId] = useState(null);
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);

  const handleCall = useCallback(async () => {
    const localMediaStream = await navigator.mediaDevices.getUserMedia({
      video: true,
    });
    const offer = await peer.getOffer();
    socket.emit("user:call", { to: remoteId, offer });
    setLocalStream(localMediaStream);
  }, [remoteId, socket]);
  const handleUserJoin = useCallback(({ email, id }) => {
    setRemoteId(id);
  }, []);
  const handleIncommingcall = useCallback(
    async ({ from, offer }) => {
      const localMediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });
      setRemoteId(from);
      setLocalStream(localMediaStream);
      const ans = await peer.getAns(offer);
      socket.emit("call:accepted", { ans, to: from });
    },
    [socket]
  );
  const sendStreams = useCallback(()=>{
    for(let track of localStream.getTracks()){
      peer.peer.addTrack(track,localStream)
    }
  },[localStream])
  const handleCallAccepted = useCallback(async({from,ans})=>{
    console.log(ans,"this ans is setremote and ans accepted")
    await peer.setRemoteDescription(ans)
    sendStreams()
    
  },[localStream])
  const handleNegoNeeded = useCallback(async()=>{
    const offer = await peer.getOffer()
    socket.emit("nego:needed",{offer,to:remoteId})
  },[remoteId, socket])

  useEffect(()=>{
    peer.peer.addEventListener("negotiationneeded",handleNegoNeeded)
    return ()=>{
      peer.peer.removeEventListener("negotiationneeded",handleNegoNeeded)
    }
  },[handleNegoNeeded])
  useEffect(()=>{
    peer.peer.addEventListener("track",async ev=>{
      console.log("GOT TRACKS!!")
      setRemoteStream(ev.streams[0])
    })
    return ()=>{
      peer.peer.removeEventListener("track",async ev=>{
        console.log("GOT TRACKS!!")
        setRemoteStream(ev.streams[0])
      })
    }
  },[])

  const handleNegoDone = useCallback(async({from,offer})=>{
    const ans = await peer.getAns(offer);
    socket.emit("nego:done",{to:from,ans})
  },[socket])
  const handleNegoFinish = useCallback(async({from,ans})=>{
    await peer.setRemoteDescription(ans)
  },[])
  useEffect(() => {
    socket.on("room:joined", (data) => {
      console.log("you joined room");
    });
    socket.on("user:joined", handleUserJoin);
    socket.on("incomming:call", handleIncommingcall);
    socket.on("call:accepted", handleCallAccepted);
    socket.on("nego:needed",handleNegoDone)
    socket.on("nego:finish",handleNegoFinish)
    return () => {
      socket.off("room:joined");
      socket.off("user:joined", handleUserJoin);
      socket.off("incomming:call", handleIncommingcall);
      socket.off("call:accepted", handleCallAccepted);
      socket.off("nego:needed",handleNegoDone)
      socket.off("nego:finish",handleNegoFinish)
    };
  }, [handleCallAccepted, handleIncommingcall, handleNegoDone, handleNegoFinish, handleUserJoin, socket]);

  return (
    <div>
      <h3>Local Stream</h3>
      {remoteId && <button onClick={handleCall}>Call</button>}
      {remoteId && <h2>Connected</h2>}
      <video style={{ width: "100px", height: "100px" }}></video>
      {localStream && (
        <ReactPlayer
          playing
          muted
          url={localStream}
          width="200px"
          height="200px"
        />
      )}
      {remoteStream && (
        <>
        <button onClick={sendStreams}>send Stream</button>
        <ReactPlayer
          playing
          muted
          url={remoteStream}
          width="200px"
          height="200px"
        />
        </>
      )}
    </div>
  );
};
