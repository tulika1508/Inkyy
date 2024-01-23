import './App.css'
import Forms from './components/Forms';
import { Route,Routes } from 'react-router-dom';
import RoomPage from './pages/RoomPage';
import io from "socket.io-client";
import { useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {ToastContainer,toast} from 'react-toastify';

const server = "http://localhost:5000";
const connectionOptions = {
  "force new connection": true,
  reconnectionAttempts: "Infinity",
  timeout: 10000,
  transports: ["websocket"],
};
const socket = io(server, connectionOptions);

const App= ()=>{

  //const [userNo, setUserNo] = useState(0);
  //const [roomJoined, setRoomJoined] = useState(false);
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [userRemoved, setUserRemoved] = useState([]);
  

  //to generate random id
  const uuid = () => {
    let S4 = () => {
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };
    return (S4() +S4() +"-" +S4() +"-" +S4() +"-" +S4() +"-" +S4() +S4() +S4());
  };

  useEffect(() => {
    socket.on("userJoined",(data)=>{
      if(data.success){
        console.log("user joined");
        setUsers(data.users);
        
      }
      else{
        console.log("error");
      }
    });
    socket.on("allUsers",(data)=>{
        setUsers(data);
    });
    socket.on("userJoiningMessage",(data)=>{
      toast.info(`${data} joined the room.`)
    });
    socket.on("userLeftMessage",(data)=>{
      toast.info(`${data} left the room.`)
    });
    /*
    socket.on("userLeft",(data)=>{
      setUsers(data);
    });*/
  }, []);
return (
    <div className="container">
      <ToastContainer/>
       <Routes>
      <Route path="/:roomId" element={<RoomPage user={user} socket={socket} users={users} />}/>
      <Route path="/" element={<Forms uuid={uuid} socket={socket} setUser={setUser} />}/>
      </Routes>
    </div>
  );
};
export default App;


