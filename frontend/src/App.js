import React, { useRef,useState } from 'react';
import axios from 'axios';
import useFileUpload from 'react-use-file-upload';

const App = () => {
  const {
    files,
    fileNames,
    fileTypes,
    totalSize,
    totalSizeInBytes,
    handleDragDropEvent,
    clearAllFiles,
    createFormData,
    setFiles,
    removeFile,
  } = useFileUpload();
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [data, setData] = useState();
  const inputRef = useRef();
  const tableRef = useRef();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(files,fileNames,fileTypes,totalSize,totalSizeInBytes);
    const formData = createFormData();
    formData.append('file', files[0]);
    formData.append('fileName', fileNames);
    try {
      let res = await axios.post('http://127.0.01:5000/post', formData, {
        'content-type': 'multipart/form-data',
      });
      res = await res.data().json();
      alert(res);
    } catch (error) {
      alert('Failed to submit files.');
    }
  };

  const submitDate = ()=>{
    tableRef.current.style.display = "block"
    fetch(`http://127.0.0.1:5000/fetch`,{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        startDate: startDate,
        endDate: endDate,
      }),
    }).then((res)=>res.json())
    .then((dat)=>{
      setData(dat.data);
    }).catch((err)=>{
      alert(err);
    })
  }

  return (
    <div className='App'>

      <div className="form-container" style={{margin:"30px auto",display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center",padding:"10px"}}>
        <div
          onDragEnter={handleDragDropEvent}
          onDragOver={handleDragDropEvent}
          onDrop={(e) => {
            handleDragDropEvent(e);
            setFiles(e, 'a');
          }}
          style={{margin:"10px auto",border:"1px solid #ccc",width:"300px",height:"300px",display:"flex",justifyContent:"center",alignItems:"center",flexDirection:"column"}}
        >
          {files.length > 0 && (
            <ul>
              <li>File types found: {fileTypes.join(', ')}</li>
              <li>Total Size: {totalSize}</li>
              <li>Total Bytes: {totalSizeInBytes}</li>

              <li className="clear-all">
                <button onClick={() => clearAllFiles()}>Clear All</button>
              </li>
            </ul>
          )}
          <p>Drag and drop files here</p>

          <button style={{margin:"10px 5px auto",padding:"5px 8px",borderRadius:"5px",backgroundColor:"#00bcd4",color:"#fff"}}
           onClick={() => inputRef.current.click()}>Or select files to upload</button>

          <input ref={inputRef} type="file" name="file" style={{ display: 'none' }} onChange={(e) => setFiles(e, 'a')} />
        </div>
        <div className="submit">
        <button style={{margin:"5px 10px auto",padding:"10px",borderRadius:"5px",backgroundColor:"#03bcd4",color:"#fff",cursor:"pointer"}} onClick={handleSubmit}>Submit</button>
      </div>

      <div style={{display:"flex",justifyContent:"center",alignContent:"center",alignItems:"center",margin:"20px auto",pading:"10px",height:"fit-content"}}>
        <span>Start Date: </span>
        <input type="date" style={{margin:"0px 10px"}} name="startDate" onChange={(e)=>setStartDate(e.target.value)} />
        <span>End Date: </span>
        <input type="date" style={{margin:"0px 10px"}} name="endDate" onChange={(e)=>setEndDate(e.target.value)} />
        <button style={{padding:"8px 7px",cursor:"pointer",borderRadius:"5px",color:"#0082da",background:"#hf873j"}} onClick={()=>submitDate()} id="fetch">Fetch Records</button>
      </div>

      <div ref={tableRef} style={{display:"none"}}>
        <table style={{border:"1px solid grey",padding:"10px",margin:"4px",borderCollapse:"collapse"}}>
          <thead style={{border:"1px solid grey",padding:"10px",margin:"4px"}}>
            <tr>
              <th style={{padding:"5px",textAlign:"center",border:"1px solid grey"}}>Image Name</th>
              <th style={{padding:"5px",textAlign:"center",border:"1px solid grey"}}>Detection</th>
              <th style={{padding:"5px",textAlign:"center",border:"1px solid grey"}}>Image</th>
            </tr>
          </thead>
          <tbody>
            {
              data?
              Object.keys(data).map((i)=>{
                return (
                  <tr key={i}>
                    <td style={{padding:"5px",textAlign:"center",border:"1px solid grey"}}>{data[i].image_name}</td>
                    <td style={{padding:"5px",textAlign:"center",border:"1px solid grey"}}>{data[i].objects_detected}</td>
                    <td style={{padding:"5px",textAlign:"center",border:"1px solid grey"}}><img style={{width:"120px",height:"120px"}} src={"/images/"+data[i].image_name} alt="image1" /></td>
                  </tr>
                )
              }):null
            }
          </tbody>
        </table>
      </div>

      </div>

      
    </div>
  );
};

export default App;
