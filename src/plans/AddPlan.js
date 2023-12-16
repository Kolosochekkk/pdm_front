import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';


const AddPlan = () => {
  const navigate = useNavigate();

  const [plan, setPlan] = useState({
    title: '',
    planPath: '',
    status: 'На согласовании',
    version: 1
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
    setPlan({ ...plan, [e.target.name]: e.target.value });
  };

  const onFileChange = async (e) => {
    const selectedFile = e.target.files[0];
  
    if (selectedFile) {
      const allowedImageFormats = ['image/png', 'image/jpeg', 'image/bmp', 'image/tiff'];
  
      if (!allowedImageFormats.includes(selectedFile.type)) {
        await new Promise((resolve) => {
          confirmAlert({
            title: <h2 style={{ fontSize: '24px' }}>Неверный формат файла</h2>,
            message: 'Пожалуйста, выберите файл в формате PNG, JPEG, BMP или TIFF.',
            buttons: [
              {
                label: 'OK',
                onClick: () => {
                  e.target.value = null;
                  setFile(null);
                  resolve();
                },
              },
            ],
          });
        });
      } else {
        setFile(selectedFile);
      }
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
      formData.append('title', plan.title);
      formData.append('status', plan.status);
      formData.append('version', plan.version);
      formData.append('uploaderId', uploaderId);
      formData.append('approverId', approverId);
      formData.append('detailId', detailId);

      await axios.post(`http://localhost:8080/plan/${uploaderId}/${approverId}/${productId}/${detailId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('Чертеж успешно добавлен!');
      navigate(-1);
    } catch (error) {
      console.error('Error adding documentation:', error);
    }
  };

  return (
    <div className='container'>
      <div className='row'>
        <div className='col-md-6 offset-md-3 border rounded p-4 mt-2'>
          <h4 className='text-center m-4'>Добавление чертежа</h4>
          <form onSubmit={onSubmit} encType="multipart/form-data">
            <div className='mb-3'>
              <label htmlFor='title' className='form-label'>
                Заголовок
              </label>
              <input
                type='text'
                className='form-control'
                placeholder='Заголовок'
                name='title'
                value={plan.title}
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
                value={plan.version}
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
                Утвердил
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

export default AddPlan;