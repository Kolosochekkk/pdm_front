import React from "react";
import { Link } from "react-router-dom";
import "../styles/Menu.css";

export default function AdminMenu() {
  return (
    <header className="menu">
      <nav>
        <ul>
          <li>
            <Link to="/adminhome">Изделия</Link>
          </li>
          <li>
            <Link to="/details">Детали</Link>
          </li>
          <li>
            <Link to="/admindocumentations">Документы</Link>
          </li>
          <li>
            <Link to="/adminplans">Чертежи</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
