import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import UserMenu from './UserMenu';

export default function UserHome() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const { id } = useParams();

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    const result = await axios.get('http://localhost:8080/products');
    setProducts(result.data);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <UserMenu />
      <div className='container'>
        <h3 style={{ textAlign: 'center', margin: 'auto' }}>Список изделий</h3>
  
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
            <div className='col-sm-6 col-md-4 col-lg-3' key={index} style={{ padding: '5px' }}>
              <div className='card h-100' >
                <div className="text-center">
                  <img src={`http://localhost:8080${product.photosImagePath}`} className='card-img-top' alt='...' />
                </div>
                <div className='card-body'>
                  <h5 className='card-title'>{product.name}</h5>
                  {/* Добавьте дополнительные поля, если необходимо */}
                  <Link className='btn btn-primary' to={`/userdetails/${product.id}`}>
                    Просмотреть
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
