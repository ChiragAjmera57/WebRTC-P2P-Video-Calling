import React, { useContext, useState } from 'react'
import { SocketContext, useSocket } from './SocketContext'
import './Dashboard.css'
import { useNavigate } from 'react-router-dom'

export const Dashboard = () => {
    const socket = useSocket()
    const [email, setEmail] = useState('');
    const [roomNo, setRoomNo] = useState('');
    const navigate = useNavigate()
    const handleRoomJoin = () =>{
      socket.emit('join:room',{email,roomNo})
      return navigate(`/room/${roomNo}`)
    }
  
    return (
      <div className="my-form-container">
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
          placeholder="Enter your email"
        />
  
        <label htmlFor="roomNo">Room No.:</label>
        <input
          type="text"
          id="roomNo"
          value={roomNo}
          onChange={e=>setRoomNo(e.target.value)}
          placeholder="Enter your room number"
        />
        <button onClick={()=>handleRoomJoin()}>Join</button>
      </div>
    );
}
