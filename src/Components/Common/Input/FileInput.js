import React, { useState } from 'react';
import './styles.css'

const FileInput = ({accept, id, fileHandleFunction, text}) => {

    const [fileSelected, setFileSelected] = useState('');

    const onChange = (e) =>{
        console.log(e.target.files);
        setFileSelected(e.target.files[0].name);
        fileHandleFunction(e.target.files[0])
    }
    
  return (
    <>
        <label htmlFor={id} style={{cursor: 'pointer'}} className={`custom-input ${!fileSelected ? "label-input" : "active"}`}>{fileSelected ? `The File ${fileSelected} was Selected` : text}</label>
        <input type="file" accept={accept} id={id} style={{display:'none'}} onChange={onChange} />
    </>
  )
}

export default FileInput