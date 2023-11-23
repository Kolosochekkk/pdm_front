import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';


const AddDocumentation = () => {
  const navigate = useNavigate();

  const [documentation, setDocumentation] = useState({
    title: '',
    docPath: '', // No longer needed
    status: 'На согласовании',
    version: 1,
  });

  const userData = JSON.parse(localStorage.getItem('user'));
  const uploaderId = userData.id;

  //const [adminApprovers, setAdminApprovers] = useState([]);

  const [file, setFile] = useState(null);
  const [details, setDetails] = useState([]);
  const [users, setUsers] = useState([]);
  const [approverId, setApproverId] = useState('');
  const [detailId, setDetailId] = useState('');

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
  }, []); // Run once on component mount

  const onInputChange = (e) => {
    setDocumentation({ ...documentation, [e.target.name]: e.target.value });
  };

  const onFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // const onUploaderChange = (e) => {
  //   setUploaderId(e.target.value);
  // };

  const onApproverChange = (e) => {
    setApproverId(e.target.value);
  };

  const onDetailChange = (e) => {
    setDetailId(e.target.value);
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

      await axios.post(`http://localhost:8080/documentation/${uploaderId}/${approverId}/${detailId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      navigate('/documentations');
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
                  Выберите утвердившего
                </option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.username}
                  </option>
                ))}
              </select>
            </div>
            <button type='submit' className='btn btn-outline-dark'>
              Добавить
            </button>
            <Link className='btn btn-outline-danger mx-2' to='/documentations'>
              Отмена
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddDocumentation;
