import { useEffect, useState, useLayoutEffect, useRef } from 'react';
import rough from 'roughjs';
//import { RoughGenerator } from 'roughjs/bin/generator';

const roughGenerator=rough.generator();

const Whiteboard=({canvasRef,ctxRef,elements,setElements,color,tool,user,socket})=> {
  
  const [img,setImg]=useState(null);

      useEffect(()=>{
        socket.on("whiteBoardDataResponse",(data)=>{
          //console.log("hi");
          setImg(data.imgURL);
          //imgRef.current.src = data;
        });
      },[]);

  if(!user?.presenter){
    
    return (
      <div 
      className="border border-dark border-3  h-100 w-100 overflow-hidden">
      <img src={img} alt='real time image' className="w-400 h-400"/>
      </div>
      
    );
  }

  const [isDrawing, setIsDrawing] = useState(false);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.height = window.innerHeight * 2;
    canvas.width = window.innerWidth * 2;
    const ctx = canvas.getContext("2d");
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctxRef.current = ctx;
    //ctx.fillRect(0, 0, canvas.width, canvas.height);
    //setElements([]);
  },[]);

  useEffect(() => {
    ctxRef.current.strokeStyle = color;
  }, [color]);

  useLayoutEffect(() => {
    if(canvasRef){
    const roughCanvas = rough.canvas(canvasRef.current);
    //deleting the previous ones
    if (elements.length >0) {
      ctxRef.current.clearRect(0,0,canvasRef.current.width,canvasRef.current.height);
    }

      elements.forEach((element) => {
        if(element.type==="pencil"){
        roughCanvas.linearPath(element.path,{
          stroke: element.stroke,
          roughness: 0,
          strokeWidth: 5,
        });
        }
        else if(element.type==="line"){
          roughCanvas.draw(roughGenerator.line(element.offsetX,element.offsetY,element.width,element.height, {
            stroke: element.stroke,
            roughness: 0,
            strokeWidth: 5,
          }));
        }
        else if(element.type==="rect"){
          roughCanvas.draw(
            roughGenerator.rectangle(element.offsetX, element.offsetY, element.width, element.height,{
              stroke: element.stroke,
              roughness: 0,
              strokeWidth: 5,
            }));
        }
      });

      const canvasImage = canvasRef.current.toDataURL();
      socket.emit("whiteboardData", canvasImage);
    }
  },[elements]);
  
  const handleMouseDown=(e)=>{
    const { offsetX, offsetY } = e.nativeEvent;

    if (tool === "pencil") {
      setElements((prevElements) => [...prevElements,{type:"pencil",offsetX,offsetY,path: [[offsetX, offsetY]],stroke:color},]);
    }
    else if(tool==="line"){
      setElements((prevElements) => [...prevElements,{type:"line",offsetX,offsetY,width:offsetX,height:offsetY,stroke:color},]);
    }
    else if(tool==="rect"){
      setElements((prevElements) => [...prevElements,{type:"rect",offsetX,offsetY,width:0,height:0,stroke:color},]);
    }

    setIsDrawing(true);
  

    //setIsDrawing(true);
  };
  const handleMouseMove=(e)=>{

    const { offsetX, offsetY } = e.nativeEvent;
    if(isDrawing){
      

    if (tool === "pencil") {
      const {path}=elements[elements.length-1];
      const newPath=[...path,[offsetX,offsetY]];
      setElements((prevElements) =>
        prevElements.map((ele, index) =>{
          if(index === elements.length - 1){
            return{
                ...ele,path:newPath,
            };
              }
            else{
              return ele;
            }
          })
      );
      }
      else if(tool=="line"){
        setElements((prevElements) =>
        prevElements.map((ele, index) =>{
          if(index === elements.length - 1){
            return{
                ...ele,width:offsetX,height:offsetY,
            };
              }
            else{
              return ele;
            }
          })
      );
      }
      else if(tool=="rect"){
        setElements((prevElements) =>
        prevElements.map((ele, index) =>{
          if(index === elements.length - 1){
            return{
                ...ele,width:offsetX,
                height:offsetY,
            };
              }
            else{
              return ele;
            }
          })
      );
      }
    }
      
    
  };
  const handleMouseUp=(e)=>{
    //console.log("mouse up",e);
    setIsDrawing(false);
  };
  /*
  if(!user?.presenter){
    return (
      <div 
      className="border border-dark border-3  h-100 w-100 overflow-hidden">
      <canvas ref={canvasRef} />
      </div>
    )
  }*/
  return (
    <div onMouseDown={handleMouseDown}
    onMouseMove={handleMouseMove}
    onMouseUp={handleMouseUp}
    className="border border-dark border-3  h-100 w-100 overflow-hidden">
    <canvas ref={canvasRef} 
    />
    </div>
    
  )
}
export default Whiteboard;