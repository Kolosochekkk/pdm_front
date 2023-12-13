// ViewDocument.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';

const ViewDocument = () => {
  const { id } = useParams();
  const [pdfContent, setPdfContent] = useState(null);

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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '92.8vh', overflow: 'hidden' }}>
      <Link to="/documentations" className="btn btn-primary" style={{marginRight: '1350px' }}>
        Назад
      </Link>
      {pdfContent ? (
        <embed src={pdfContent} type="application/pdf" width="100%" height="100%" />
      ) : (
        <p>Loading PDF...</p>
      )}
    </div>
  );
};

export default ViewDocument;
