import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import AdminMenu from './AdminMenu';

export default function ProductList() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    const result = await axios.get("http://localhost:8080/products");
    setProducts(result.data);
  };

  const deleteProduct = async (id) => {
    await axios.delete(`http://localhost:8080/product/${id}`);
    loadProducts();
  };

  return (
    <>
      <AdminMenu />
      <div className="table-wrapper">
        <div className="d-flex justify-content-between align-items-center">
          <h4 style={{ margin: 'auto' }}>Список изделий</h4>
          <Link className="btn" style={{ backgroundColor: 'black', color: 'white' }} to={`/addproduct`}>
            Добавить изделие
          </Link>
        </div>
      </div>
      <div className='container'>
        <div className='py-4'>
          <table className="table">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Название</th>
                <th scope="col">Фото</th>
                <th scope="col">Действие</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product, index) => (
                <tr key={index}>
                  <th scope="row">{index + 1}</th>
                  <td>{product.name}</td>
                  <td>
                    <img src={`http://localhost:8080${product.photosImagePath}`} alt="нет" height="50" />
                  </td>
                  <td>
                    <Link
                      className="btn btn-outline-dark mx-2"
                      to={`/editproduct/${product.id}`}
                    >
                      Изменить
                    </Link>
                    <button
                      className="btn btn-danger mx-2"
                      onClick={() => deleteProduct(product.id)}
                    >
                      Удалить
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
