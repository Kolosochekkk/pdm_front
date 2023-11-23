import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AdminMenu from './AdminMenu';

const AdminDocumentations = () => {
  const [documentations, setDocumentations] = useState([]);

  useEffect(() => {
    loadDocumentations();
  }, []);

  const userData = JSON.parse(localStorage.getItem('user'));
  const approverId = userData.id;

  const loadDocumentations = async () => {
    try {
      const result = await axios.get(`http://localhost:8080/documentations/approver/${approverId}`);
      setDocumentations(result.data);
    } catch (error) {
      console.error('Error loading documentations:', error);
    }
  };

  return (
    <>
      <AdminMenu />
      <div className="table-wrapper">
        <h4 style={{ textAlign: 'center', margin: 'auto' }}>Список утвержденных документов</h4>
      </div>
      <div className='container'>
        <div className='py-4'>
          <table className="table">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Заголовок</th>
                <th scope="col">Статус</th>
                <th scope="col">Версия</th>
                <th scope="col">Загрузил</th>
                <th scope="col">Утвердил</th>
                <th scope="col">Деталь</th>
              </tr>
            </thead>
            <tbody>
              {documentations.map((documentation, index) => (
                <tr key={index}>
                  <th scope="row">{index + 1}</th>
                  <td>{documentation.title}</td>
                  <td>{documentation.status}</td>
                  <td>{documentation.version ? documentation.version : 'No detail'}</td>
                  <td>{documentation.uploader.username}</td>
                  <td>{documentation.approver.username}</td>
                  <td>{documentation.detail ? documentation.detail.name : 'No detail'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default AdminDocumentations;
