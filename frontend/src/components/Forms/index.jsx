import CreateRoomForm from "./CreateRoomForm";
import JoinRoomForm from "./JoinRoomForm";
import "./index.css"

const Forms=({uuid,socket,setUser})=>{
return (
    <div className="row h-100 pt-5">
        <div className="col-md-4 form-box p-5 mx-auto border border-2 border-primary mt-5 d-flex flex-column align-items-center">
            <h2 className="text-primary">Create room</h2>
            <CreateRoomForm uuid={uuid} socket={socket} setUser={setUser}/>
        </div>
        <div className="col-md-4 form-box p-5 mx-auto border border-2 border-primary mt-5 d-flex flex-column align-items-center">
           <h2 className="text-primary "> Join room</h2>
           <JoinRoomForm uuid={uuid} socket={socket} setUser={setUser}/>
        </div>
    </div>
);
    
};

export default Forms;