const express = require("express");
const app = express();
const { addUser,removeUser,getUser,getUsersInRoom, } = require("./utils/user");

const server = require("http").createServer(app);
const {Server} = require("socket.io");
//new server for socket.io
const io=new Server(server);

//routes
app.get("/",(req,res)=>{
    res.send("This is mern app")
});

let roomIdGlobal,imgURLGlobal;

//when new user joins
io.on("connection",(socket)=>{
    //console.log("Connected");
    socket.on("user joined",(data)=>{
      const {name,userId,roomId,host,presenter}=data;
      roomIdGlobal=roomId;
      socket.join(roomId);
      const users=addUser({name,userId,roomId,host,presenter,socketId:socket.id});
      socket.emit("userJoined",{success:true,users});
      socket.broadcast.to(roomId).emit("userJoiningMessage",name);
      socket.broadcast.to(roomId).emit("allUsers",users);
      socket.broadcast.to(roomId).emit("whiteBoardDataResponse", {
        imgURL:imgURLGlobal,}
      );
    });
    socket.on("whiteboardData",(data)=>{
      imgURLGlobal=data;
      socket.broadcast.to(roomIdGlobal).emit("whiteBoardDataResponse", {
        imgURL:data,
      });
    });
    socket.on("disconnect", () => {
    const user = getUser(socket.id);
    
    //console.log(user);
    //const roomUsers = getUsers(userRoom);
    if (user) {
      const removedUser = removeUser(socket.id);
      socket.broadcast.to(roomIdGlobal).emit("userLeftMessage",user.name);
      //socket.broadcast.to(roomIdGlobal).emit("userLeft",removeUser);
    }
    });

  });

const PORT = process.env.PORT || 5000;
server.listen(PORT, () =>
  console.log("server is running on http://localhost:5000")
);