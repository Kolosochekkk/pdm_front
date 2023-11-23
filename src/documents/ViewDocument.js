import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../PDFViewer.css';
import { Viewer, Worker } from '@react-pdf-viewer/core';
import { Link, useParams } from "react-router-dom";

import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import axios from 'axios';

export default function ViewDocument({ match }) {
  const [pdfFile, setPDFFile] = useState(null);
  const [viewPdf, setViewPdf] = useState(null);
  const { id } = useParams();

  const newPlugin = defaultLayoutPlugin();

  useEffect(() => {
    // Загрузка документа с сервера при монтировании компонента
    loadDocument();
  }, []);

  const loadDocument = async () => {
    try {
      // Запрос для получения документа по ID
      const result = await axios.get(`http://localhost:8080/documentation/${id}`);
      const document = result.data;

console.log('Значение docFilePath:', document.docFilePath);

      // Установка URL документа как пути к файлу на сервере
      setPDFFile(document.docFilePath);
    } catch (error) {
      console.error('Ошибка при загрузке документа:', error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (pdfFile != null) {
      setViewPdf(pdfFile);
      console.log('Значение viewPdf после установки:', pdfFile);
    } else {
      setViewPdf(null);
      console.log('Значение viewPdf после установки:', pdfFile);
    }
  };

  return (
    <div className='container'>
      <form onSubmit={handleSubmit}>
        {/* Вы можете удалить поле ввода файла, так как оно не требуется для документов с сервера */}
        {/* <input type="file" className='form-control' onChange={handleChange} /> */}
        <button type='submit' className='btn btn-success'>
          Просмотреть PDF
        </button>
      </form>

      <h2>Просмотр PDF</h2>
      <div className='pdf-container'>
        <Worker workerUrl='https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js'>
          {viewPdf && <Viewer fileUrl={viewPdf} plugins={[newPlugin]} />}
          {!viewPdf && <>Нет PDF</>}
        </Worker>
      </div>
    </div>
  );
}
