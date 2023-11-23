import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Link, useParams } from 'react-router-dom';
import ManagerMenu from './ManagerMenu';


export default function Users() {
    const [users, setUsers] = useState([])

    const { id } = useParams()

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        const result = await axios.get("http://localhost:8080/users");
        setUsers(result.data);
    };

    const deleteUser = async (id) => {
        await axios.delete(`http://localhost:8080/user/${id}`)
        loadUsers()
    }

    return (
        <>
            <ManagerMenu />

            <div className="table-wrapper">
                <div className="d-flex justify-content-between align-items-center">
                    <h4 style={{ margin: 'auto' }}>Список пользователей</h4>
                    <Link className="btn" style={{ backgroundColor: 'black', color: 'white' }} to={`/adduser`}>
                        Добавить пользователя
                    </Link>
                </div>
            </div>
            <div className='container'>
                <div className='py-4'>
                    <table className="table border">
                        <thead>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">Имя</th>
                                <th scope="col">Фамилия</th>
                                <th scope="col">Роль</th>
                                <th scope="col">Действие</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                users.map((user, index) => (
                                    <tr>
                                        <th scope="row" key={index}>{index + 1}</th>
                                        <td>{user.name}</td>
                                        <td>{user.surname}</td>
                                        <td>{user.roles}</td>
                                        <td>
                                            <Link
                                                className="btn btn-primary mx-2"
                                                to={`/viewuser/${user.id}`}
                                            >
                                                Просмотр
                                            </Link>
                                            <Link className='btn btn-outline-primary mx-2'
                                                to={`/edituser/${user.id}`}>
                                                Изменить
                                            </Link>
                                            <button className='btn btn-danger mx-2'

                                                onClick={() => deleteUser(user.id)}
                                            >Удалить
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    )
}
