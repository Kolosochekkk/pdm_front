import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import AdminMenu from './AdminMenu';

export default function Details() {
  const [details, setDetails] = useState([]);

  useEffect(() => {
    loadDetails();
  }, []);

  const loadDetails = async () => {
    const result = await axios.get("http://localhost:8080/details");
    setDetails(result.data);
  };

  const deleteDetail = async (id) => {
    await axios.delete(`http://localhost:8080/detail/${id}`);
    loadDetails();
  };

  return (
    <>
      <AdminMenu />
      <div className="table-wrapper">
        <div className="d-flex justify-content-between align-items-center">
          <h4 style={{ margin: 'auto' }}>Список деталей</h4>
          <Link className="btn" style={{ backgroundColor: 'black', color: 'white' }} to={`/adddetail`}>
            Добавить деталь
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
                <th scope="col">Обозначение</th>
                <th scope="col">Изделие</th>
                <th scope="col">Материал</th>
                <th scope="col">Действие</th>
              </tr>
            </thead>
            <tbody>
              {details.map((detail, index) => (
                <tr key={index}>
                  <th scope="row">{index + 1}</th>
                  <td>{detail.name}</td>
                  <td>{detail.designation}</td>
                  <td>{detail.product.name}</td>
                  <td>{detail.material.name}</td>
                  <td>
                    <Link
                      className="btn btn-outline-dark mx-2"
                      to={`/editdetail/${detail.id}`}
                    >
                      Изменить
                    </Link>
                    <button
                      className="btn btn-danger mx-2"
                      onClick={() => deleteDetail(detail.id)}
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
