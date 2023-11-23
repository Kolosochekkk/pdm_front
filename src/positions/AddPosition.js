import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const AddPosition = () => {
  const navigate = useNavigate();

  const [position, setPosition] = useState({
    name: '',
  });

  const { name } = position;

  const onInputChange = (e) => {
    setPosition({ ...position, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8080/position', position);
      navigate('/positions');
    } catch (error) {
      console.error('Error adding position:', error);
    }
  };

  return (
    <div className='container'>
      <div className='row'>
        <div className='col-md-6 offset-md-3 border rounded p-4 mt-2'>
          <h4 className='text-center m-4'>Добавление должности</h4>
          <form onSubmit={onSubmit}>
            <div className='mb-3'>
              <label htmlFor='Name' className='form-label'>
                Название
              </label>
              <input
                type='text'
                className='form-control'
                placeholder='Название'
                name='name'
                value={name}
                onChange={onInputChange}
                required
              />
            </div>
            <button type='submit' className='btn btn-outline-dark'>
              Добавить
            </button>
            <Link className='btn btn-outline-danger mx-2' to='/positions'>
              Отмена
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddPosition;
