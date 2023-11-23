import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link} from 'react-router-dom';
import ManagerMenu from './ManagerMenu';

const Positions = () => {
  const [positions, setPositions] = useState([]);

  useEffect(() => {
    loadPositions();
  }, []);

  const loadPositions = async () => {
    const result = await axios.get("http://localhost:8080/positions");
    setPositions(result.data);
  };

  const deletePosition = async (id) => {
    await axios.delete(`http://localhost:8080/position/${id}`);
    loadPositions();
  };

  return (
    <>
    <ManagerMenu />
    <div className="table-wrapper">
      <div className="d-flex justify-content-between align-items-center">
        <h4 style={{ margin: 'auto' }}>Список должностей</h4>
        <Link className="btn" style={{ backgroundColor: 'black', color: 'white' }} to={`/addposition`}>
          Добавить должность
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
              <th scope="col">Действие</th>
            </tr>
          </thead>
          <tbody>
            {positions.map((position, index) => (
              <tr key={index}>
                <th scope="row">{index + 1}</th>
                <td>{position.name}</td>
                <td>

                  <Link
                    className="btn btn-outline-dark mx-2"
                    to={`/editposition/${position.id}`}
                  >
                    Изменить
                  </Link>
                  <button
                    className="btn btn-danger mx-2"
                    onClick={() => deletePosition(position.id)}
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
};

export default Positions;
