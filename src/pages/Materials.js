import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import AdminMenu from './AdminMenu';

export default function Materials() {
  const [materials, setMaterials] = useState([]);

  useEffect(() => {
    loadMaterials();
  }, []);

  const loadMaterials = async () => {
    const result = await axios.get("http://localhost:8080/materials");
    setMaterials(result.data);
  };

  const deleteMaterial = async (id) => {
    await axios.delete(`http://localhost:8080/material/${id}`);
    loadMaterials();
  };

  return (
    <>
      <AdminMenu />
      <div className="table-wrapper">
        <div className="d-flex justify-content-between align-items-center">
          <h4 style={{ margin: 'auto' }}>Список материалов</h4>
          <Link className="btn" style={{ backgroundColor: 'black', color: 'white' }} to={`/addmaterial`}>
            Добавить материал
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
                <th scope="col">Марка</th>
                <th scope="col">ГОСТ</th>
                <th scope="col">Ед. измерения</th>
                <th scope="col">Действие</th>
              </tr>
            </thead>
            <tbody>
              {materials.map((material, index) => (
                <tr key={index}>
                  <th scope="row">{index + 1}</th>
                  <td>{material.name}</td>
                  <td>{material.mark}</td>
                  <td>{material.gost}</td>
                  <td>{material.unit ? material.unit.name : 'Неизвестно'}</td>
                  <td>
                    <Link
                      className="btn btn-outline-dark mx-2"
                      to={`/editmaterial/${material.id}`}
                    >
                      Изменить
                    </Link>
                    <button
                      className="btn btn-danger mx-2"
                      onClick={() => deleteMaterial(material.id)}
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
