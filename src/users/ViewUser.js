import axios from "axios";
import React, { useEffect,useState } from "react";
import { Link, useParams } from "react-router-dom";

export default function ViewUser() {
  const [user, setUser] = useState({
    name: "",
    username: "",
    email: "",
  });

  const { id } = useParams();

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    const result = await axios.get(`http://localhost:8080/user/${id}`);
    setUser(result.data);
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-6 offset-md-3 border rounded p-4 mt-2 shadow">
          <h2 className="text-center m-4">Просмотр данных пользователя</h2>

          <div className="card">
            <div className="card-header">
              
              <ul className="list-group list-group-flush">
                <li className="list-group-item">
                  <b>Имя: </b>
                  {user.name}
                </li>
                <li className="list-group-item">
                  <b>Фамилия: </b>
                  {user.surname}
                </li>
                <li className="list-group-item">
                  <b>Номер телефона: </b>
                  {user.phone}
                </li>
                <li className="list-group-item">
                  <b>Эл. почта: </b>
                  {user.email}
                </li>
                <li className="list-group-item">
                  <b>Имя пользователя: </b>
                  {user.username}
                </li>
              </ul>
            </div>
          </div>
          <Link className="btn btn-primary my-2" to={"/home"}>
            Назад
          </Link>
        </div>
      </div>
    </div>
  );
}