import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import UserMenu from './UserMenu';

const Documentations = () => {
    const [documentations, setDocumentations] = useState([]);

    useEffect(() => {
        loadDocumentations();
    }, []);

    const loadDocumentations = async () => {
        try {
            const result = await axios.get("http://localhost:8080/documentations");
            setDocumentations(result.data);
        } catch (error) {
            console.error('Error loading documentations:', error);
        }
    };

    const deleteDocument = async (id) => {
        await axios.delete(`http://localhost:8080/documentation/${id}`);
        loadDocumentations();
    };

    const downloadDocument = async (id, title) => {
        try {
            const response = await axios.get(`http://localhost:8080/documentation/download/${id}`, {
                responseType: 'blob',
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${title}.pdf`); // Замените '.pdf' на расширение вашего файла
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error('Error downloading document:', error);
        }
    };

    return (
        <>
         <UserMenu />
            <div className="table-wrapper">
                <div className="d-flex justify-content-between align-items-center">
                    <h4 style={{ margin: 'auto' }}>Список документов</h4>
                    <Link className="btn" style={{ backgroundColor: 'black', color: 'white' }} to={`/adddocumentation`}>
                        Добавить документ
                    </Link>
                </div>
            </div>
            <div className='container'>
                <div className='py-4'>
                    <table className="table">
                        <thead>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">Заголовок</th>
                                <th scope="col">Статус</th>
                                <th scope="col">Версия</th>
                                <th scope="col">Загрузил</th>
                                <th scope="col">Утвердил</th>
                                <th scope="col">Деталь</th>
                                <th scope="col">Действия</th>
                            </tr>
                        </thead>
                        <tbody>
                            {documentations.map((documentation, index) => (
                                <tr key={index}>
                                    <th scope="row">{index + 1}</th>
                                    <td>{documentation.title}</td>
                                    <td>{documentation.status}</td>
                                    <td>{documentation.version ? documentation.version: 'No detail'}</td>
                                    <td>{documentation.uploader.username}</td>
                                    <td>{documentation.approver.username}</td>
                                    <td>{documentation.detail ? documentation.detail.name : 'No detail'}</td>
                                    <td>
                                        <Link
                                            className="btn btn-primary mx-2"
                                            to={`/viewdocumentation/${documentation.id}`}
                                        >
                                            Просмотр
                                        </Link>
                                        <button
                                            className='btn btn-success mx-2'
                                            onClick={() => downloadDocument(documentation.id, documentation.title)}
                                        >
                                            Скачать
                                        </button>
                                        <button
                                            className='btn btn-danger mx-2'
                                            onClick={() => deleteDocument(documentation.id)}
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

export default Documentations;
