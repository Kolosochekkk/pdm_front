import React from "react";
import { Link } from "react-router-dom";
import "../styles/Menu.css";

export default function UserMenu() {
  return (
    <header className="menu">
      <nav>
        <ul>
          <li>
            <Link to="/userHome">Изделия</Link>
          </li>
          {/* <li>
            <Link to="/documentations">Документы</Link>
          </li>
          <li>
            <Link to="/plans">Чертежи</Link>
          </li> */}
          <li>
            <Link to="/materials">Материалы</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
