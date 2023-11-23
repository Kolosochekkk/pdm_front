import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';

export default function UpdateDetail() {
    let navigate = useNavigate();
    const { id } = useParams();

    const [detail, setDetail] = useState({
        name: '',
        designation: '',
        productId: '',
        materialId: ''
    });

    const [products, setProducts] = useState([]);
    const [materials, setMaterials] = useState([]);

    useEffect(() => {
        // Получение данных детали по предоставленному id
        axios.get(`http://localhost:8080/detail/${id}`)
            .then(response => setDetail(response.data))
            .catch(error => console.error('Ошибка при получении данных детали:', error));

        // Получение списка изделий для выпадающего списка
        axios.get('http://localhost:8080/products')
            .then(response => setProducts(response.data))
            .catch(error => console.error('Ошибка при получении списка изделий:', error));

        // Получение списка материалов для выпадающего списка
        axios.get('http://localhost:8080/materials')
            .then(response => setMaterials(response.data))
            .catch(error => console.error('Ошибка при получении списка материалов:', error));
    }, [id]);

    const { name, designation, productId, materialId } = detail;

    const onInputChange = (e) => {
        setDetail({ ...detail, [e.target.name]: e.target.value });
    };

    const onSubmit = async (e) => {
        e.preventDefault();

        // Обновление данных детали с использованием запроса PUT и параметров запроса
        await axios.put(`http://localhost:8080/detail/${id}?productId=${productId}&materialId=${materialId}`, {
            name,
            designation,
            product: { id: productId },
            material: { id: materialId }
        });
        navigate('/details');
    };

    return (
        <div className='container'>
            <div className='row'>
                <div className='col-md-6 offset-md-3 border rounded p-4 mt-2'>
                    <h4 className='text-center m-4'>Изменение детали</h4>

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

                        <button type='submit' className='btn btn-outline-dark'>
                            Изменить
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
