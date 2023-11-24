const {Server} = require('socket.io')
const io = new Server(8080,{
    cors:true
})

io.on("connection",(socket)=>{
    socket.on("join:room",({roomNo,email})=>{
        io.to(roomNo).emit("user:joined",{email,id:socket.id})
        socket.join(roomNo)
        io.to(socket.id).emit("room:joined",{roomNo,email})
    })
    socket.on("user:call",({to,offer})=>{
        io.to(to).emit("incomming:call",{from:socket.id,offer})
    })
    socket.on("call:accepted",({ans,to})=>{ 
        io.to(to).emit("call:accepted",{ans,from:to})
    })
    socket.on("nego:needed",({to,offer})=>{
        io.to(to).emit("nego:needed",{from:socket.id,offer})
    })
    socket.on("nego:done",({to,ans})=>{
        io.to(to).emit("nego:finish",{ans,from:socket.id})
    })
})