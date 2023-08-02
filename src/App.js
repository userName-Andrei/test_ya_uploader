import { useState } from 'react';
import useYandexOAuth from './hooks/useYandexOAuth';
import YandexDiskService from './api/yandexDiskService';

import './App.css';

function App() {

  const [token, error] = useYandexOAuth(process.env.REACT_APP_CLIENT_ID, process.env.REACT_APP_CLIENT_SECRET);
  const [files, setFiles] = useState([]);

  console.log(process.env.REACT_APP_CLIENT_ID, process.env.REACT_APP_CLIENT_SECRET)

  const handleChangeFile = (e) => {
    let inputFiles = e.target.files;
    let arr = [];

    for (let file of inputFiles) {
      arr.push(file)
    }
    
    setFiles(state => arr)
  }

  const handleClickUpload = () => {
    YandexDiskService.uploadFiles(files, token)
  }

  return (
    <div className="App">
      <input type="file" onChange={handleChangeFile} multiple />
      <button onClick={handleClickUpload}>Загрузить</button>
    </div>
  );
}

export default App;
