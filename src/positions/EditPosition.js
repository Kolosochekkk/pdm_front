import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

const EditPosition = () => {
  const { id } = useParams();
  let navigate = useNavigate();
  
  const [position, setPosition] = useState({
    name: '',
  });

  useEffect(() => {
    loadPosition();
  }, [id]);

  const loadPosition = async () => {
    const result = await axios.get(`http://localhost:8080/position/${id}`);
    setPosition(result.data);
  };

  const handleChange = (e) => {
    setPosition({
      ...position,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.put(`http://localhost:8080/position/${id}`, position);
    navigate('/positions');
  };

  return (
    <>
      
      <div className="container">
        <div className="py-4">
          <h2>Изменить Должность</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="name" className="form-label">Название</label>
              <input
                type="text"
                className="form-control"
                id="name"
                name="name"
                value={position.name}
                onChange={handleChange}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary">Сохранить</button>
            <Link className="btn btn-outline-danger mx-2" to="/positions">Отмена</Link>
          </form>
        </div>
      </div>
    </>
  );
};

export default EditPosition;
