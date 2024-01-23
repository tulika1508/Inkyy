import { useState } from "react";
import { useNavigate } from "react-router-dom";

const CreateRoomForm=({uuid,socket,setUser})=>{
    const [roomId, setRoomId] = useState(uuid());
    const[name,setName]=useState("");

    const navigate=useNavigate();
    
    const handleCreateRoom=(e)=>{
        e.preventDefault();
        //if (!name) return toast.dark("Please enter your name!");
        
        //{name,roomId,userId,host,presenter}
        const roomData={
            name,
            userId: uuid(),
          roomId,
          
          host: true,
          presenter: true,
        }
        //setRoomJoined(true);
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
            <div className="form-group border ">
            <div className="input-group d-flex align-items-center justify-content-center">
                <input type="text" className="form-control my-2 border-0" value={roomId} disabled placeholder="Generate code"/>
                <div className="input-group-append">
                    <button className="btn btn-primary btn-sm me-1" type="button" onClick={()=>setRoomId(uuid())}>Generate code</button>
                    <button className="btn btn-outline-primary btn-sm me-1" type="button">Copy code</button>
                </div>
            </div>
            </div>
            <button type="submit" className="mt-3 btn-primary btn form-control" onClick={handleCreateRoom}>Generate Room</button>
        </form>
    )
}

export default CreateRoomForm;