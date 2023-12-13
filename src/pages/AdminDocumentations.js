import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminMenu from './AdminMenu';
import { Link } from 'react-router-dom';
import { Modal, Button, Form } from 'react-bootstrap';

const AdminDocumentations = () => {
  const [documentations, setDocumentations] = useState([]);
  const [pendingDocumentations, setPendingDocumentations] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedDocumentation, setSelectedDocumentation] = useState(null);
  const [comment, setComment] = useState('');

  useEffect(() => {
    loadDocumentations();
  }, []);

  const userData = JSON.parse(localStorage.getItem('user'));
  const approverId = userData.id;

  const loadDocumentations = async () => {
    try {
      const result = await axios.get(`http://localhost:8080/documentations/approver/${approverId}`);
      setDocumentations(result.data);

      // Фильтруем документы со статусом "На согласовании"
      const pendingDocs = result.data.filter(doc => doc.status === 'На согласовании');
      setPendingDocumentations(pendingDocs);
    } catch (error) {
      console.error('Ошибка при загрузке документации:', error);
    }
  };

  const handleApprove = async (id) => {
    try {
      const status = 'Согласован';
      const result = await axios.put(`http://localhost:8080/documentation/${id}/${status}`);
      const updatedDocumentation = result.data;
      const updatedDocumentations = documentations.map((o) => (o.id === updatedDocumentation.id ? updatedDocumentation : o));
      setDocumentations(updatedDocumentations);

      // Обновляем массив с документами со статусом "На согласовании"
      const updatedPendingDocs = pendingDocumentations.filter(doc => doc.id !== updatedDocumentation.id);
      setPendingDocumentations(updatedPendingDocs);
    } catch (error) {
      console.error('Ошибка при обновлении статуса документации:', error);
    }
  };

  const handleReject = (documentation) => {
    setSelectedDocumentation(documentation);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setSelectedDocumentation(null);
    setComment('');
  };

  const handleRejectWithComment = async () => {
    try {
      const status = 'На доработку';
      const statusResult = await axios.put(`http://localhost:8080/documentation/${selectedDocumentation.id}/${status}`);
      const commentResult = await axios.post(`http://localhost:8080/doccomment/${selectedDocumentation.id}/${comment}`);
  
      // Обновляем состояние на основе результатов запросов
      const updatedDocumentation = statusResult.data;
      const updatedDocumentations = documentations.map((o) => (o.id === updatedDocumentation.id ? updatedDocumentation : o));
      setDocumentations(updatedDocumentations);
  
      handleModalClose();
    } catch (error) {
      console.error('Ошибка при обновлении статуса документации или отправке комментария:', error);
    }
  };
  

  const downloadDocument = async (id, title) => {
    try {
      const response = await axios.get(`http://localhost:8080/documentation/download/${id}`, {
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${title}.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Ошибка при загрузке документа:', error);
    }
  };

  return (
    <>
      <AdminMenu />
      <div className="table-wrapper">
        <h4 style={{ textAlign: 'center', margin: 'auto' }}>Документы на согласование</h4>
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
                <th scope="col">Cогласует</th>
                <th scope="col">Деталь</th>
                <th scope="col">Действия</th>
              </tr>
            </thead>
            <tbody>
              {pendingDocumentations.map((documentation, index) => (
                <tr key={index}>
                  <th scope="row">{index + 1}</th>
                  <td>{documentation.title}</td>
                  <td>{documentation.status}</td>
                  <td>{documentation.version ? documentation.version : 'Нет данных'}</td>
                  <td>{documentation.uploader.surname}</td>
                  <td>{documentation.approver.surname}</td>
                  <td>{documentation.detail ? documentation.detail.name : 'Нет данных'}</td>
                  <td>
                    {documentation.status === 'На согласовании' && (
                      <>
                        <button
                          className='btn btn-outline-dark mx-2'
                          onClick={() => handleApprove(documentation.id)}
                        >
                          Согласовать
                        </button>
                        <button
                          className='btn btn-outline-dark mx-2'
                          onClick={() => handleReject(documentation)}
                        >
                          На доработку
                        </button>
                      </>
                    )}
                    <button
                      className='btn btn-success mx-2'
                      onClick={() => downloadDocument(documentation.id, documentation.title)}
                    >
                      Скачать
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Модальное окно */}
      <Modal show={showModal} onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Отправить на доработку</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId="comment">
            <Form.Label>Комментарий</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleModalClose}>
            Закрыть
          </Button>
          <Button variant="primary" onClick={handleRejectWithComment}>
            Отправить на доработку
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AdminDocumentations;
