import { useState } from 'react';
import useYandexOAuth from './hooks/useYandexOAuth';
import YandexDiskService from './api/yandexDiskService';

import './App.css';

function App() {

  const [token, error] = useYandexOAuth(process.env.REACT_APP_CLIENT_ID, process.env.REACT_APP_CLIENT_SECRET);
  const [files, setFiles] = useState([]);
  const [alert, setAlert] = useState(null);
  const [validHelper, setValidHelper] = useState(null);
  const filesLimit = 100;

  const handleChangeFile = (e) => {
    let input = e.target;
    let inputFiles = e.target.files;
    let arr = [];

    if (inputFiles.length > filesLimit) {
      setValidHelper(state => 'За один раз можно загрузить не более 100 файлов.')
      input.value = '';

      return;
    }

    setValidHelper(state => null)

    for (let file of inputFiles) {
      arr.push(file)
    }
    
    setFiles(state => arr)
  }

  const handleSubmitUpload = (e) => {
    e.preventDefault()

    if (validHelper || files.length === 0) return
    
    YandexDiskService.uploadFiles(files, token)
      .then(res => setAlert(state => ({
        type: res.error ? 'error' : 'success',
        message: res.error ? res.error : 'Файлы успешно загружены!'
      })))
      .finally(() => {
        setFiles([])
      })

      e.currentTarget.reset()
  }

  return (
    <div className="App">
      <form 
        className='form' 
        onSubmit={handleSubmitUpload}
      >
        <div className={`alert ${alert?.type}`}>{alert?.message}</div>

        <label>
          <div className="btn input">Выберите файлы</div>
          <input
            type="file" 
            onChange={handleChangeFile} 
            multiple
            hidden 
          />
        </label>
        {validHelper && <div className='valid-helper'>{validHelper}</div>}

        {files.length > 0 && 
          <div className='file-list'>
            {files.map((file, i) => <p className='file' key={i}>{`${i+1}) ${file.name}`}</p>)}
          </div>
        }

        <button 
          className='btn btn-submit'
          type='submit' 
          disabled={!!validHelper}
        >
          Загрузить
        </button>
      </form>
    </div>
  );
}

export default App;
