import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

export default function AddProduct() {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [product, setProduct] = useState({
    name: '',
    creationDate: new Date().toISOString().split('T')[0], // Только дата, без времени
  });

  const { name } = product;

  const onInputChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    setProduct({ ...product, creationDate: new Date().toISOString().split('T')[0] });
  }, []);

  const onCancelClick = () => {
    navigate(-1);
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('photo', e.target.photo.files[0]);
    formData.append('product', new Blob([JSON.stringify(product)], { type: 'application/json' }));

    await axios.post('http://localhost:8080/product', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    alert('Изделие успешно добавлено!');
    navigate(-1);
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

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-6 offset-md-3 border rounded p-2 mt-2">
          <h4 className="text-center m-4">Добавить изделие</h4>
          <form onSubmit={(e) => onSubmit(e)} encType="multipart/form-data">
            <div className="mb-3">
              <label htmlFor="name" className="form-label">
                Название
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="Введите название"
                name="name"
                value={name}
                onChange={(e) => onInputChange(e)}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="photo" className="form-label">
                Фото продукта
              </label>
              <input
                type='file'
                className='form-control'
                name='photo'
                onChange={onFileChange}
                required
              />
            </div>
            <button type="submit" className="btn btn-outline-primary">
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
}
