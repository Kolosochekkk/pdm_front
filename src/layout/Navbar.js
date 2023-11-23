import React from 'react'
import { Link } from 'react-router-dom'

export default function Navbar() {
    return (
        <div><nav className="navbar navbar-expand-lg bg-body-tertiary">
            <div className="container-fluid">
                <a className="navbar-brand" href="#">PDM System</a>
                {/* <Link className="btn btn-outline-dark" to="/products">Добавить пользователя</Link> */}
            </div>
        </nav>
        </div>
    )
}
