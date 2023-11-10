import axios from 'axios';
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';

export default function AddUser() {

    let navigate = useNavigate()

    const [user, setUser] = useState({
        username: "",
        password: "",
        name: "",
        surname: "",
        phone: "",
        email: "",
        role: "USER"
    })

    const { username, password, name, surname, phone, email, role } = user

    const onInputChange = (e) => {

        setUser({ ...user, [e.target.name]: e.target.value });

    }

    const onSubmit = async (e) => {
        e.preventDefault();

        if (user.role === "ADMIN") {
            user.roles = ["ADMIN"];
        } else {
            user.roles = ["USER"];
        }
        await axios.post("http://localhost:8080/user", user);
        navigate("/home");
    };

    return (
        <div className='container'>
            <div className='row'>
                <div className='col-md-6 offset-md-3 border rounded p-4 mt-2'>
                    <h4 className='text-center m-4'>Добавление пользователя</h4>

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
                            <label htmlFor='Surname' className='form-label'></label>
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
                        <div className='mb-3'>
                            <label htmlFor='Password' className='form-label'>
                            </label>
                            <input
                                type={"text"}
                                className="form-control"
                                placeholder='Пароль'
                                name='password'
                                value={password}
                                onChange={(e) => onInputChange(e)}
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="Role" className="form-label">Роль</label>
                            <select className="form-control" name="role" value={role} onChange={(e) => onInputChange(e)}>
                                <option value="USER">Пользователь</option>
                                <option value="ADMIN">Администратор</option>
                            </select>
                        </div>

                        <button type='submit' className='btn btn-outline-dark'>
                            Добавить
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
