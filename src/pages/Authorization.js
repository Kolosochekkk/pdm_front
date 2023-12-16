import React, { useState } from 'react';
import axios from 'axios';
import {Link, useNavigate } from 'react-router-dom';
//import "../styles/Back.css";

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    axios
      .post('http://localhost:8080/loginuser', { username, password })
      .then((response) => {
        if (response.data.roles.includes('MANAGER')) {
          localStorage.setItem('user', JSON.stringify(response.data));
          navigate('/users');
        } else if (response.data.roles.includes('ADMIN')) {
          localStorage.setItem('user', JSON.stringify(response.data));
          navigate('/adminhome');
        } else {
          localStorage.setItem('user', JSON.stringify(response.data));
          navigate('/userhome');
        }
      })
      .catch((error) => {
        setError('Данные введены неверно!');
      });
  };

  return (
    <div className="my-background">
    <form onSubmit={handleSubmit}>
      <div
        className="container d-flex justify-content-center align-items-center"
        style={{ height: '100vh' }}
      >
        <div className="card p-5">
          <h2 className="text-center mb-5">Авторизация</h2>
          <div className="mb-3">
            <label htmlFor="username" className="form-label">
              Имя пользователя:
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="Введите имя пользователя"
              id="username"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Пароль:
            </label>
            <input
              type="password"
              className="form-control"
              placeholder="Введите пароль"
              id="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>
          {error && <div className="alert alert-danger">{error}</div>}
          <button type="submit" className="btn btn-outline-dark w-100 mt-4">
            Войти
          </button>
          <Link className='btn mx-2' to="/register" style={{ color: 'blue' }}>Нет аккаунта? Зарегистрируйся!</Link>

        </div>
      </div>
    </form>
    </div>
  );
}

export default Login;
