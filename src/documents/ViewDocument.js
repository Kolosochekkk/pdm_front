import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const ViewDocument = () => {
  const { id } = useParams();
  const [pdfContent, setPdfContent] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadPDFContent = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/documentation/content/${id}`, {
          responseType: 'arraybuffer',
        });

        const pdfBlob = new Blob([response.data], { type: 'application/pdf' });
        const pdfUrl = URL.createObjectURL(pdfBlob);
        setPdfContent(pdfUrl);
      } catch (error) {
        console.error('Error loading PDF content:', error);
      }
    };

    loadPDFContent();
  }, [id]);

  const onCancelClick = () => {
    navigate(-1); // Используйте navigate(-1) для возврата на предыдущую страницу
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '92.8vh', overflow: 'hidden' }}>
      <button type='button' className="btn btn-primary" style={{ marginRight: '1350px' }} onClick={onCancelClick}>
        Назад
      </button>
      {pdfContent ? (
        <embed src={pdfContent} type="application/pdf" width="100%" height="100%" />
      ) : (
        <p>Loading PDF...</p>
      )}
    </div>
  );
};

export default ViewDocument;
