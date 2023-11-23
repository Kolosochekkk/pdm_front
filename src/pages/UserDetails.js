import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import UserMenu from './UserMenu';
import "../styles/Details.css";

const UserDetails = () => {
    const [product, setProduct] = useState({});
    const [details, setDetails] = useState([]);
    const [selectedDetail, setSelectedDetail] = useState(null);
    const [documents, setDocuments] = useState([]);
    const [plans, setPlans] = useState([]);
    const [materials, setMaterials] = useState([]);
    const { id } = useParams();
    const [searchTerm, setSearchTerm] = useState('');
    const [showDocuments, setShowDocuments] = useState(true);
    const [showSpecificationTable, setShowSpecificationTable] = useState(false);

    useEffect(() => {
        const loadProductAndDetails = async () => {
            const productResult = await axios.get(`http://localhost:8080/product/${id}`);
            setProduct(productResult.data);
            const detailsResult = await axios.get(`http://localhost:8080/details/product/${id}`);
            setDetails(detailsResult.data);
        };

        loadProductAndDetails();
    }, [id]);

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleDetailClick = async (detailId) => {
        setSelectedDetail(detailId);
        try {
            const response = await axios.get(`http://localhost:8080/documentations/detail/${detailId}`);
            setDocuments(response.data);
        } catch (error) {
            console.error('Error fetching documentations:', error);
        }
        setShowDocuments(true);
        setShowSpecificationTable(false);
    };

    const handleDocumentsClick = () => {
        setShowDocuments(true);
        setShowSpecificationTable(false);
        setSelectedDetail(null);
    };

    const handleDrawingsClick = async () => {
        setShowDocuments(false);
        try {
            const response = await axios.get(`http://localhost:8080/plans/detail/${selectedDetail}`);
            setPlans(response.data);
        } catch (error) {
            console.error('Error fetching plans:', error);
        }
        setShowSpecificationTable(false);
    };

    const handleSpecificationClick = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/materials/product/${id}`);
            setMaterials(response.data);
            setShowDocuments(false);
            setShowSpecificationTable(true);
        } catch (error) {
            console.error('Error fetching materials:', error);
        }
    };

    const filteredDetails = details.filter((detail) =>
        detail.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <>
            <UserMenu />
            <div className="container-fluid">
                <div className="row" style={{ padding: '10px' }}>
                    <div className="col-md-3">
                        <input
                            className="form-control mb-2"
                            type="search"
                            placeholder="Поиск"
                            aria-label="Search"
                            value={searchTerm}
                            onChange={handleSearchChange}
                            style={{ fontSize: '12px' }}
                        />
                        <h6 style={{ textAlign: 'left' }}>Изделие</h6>
                        <h6
                            onClick={handleSpecificationClick}
                            style={{
                                cursor: 'pointer',
                                textDecoration: showSpecificationTable ? 'underline' : 'none',
                            }}
                        >
                            {product.name}
                        </h6>
                        <h6 style={{ textAlign: 'left' }}>Детали</h6>
                        {filteredDetails.map((detail, index) => (
                            <div
                                key={index}
                                className={`detail-item ${selectedDetail === detail.id ? 'selected-detail' : ''}`}
                                onClick={() => handleDetailClick(detail.id)}
                            >
                                {detail.name}
                            </div>
                        ))}
                    </div>
                    <div className="col-md-9" style={{ padding: '10px' }}>
                        <div className="d-flex mb-3">
                            <button
                                type="button"
                                className={`btn btn-secondary mx-1 ${showDocuments ? 'active' : ''}`}
                                onClick={handleDocumentsClick}
                            >
                                Документы
                            </button>
                            <button
                                type="button"
                                className={`btn btn-secondary mx-1 ${!showDocuments ? 'active' : ''}`}
                                onClick={handleDrawingsClick}
                            >
                                Чертежи
                            </button>
                            {showSpecificationTable && (
                                <button
                                    type="button"
                                    className={`btn btn-secondary mx-1`}
                                    onClick={handleSpecificationClick}
                                >
                                    Спецификации
                                </button>
                            )}
                        </div>
                        {(showDocuments && selectedDetail) && (
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th scope="col">#</th>
                                        <th scope="col">Заголовок</th>
                                        <th scope="col">Статус</th>
                                        <th scope="col">Версия</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {documents.map((document, index) => (
                                        <tr key={index}>
                                            <th scope="row">{index + 1}</th>
                                            <td>{document.title}</td>
                                            <td>{document.status}</td>
                                            <td>{document.version ? document.version : 'No detail'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                        {(!showDocuments && selectedDetail) && (
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th scope="col">#</th>
                                        <th scope="col">Заголовок</th>
                                        <th scope="col">Статус</th>
                                        <th scope="col">Версия</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {plans.map((plan, index) => (
                                        <tr key={index}>
                                            <th scope="row">{index + 1}</th>
                                            <td>{plan.title}</td>
                                            <td>{plan.status}</td>
                                            <td>{plan.version ? plan.version : 'No detail'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                        {showSpecificationTable && (
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th scope="col">#</th>
                                        <th scope="col">Материал</th>
                                        <th scope="col">Марка материала</th>
                                        <th scope="col">ГОСТ</th>
                                        <th scope="col">Ед.измерения</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {materials.map((material, index) => (
                                        <tr key={index}>
                                            <th scope="row">{index + 1}</th>
                                            <td>{material.name}</td>
                                            <td>{material.mark}</td>
                                            <td>{material.gost}</td>
                                            <td>{material.unit.name}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default UserDetails;
