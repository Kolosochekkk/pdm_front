import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function AddDetail() {
    let navigate = useNavigate();

    const [detail, setDetail] = useState({
        name: '',
        designation: '',
        productId: '',
        materialId: '',
        quantity: '',
        materialQuantity: '',
    });

    const [products, setProducts] = useState([]);
    const [materials, setMaterials] = useState([]);

    const userData = JSON.parse(localStorage.getItem('user'));
    const uploaderId = userData.id;

    useEffect(() => {
        // Загрузка изделий и материалов с сервера при монтировании компонента
        axios.get('http://localhost:8080/products')
            .then(response => setProducts(response.data))
            .catch(error => console.error('Ошибка при загрузке изделий:', error));

        axios.get('http://localhost:8080/materials')
            .then(response => setMaterials(response.data))
            .catch(error => console.error('Ошибка при загрузке материалов:', error));
    }, []);

    const { name, designation, productId, materialId, quantity, materialQuantity } = detail;

    const onInputChange = (e) => {
        setDetail({ ...detail, [e.target.name]: e.target.value });
    };

    const onSubmit = async (e) => {
        e.preventDefault();

        // Передача как productId, так и materialId в теле запроса при создании новой детали
        await axios.post(`http://localhost:8080/detail/${productId}/${materialId}/${uploaderId}`, { ...detail });
        navigate('/details'); // Предполагается, что есть маршрут для просмотра деталей
    };

    return (
        <div className='container'>
            <div className='row'>
                <div className='col-md-6 offset-md-3 border rounded p-4 mt-2'>
                    <h4 className='text-center m-4'>Добавление детали</h4>

                    <form onSubmit={(e) => onSubmit(e)}>
                        <div className='mb-3'>
                            <label htmlFor='Name' className='form-label'>Название детали</label>
                            <input
                                type='text'
                                className='form-control'
                                placeholder='Название детали'
                                name='name'
                                value={name}
                                onChange={(e) => onInputChange(e)}
                            />
                        </div>

                        <div className='mb-3'>
                            <label htmlFor='Designation' className='form-label'>Обозначение</label>
                            <input
                                type='text'
                                className='form-control'
                                placeholder='Обозначение'
                                name='designation'
                                value={designation}
                                onChange={(e) => onInputChange(e)}
                            />
                        </div>

                        <div className='mb-3'>
                            <label htmlFor='Product' className='form-label'>Изделие</label>
                            <select
                                className='form-control'
                                name='productId'
                                value={productId}
                                onChange={(e) => onInputChange(e)}
                            >
                                <option value='' disabled>Выберите изделие</option>
                                {products.map(product => (
                                    <option key={product.id} value={product.id}>{product.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className='mb-3'>
                            <label htmlFor='Quantity' className='form-label'>Количество</label>
                            <input
                                type='number'
                                className='form-control'
                                placeholder='Количество'
                                name='quantity'
                                value={quantity}
                                onChange={(e) => onInputChange(e)}
                                required
                            />
                        </div>
                        <div className='mb-3'>
                            <label htmlFor='Material' className='form-label'>Материал</label>
                            <select
                                className='form-control'
                                name='materialId'
                                value={materialId}
                                onChange={(e) => onInputChange(e)}
                            >
                                <option value='' disabled>Выберите материал</option>
                                {materials.map(material => (
                                    <option key={material.id} value={material.id}>{material.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className='mb-3'>
                            <label htmlFor='MaterialQuantity' className='form-label'>Количество материала</label>
                            <input
                                type='number'
                                className='form-control'
                                placeholder='Количество материала'
                                name='materialQuantity'
                                value={materialQuantity}
                                onChange={(e) => onInputChange(e)}
                                required
                            />
                        </div>
                        <button type='submit' className='btn btn-outline-dark'>
                            Добавить
                        </button>
                        <Link className='btn btn-outline-danger mx-2' to='/details'>
                            Отмена
                        </Link>
                    </form>
                </div>
            </div>
        </div>
    );
}
