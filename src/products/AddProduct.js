import axios from 'axios';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function AddProduct() {
  const navigate = useNavigate();
  const [product, setProduct] = useState({
    name: '',
  });

  const { name } = product;

  const onInputChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
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

    navigate('/products');
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
                type="file"
                className="form-control"
                id="photo"
                name="photo"
                accept=".jpg,.png,.jpeg"
              />
            </div>
            <button type="submit" className="btn btn-outline-primary">
              Добавить
            </button>
            <Link className="btn btn-outline-danger mx-2" to="/products">
              Отмена
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
}
