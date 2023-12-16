import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import AdminMenu from './AdminMenu';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

export default function AdminHome() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const result = await axios.get('http://localhost:8080/products');
      setProducts(result.data.map(product => ({
        ...product,
        details: [],
        percentageOfApprovedDocuments: 0,
        percentageOfApprovedDrawings: 0,
      })));

      // Вызов fetchData для каждого продукта при загрузке страницы
      result.data.forEach((product) => fetchData(product.id));
    } catch (error) {
      console.error("Ошибка при загрузке данных:", error);
    }
  };

  const fetchData = async (id) => {
    try {
      const detailsResult = await axios.get(`http://localhost:8080/details/product/${id}`);
      const detailsData = detailsResult.data;

      if (Array.isArray(detailsData.details)) {
        // Обновите состояние для деталей и процентов для каждого продукта отдельно
        setProducts((prevProducts) =>
          prevProducts.map((product) =>
            product.id === id
              ? {
                ...product,
                details: detailsData.details,
                percentageOfApprovedDocuments: detailsData.percentageOfApprovedDocuments,
                percentageOfApprovedDrawings: detailsData.percentageOfApprovedDrawings,
              }
              : product
          )
        );
      }
    } catch (error) {
      console.error("Ошибка при загрузке данных:", error);
    }
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const deleteProduct = (id) => {
    confirmAlert({
      title: <h2 style={{ fontSize: '24px' }}>Подтверждение удаления</h2>,
      message: (
        <div>
          <p>Вы уверены, что хотите удалить это изделие?</p>
          <small>Это действие нельзя будет отменить.</small>
        </div>
      ),
      buttons: [
        {
          label: <span style={{ fontSize: '14px' }}>Да</span>,
          onClick: async () => {
            try {
              await axios.delete(`http://localhost:8080/product/${id}`);
              loadProducts();
            } catch (error) {
              console.error('Ошибка удаления документа:', error);
            }
          },
        },
        {
          label: <span style={{ fontSize: '14px' }}>Нет</span>,
          onClick: () => { },
        },
      ],
    });
  };

  return (
    <>
      <AdminMenu />
      <div className='d-flex justify-content-end'>
        <Link className="btn" style={{ backgroundColor: 'black', color: 'white', marginLeft: 'auto' }} to={`/addproduct`}>
          Добавить изделие
        </Link>
      </div>
      <div className='container'>
        <h4 style={{ textAlign: 'center'}}>Список изделий</h4>
        <div className='row mt-4'>
          <div className='col-md-12 mb-3'>
            <form className='form-inline'>
              <input
                className='form-control mr-sm-2'
                type='search'
                placeholder='Поиск по названию'
                aria-label='Search'
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </form>
          </div>
          {filteredProducts.map((product, index) => (
            <div className='col-sm-6 col-md-4 col-lg-3' key={index} style={{ padding: '5px', height: '420px' }}>
              <div className='card h-100 d-flex flex-column justify-content-between'>
                <div className="text-center">
                  <img src={`http://localhost:8080${product.photosImagePath}`} className='card-img-top' alt='...' style={{ height: '270px', objectFit: 'cover' }} />
                </div>
                <div className='card-body'>
                  <h5 className='card-title'>{product.name}</h5>
                  <div className="percentage-bar" style={{ width: '200px', height: '20px', borderRadius: '10px', border: '1px solid #ddd', overflow: 'hidden', position: 'relative', margin: 'auto' }}>
                    <div
                      className="filler"
                      style={{
                        width: `${((product.percentageOfApprovedDocuments + product.percentageOfApprovedDrawings) / 2).toFixed(2)}%`,
                        height: '100%',
                        background: 'linear-gradient(to right, #4CAF50, #45a049)',  // Градиент для заполнения
                        position: 'absolute',
                        top: 0,
                        left: 0,
                      }}
                    />
                    <div className="percentage-text" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: '#333' }}>
                      {((product.percentageOfApprovedDocuments + product.percentageOfApprovedDrawings) / 2).toFixed(2)}%
                    </div>
                  </div>


                </div>
                <div className='text-center' style={{ marginBottom: '20px' }}>
                  <Link className='btn btn-primary' to={`/admindetails/${product.id}`} style={{ width: '100px' }}>
                    Просмотр
                  </Link>
                  <Link
                    className="btn btn-outline-dark mx-2"
                    to={`/editproduct/${product.id}`}
                  >
                    Изменить
                  </Link>
                  <button
                    className="btn btn-danger"
                    onClick={() => deleteProduct(product.id)}
                  >
                    Удалить
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
