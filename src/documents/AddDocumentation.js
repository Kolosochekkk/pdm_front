import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import axios from 'axios';

const AddDocumentation = () => {
  const navigate = useNavigate();

  const [documentation, setDocumentation] = useState({
    title: '',
    docPath: '',
    status: 'На согласовании',
    version: 1,
  });

  const userData = JSON.parse(localStorage.getItem('user'));
  const uploaderId = userData.id;

  const [file, setFile] = useState(null);
  const [details, setDetails] = useState([]);
  const [users, setUsers] = useState([]);
  const [approverId, setApproverId] = useState('');
  const [detailId, setDetailId] = useState('');
  const [productId] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:8080/adminusers');
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    const fetchDetails = async () => {
      try {
        const detailsResponse = await axios.get('http://localhost:8080/details');
        setDetails(detailsResponse.data);
      } catch (error) {
        console.error('Error fetching details:', error);
      }
    };

    fetchUsers();
    fetchDetails();
  }, []);

  const onInputChange = (e) => {
    setDocumentation({ ...documentation, [e.target.name]: e.target.value });
  };

  const onFileChange = (e) => {
    const selectedFile = e.target.files[0];

    if (selectedFile && !selectedFile.name.endsWith('.pdf')) {
      confirmAlert({
        title: <h2 style={{ fontSize: '24px' }}>Неверный формат файла</h2>,
        message: 'Пожалуйста, выберите файл в формате PDF.',
        buttons: [
          {
            label: 'OK',
            onClick: () => {
              e.target.value = null;
              setFile(null);
            },
          },
        ],
      });
    } else {
      setFile(selectedFile);
    }
  };

  const onApproverChange = (e) => {
    setApproverId(e.target.value);
  };

  const onDetailChange = (e) => {
    setDetailId(e.target.value);
  };

  const onCancelClick = () => {
    navigate(-1);
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('title', documentation.title);
      formData.append('status', documentation.status);
      formData.append('version', documentation.version);
      formData.append('uploaderId', uploaderId);
      formData.append('approverId', approverId);
      formData.append('detailId', detailId);
      formData.append('productId', null);

      await axios.post(`http://localhost:8080/documentation/${uploaderId}/${approverId}/${productId}/${detailId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('Документ успешно добавлен!');
      navigate(-1);
    } catch (error) {
      console.error('Error adding documentation:', error);
    }
  };

  return (
    <div className='container'>
      <div className='row'>
        <div className='col-md-6 offset-md-3 border rounded p-4 mt-2'>
          <h4 className='text-center m-4'>Добавление документа</h4>
          <form onSubmit={onSubmit} encType="multipart/form-data">
            {file && !file.name.endsWith('.pdf') && (
              <div className="alert alert-danger mt-2">
                Пожалуйста, выберите файл в формате PDF.
              </div>
            )}
            <div className='mb-3'>
              <label htmlFor='title' className='form-label'>
                Заголовок
              </label>
              <input
                type='text'
                className='form-control'
                placeholder='Заголовок'
                name='title'
                value={documentation.title}
                onChange={onInputChange}
                required
              />
            </div>
            <div className='mb-3'>
              <label htmlFor='file' className='form-label'>
                Выберите документ
              </label>
              <input
                type='file'
                className='form-control'
                name='file'
                onChange={onFileChange}
                required
              />
            </div>
            <div className='mb-3'>
              <label htmlFor='version' className='form-label'>
                Версия
              </label>
              <input
                type='number'
                className='form-control'
                placeholder='Версия'
                name='version'
                value={documentation.version}
                onChange={onInputChange}
                required
              />
            </div>
            <div className='mb-3'>
              <label htmlFor='detailId' className='form-label'>
                Деталь
              </label>
              <select
                className='form-select'
                name='detailId'
                value={detailId}
                onChange={onDetailChange}
                required
              >
                <option value='' disabled>
                  Выберите деталь
                </option>
                {details.map((detail) => (
                  <option key={detail.id} value={detail.id}>
                    {detail.name}
                  </option>
                ))}
              </select>
            </div>
            <div className='mb-3'>
              <label htmlFor='approverId' className='form-label'>
                Согласует
              </label>
              <select
                className='form-select'
                name='approverId'
                value={approverId}
                onChange={onApproverChange}
                required
              >
                <option value='' disabled>
                  Выберите согласующего
                </option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.surname} {user.name}
                  </option>
                ))}
              </select>
            </div>
            <button type='submit' className='btn btn-outline-dark'>
              Добавить
            </button>
            <button type='button' className='btn btn-outline-danger mx-2' onClick={onCancelClick}>
              Отмена
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddDocumentation;
