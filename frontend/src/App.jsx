
import React, { useEffect, useRef, useState } from 'react';
import './App.css'
import uploadFile from './service/api'; 

function App() {
  const uploadRef=useRef(null);
  const handleUpload = () => {
    uploadRef.current.click();
  }
  const [file, setFile] = useState(null);
  const [res,setRes]=useState(null);

  //api call with data
  useEffect(()=>{
    const apiCall=async ()=>{
      if(file){
        const filedata=new FormData();
      filedata.append('filename', file.name);
      filedata.append('file', file);

      const response =await uploadFile(filedata);
      setRes(response.path);

      }



    }
    apiCall();

  },[file])


  return (
    <div className='container'>
      <h1>Qwickshare</h1>
      <div>
        <button onClick={() => handleUpload()}>Upload</button>
        <input type="file" ref={uploadRef} style={{ display: 'none' }} onChange={(event) => setFile(event.target.files[0])} />

      </div>
      <div>
        <a href={res}>{res}</a>
      </div>

    </div>
  )
}

export default App
