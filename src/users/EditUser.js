import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom';

export default function EditUser() {

    let navigate = useNavigate()

    const { id } = useParams()

    const [user, setUser] = useState({
        username: "",
        name: "",
        surname: "",
        phone: "",
        email: ""
    });

    const { name, username, email, surname, phone } = user

    const onInputChange = (e) => {

        setUser({ ...user, [e.target.name]: e.target.value });

    };

    useEffect(() => {
        loadUser()
    }, []);

    const onSubmit = async (e) => {
        e.preventDefault();
        await axios.put(`http://localhost:8080/user/${id}`, user)
        navigate("/home");
    };

    const loadUser = async () => {
        const result = await axios.get(`http://localhost:8080/user/${id}`)
        setUser(result.data)
    };

    return (
        <div className='container'>
            <div className='row'>
                <div className='col-md-6 offset-md-3 border rounded p-4 mt-2'>
                    <h4 className='text-center m-4'>Изменение пользователя</h4>

                    <form onSubmit={(e) => onSubmit(e)}>
                        <div className='mb-3'>
                            <label htmlFor='Name' className='form-label'>
                            </label>
                            <input
                                type={"text"}
                                className="form-control"
                                placeholder='Имя'
                                name='name'
                                value={name}
                                onChange={(e) => onInputChange(e)}
                            />
                        </div>
                        <div className='mb-3'>
                            <label htmlFor='Surname' className='form-label'>
                            </label>
                            <input
                                type={"text"}
                                className="form-control"
                                placeholder='Фамилия'
                                name='surname'
                                value={surname}
                                onChange={(e) => onInputChange(e)}
                            />
                        </div>
                        <div className='mb-3'>
                            <label htmlFor='Phone' className='form-label'>
                            </label>
                            <input
                                type={"text"}
                                className="form-control"
                                placeholder='Номер телефона'
                                name='phone'
                                value={phone}
                                onChange={(e) => onInputChange(e)}
                            />
                        </div>
                        <div className='mb-3'>
                            <label htmlFor='Email' className='form-label'>
                            </label>
                            <input
                                type={"text"}
                                className="form-control"
                                placeholder='Эл. почта'
                                name='email'
                                value={email}
                                onChange={(e) => onInputChange(e)}
                            />
                        </div>
                        <div className='mb-3'>
                            <label htmlFor='Username' className='form-label'>
                            </label>
                            <input
                                type={"text"}
                                className="form-control"
                                placeholder='Имя пользователя'
                                name='username'
                                value={username}
                                onChange={(e) => onInputChange(e)}
                            />
                        </div>
                        
                        <button type='submit' className='btn btn-outline-dark'>
                            Изменить
                        </button>
                        <Link className='btn btn-outline-danger mx-2' to="/home">
                            Отмена
                        </Link>
                    </form>
                </div>
            </div>
        </div>
    )
}
