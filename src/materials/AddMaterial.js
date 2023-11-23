import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function AddMaterial() {
    let navigate = useNavigate();

    const [material, setMaterial] = useState({
        name: '',
        mark: '',
        gost: '',
        unitId: '', // New state for the selected unit
    });

    const [units, setUnits] = useState([]);

    useEffect(() => {
        // Load the list of units from the server on component mount
        axios.get('http://localhost:8080/units')
            .then(response => setUnits(response.data))
            .catch(error => console.error('Error loading units:', error));
    }, []);

    const { name, mark, gost, unitId } = material;

    const onInputChange = (e) => {
        setMaterial({ ...material, [e.target.name]: e.target.value });
    };

    const onSubmit = async (e) => {
        e.preventDefault();

        // Pass unitId in the request body when creating a new material
        await axios.post(`http://localhost:8080/material/${unitId}`, { ...material });
        navigate('/materials'); // Assuming there is a route to view materials
    };

    return (
        <div className='container'>
            <div className='row'>
                <div className='col-md-6 offset-md-3 border rounded p-4 mt-2'>
                    <h4 className='text-center m-4'>Добавление материала</h4>

                    <form onSubmit={(e) => onSubmit(e)}>
                        <div className='mb-3'>
                            <label htmlFor='Name' className='form-label'>Название материала</label>
                            <input
                                type='text'
                                className='form-control'
                                placeholder='Название материала'
                                name='name'
                                value={name}
                                onChange={(e) => onInputChange(e)}
                            />
                        </div>

                        <div className='mb-3'>
                            <label htmlFor='Mark' className='form-label'>Марка</label>
                            <input
                                type='text'
                                className='form-control'
                                placeholder='Марка'
                                name='mark'
                                value={mark}
                                onChange={(e) => onInputChange(e)}
                            />
                        </div>

                        <div className='mb-3'>
                            <label htmlFor='Gost' className='form-label'>ГОСТ</label>
                            <input
                                type='text'
                                className='form-control'
                                placeholder='GOST'
                                name='gost'
                                value={gost}
                                onChange={(e) => onInputChange(e)}
                            />
                        </div>

                        <div className='mb-3'>
                            <label htmlFor='Unit' className='form-label'>Единица измерения</label>
                            <select
                                className='form-control'
                                name='unitId'
                                value={unitId}
                                onChange={(e) => onInputChange(e)}
                            >
                                <option value='' disabled>Выберите единицу измерения</option>
                                {units.map(unit => (
                                    <option key={unit.id} value={unit.id}>{unit.name}</option>
                                ))}
                            </select>
                        </div>

                        <button type='submit' className='btn btn-outline-dark'>
                            Добавить
                        </button>
                        <Link className='btn btn-outline-danger mx-2' to='/materials'>
                            Отмена
                        </Link>
                    </form>
                </div>
            </div>
        </div>
    );
}
