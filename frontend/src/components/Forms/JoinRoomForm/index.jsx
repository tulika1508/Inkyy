import { useState } from "react";
import { useNavigate } from "react-router-dom";

const JoinRoomForm=({uuid,socket,setUser})=>{
    const [roomId, setRoomId] = useState(uuid());
    const [name, setName] = useState("");
    const navigate=useNavigate();

    const handleJoinRoom=(e)=>{
        e.preventDefault();
        //if (!joinName) return toast.dark("Please enter your name!");

        const roomData={
            name,
            roomId,
            userId: uuid(),
            host: false,
            presenter: false,
        };
        setUser(roomData);
        navigate(`/${roomId}`);
        console.log(roomData);
        socket.emit("user joined",roomData);
    }
    return(
        <form action="" className="form col-md-12 mt-4">
            <div className="form-group">
                <input type="text" className="form-control my-2" value={name} onChange={(e)=>setName(e.target.value)} placeholder="Enter Name"/>
            </div>
            <div className="form-group ">
            <input type="text" className="form-control my-2"  value={roomId} onChange={(e)=>setRoomId(e.target.value)} placeholder="Enter room code"/>
            </div>
            <button type="submit" className="mt-3 btn-primary btn form-control" onClick={handleJoinRoom}>Join Room</button>
        </form>
    )
}

export default JoinRoomForm;