import { useRef, useState,useEffect } from "react";
import "./index.css"
import Whiteboard from "../../components/Whiteboard";
const RoomPage=({user,socket,users})=>{
    const canvasRef=useRef(null);
    const ctxRef=useRef(null);

    const [tool,setTool]=useState("pencil");
    const [color,setColor]=useState("#000000");
    const [elements,setElements]=useState([]);
    const [history, setHistory] = useState([]);
    const [openedUserTab,setOpenedUserTab]=useState(false);

    useEffect(()=>{
      return ()=>{
         socket.emit("user left",user);
      }
    },[])

    const handleClearBoard=()=>{
        
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        setElements([]);
        
        
    };
    const undo = () => {
        setHistory((prevHistory) => [
          ...prevHistory,
          elements[elements.length - 1],
        ]);
        setElements((prevElements) =>
          prevElements.filter((ele, index) => index !== elements.length - 1)
        );
      };
      const redo = () => {
        setElements((prevElements) => [
          ...prevElements,
          history[history.length - 1],
        ]);
        setHistory((prevHistory) =>
          prevHistory.filter((ele, index) => index !== history.length - 1)
        );
      };
      

  return (
    <div className="row">
        <button type="button" className="btn btn-secondary "
        style={{display:"block",position:"absolute",top:"3%",left:"3%",height:"40px",width:"90px"}}
        onClick={()=>setOpenedUserTab(true)}>All Users</button>
        {
          openedUserTab &&(
            <h5 className="position-fixed top-0 h-100 text-black fw-bold   bg-secondary" style={{ width:"250px", left:"0%" }} >
              <button className="btn btn-dark btn-block w-100 mt-2" onClick={()=>setOpenedUserTab(false)}>Close Tab</button>
              <div className="mt-2 display-flex text-center ">All Users</div>
              {
                users.map((usr,ind)=>(
                   <h6 key={ind} className="mt-3 fw-normal text-white  w-100 text-center">{usr.name}{user && user.userId===usr.userId && "(You)"}</h6>
                ))
              }
              
              </h5>
          )
        }
        <h1 className="text-center text-primary mt-1">Inkyy</h1>
        <h3 className="text-center mt-1 fw-light">Welcome to White Board Sharing App
        
        </h3>
        {
           user?.presenter &&(
            <div className="col-md-12 mt-2 mb-3 ms-4 d-flex align-items-center justify-content-around gap-2">
            <div className="d-flex col-md-3 justify-content-between gap-3">
                <div className="d-flex gap-1 ms-5">
                    <label htmlFor="pencil">Pencil</label>
                    <input type="radio" id="pencil" checked={tool === "pencil"} name="tool" value="pencil" onChange={(e)=>setTool(e.target.value)}/>
                </div>
                <div className="d-flex gap-1">
                    <label htmlFor="line">Line</label>
                    <input type="radio" id="line" name="tool" checked={tool === "line"} value="line" onChange={(e)=>setTool(e.target.value)}/>
                </div>
                <div className="d-flex gap-1">
                    <label htmlFor="rect">Rectangle</label>
                    <input type="radio" id="rect" name="tool" checked={tool === "rect"} value="rect" onChange={(e)=>setTool(e.target.value)}/>
                </div>
                
            </div>
            <div className="col-md-3 mt-2">
                <div className="d-flex align-items-between">
                    <label htmlFor="color">Select Colour:</label>
                    <div className="ms-1">
                    <input type="color" id="color" value={color} className="" onChange={(e)=>setColor(e.target.value)} />
                    </div>
                    
                </div>
            </div>
            <div className="col-md-2 d-flex gap-2">
                <button className="btn btn-primary mt-1" disabled={elements.length===0} onClick={undo}>Undo</button>
                <button className="btn btn-outline-primary mt-1" disabled={history.length===0} onClick={redo}>Redo</button>
            </div>
            <div className="col-md-2">
                <button className="btn btn-secondary" onClick={handleClearBoard} >Clear board</button>
            </div>
        </div>
          
           )}
        

        <div className="col-md-10 mx-auto mt-2 ms-6 canvas-box">
            <Whiteboard canvasRef={canvasRef} ctxRef={ctxRef}
            elements={elements} setElements={setElements}
            tool={tool} color={color} user={user} socket={socket}
            
            />
        </div>

    </div>
  )
}

export default RoomPage;