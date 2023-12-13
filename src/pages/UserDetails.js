import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import UserMenu from './UserMenu';
import '../styles/Details.css';
import 'jspdf-autotable';

const UserDetails = () => {
  const [product, setProduct] = useState({});
  const [details, setDetails] = useState([]);
  const [selectedDetail, setSelectedDetail] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [plans, setPlans] = useState([]);
  const [materials, setMaterials] = useState([]);
  const { id } = useParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [showDocuments, setShowDocuments] = useState(false);
  const [showSpecificationTable, setShowSpecificationTable] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [showAddDocumentButton, setShowAddDocumentButton] = useState(false);

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
    setShowAddDocumentButton(true);
  };

  const handleProductClick = async (productId) => {
    setSelectedProduct(productId);
    try {
      const response = await axios.get(`http://localhost:8080/documentations/product/${productId}`);
      setDocuments(response.data);
    } catch (error) {
      console.error('Error fetching documentations:', error);
    }
    setShowDocuments(true);
    setShowSpecificationTable(false);
    setShowAddDocumentButton(true);
  };

  const handleDocumentsClick = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/documentations/detail/${selectedDetail}`);
      setDocuments(response.data);
      setShowDocuments(true);
      setShowSpecificationTable(false);
      setShowAddDocumentButton(true);
    } catch (error) {
      console.error('Error fetching documentations:', error);
    }
  };

  const handleProductDocumentsClick = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/documentations/product/${selectedProduct}`);
      setDocuments(response.data);
      setShowDocuments(true);
      setShowSpecificationTable(false);
      setShowAddDocumentButton(true);
    } catch (error) {
      console.error('Error fetching documentations:', error);
    }
  };

  const handleDrawingsClick = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/plans/detail/${selectedDetail}`);
      setPlans(response.data);
      setShowDocuments(false);
      setShowSpecificationTable(false);
    } catch (error) {
      console.error('Error fetching plans:', error);
    }
  };

  const handleProductDrawingsClick = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/plans/product/${selectedProduct}`);
      setPlans(response.data);
      setShowDocuments(false);
      setShowSpecificationTable(false);
    } catch (error) {
      console.error('Error fetching plans:', error);
    }
  };

  const handleSpecificationClick = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/materials/product/${id}`);
      setMaterials(response.data);
    } catch (error) {
      console.error('Error fetching materials:', error);
    }
  
    setShowDocuments(false);
    setShowSpecificationTable(true);
    setSelectedDetail(null);
    setShowAddDocumentButton(false);
  };
  

  const handleDownloadPDF = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/materials/product/download/${id}`, {
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'materials.pdf');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading PDF:', error);
    }
  };

  const viewPlan = (plan) => {
    setSelectedPlan(plan);
    setModalVisible(true);
  };

  const ImageViewerModal = ({ plan, onClose }) => {
    console.log('Plan Path:', plan.planFilePath);
    return (
      <div className="modal">
        <div className="modal-content">
          <span className="close" onClick={onClose}>
            &times;
          </span>
          <img className="modal-image" src={`http://localhost:8080${plan.planFilePath}`} alt="нет" height="50" />
        </div>
      </div>
    );
  };

  const filteredDetails = details.filter((detail) => detail.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const downloadDocument = async (document) => {
    try {
      const response = await axios.get(`http://localhost:8080/documentation/download/${document.id}`, {
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${document.title}.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading document:', error);
    }
  };

  const deleteDocument = async (documentId) => {
    try {
      await axios.delete(`http://localhost:8080/documentation/${documentId}`);
      handleDocumentsClick();
    } catch (error) {
      console.error('Error deleting document:', error);
    }
  };

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
              className={`detail-item ${selectedProduct === product.id ? 'selected-detail' : ''}`}
              onClick={() => {
                handleProductClick(product.id);
                setSelectedDetail(null);
              }}
            >
              {product.name}
            </h6>
            <h6 style={{ textAlign: 'left' }}>Детали</h6>
            {filteredDetails.map((detail, index) => (
              <div
                key={index}
                className={`detail-item ${selectedDetail === detail.id ? 'selected-detail' : ''}`}
                onClick={() => {
                  handleDetailClick(detail.id);
                  setSelectedProduct(null);
                }}
              >
                {detail.name}
              </div>
            ))}
          </div>
          <div className="col-md-9" style={{ padding: '10px' }}>
            <div className="d-flex mb-3">
              {selectedDetail && (
                <>
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
                </>
              )}
              {selectedProduct && (
                <>
                  <button
                    type="button"
                    className={`btn btn-secondary mx-1 ${showDocuments ? 'active' : ''}`}
                    onClick={handleProductDocumentsClick}
                  >
                    Документы
                  </button>
                  <button
                    type="button"
                    className={`btn btn-secondary mx-1 ${!showDocuments ? 'active' : ''}`}
                    onClick={handleProductDrawingsClick}
                  >
                    Чертежи
                  </button>
                  <button
                    type="button"
                    className={`btn btn-secondary mx-1 ${!showSpecificationTable ? 'active' : ''}`}
                    onClick={() => {
                      handleSpecificationClick(); // <- Add parentheses to invoke the function
                      setShowDocuments(false);
                    }}
                  >
                    Спецификации
                  </button>

                </>
              )}
              {/* {showSpecificationTable && (
                <button type="button" className={`btn btn-secondary mx-1`} onClick={handleSpecificationClick}>
                  Спецификации
                </button>
              )} */}
            </div>
            {showDocuments && selectedDetail && (
              <table className="table">
                <thead>
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">Заголовок</th>
                    <th scope="col">Статус</th>
                    <th scope="col">Версия</th>
                    <th scope="col">Действия</th>
                  </tr>
                </thead>
                <tbody>
                  {documents.map((document, index) => (
                    <tr key={index}>
                      <th scope="row">{index + 1}</th>
                      <td>{document.title}</td>
                      <td>{document.status}</td>
                      <td>{document.version ? document.version : 'No detail'}</td>
                      <td>
                        <Link className="btn btn-primary mx-2" to={`/viewdocumentation/${document.id}`}>
                          Просмотр
                        </Link>
                        <button className="btn btn-success mx-2" onClick={() => downloadDocument(document)}>
                          Скачать
                        </button>
                        <button className="btn btn-danger mx-2" onClick={() => deleteDocument(document.id)}>
                          Удалить
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            {showDocuments && selectedProduct && (
              <table className="table">
                <thead>
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">Заголовок</th>
                    <th scope="col">Статус</th>
                    <th scope="col">Версия</th>
                    <th scope="col">Действия</th>
                  </tr>
                </thead>
                <tbody>
                  {documents.map((document, index) => (
                    <tr key={index}>
                      <th scope="row">{index + 1}</th>
                      <td>{document.title}</td>
                      <td>{document.status}</td>
                      <td>{document.version ? document.version : 'No detail'}</td>
                      <td>
                        <Link className="btn btn-primary mx-2" to={`/viewdocumentation/${document.id}`}>
                          Просмотр
                        </Link>
                        <button className="btn btn-success mx-2" onClick={() => downloadDocument(document)}>
                          Скачать
                        </button>
                        <button className="btn btn-danger mx-2" onClick={() => deleteDocument(document.id)}>
                          Удалить
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            {!showDocuments && selectedDetail && (
              <table className="table">
                <thead>
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">Заголовок</th>
                    <th scope="col">Статус</th>
                    <th scope="col">Версия</th>
                    <th scope="col">Действия</th>
                  </tr>
                </thead>
                <tbody>
                  {plans.map((plan, index) => (
                    <tr key={index}>
                      <th scope="row">{index + 1}</th>
                      <td>{plan.title}</td>
                      <td>{plan.status}</td>
                      <td>{plan.version ? plan.version : 'No detail'}</td>
                      <td>
                        <button className="btn btn-primary mx-2" onClick={() => viewPlan(plan)}>
                          Просмотр
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            {!showDocuments && selectedProduct && (
              <table className="table">
                <thead>
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">Заголовок</th>
                    <th scope="col">Статус</th>
                    <th scope="col">Версия</th>
                    <th scope="col">Действия</th>
                  </tr>
                </thead>
                <tbody>
                  {plans.map((plan, index) => (
                    <tr key={index}>
                      <th scope="row">{index + 1}</th>
                      <td>{plan.title}</td>
                      <td>{plan.status}</td>
                      <td>{plan.version ? plan.version : 'No detail'}</td>
                      <td>
                        <button className="btn btn-primary mx-2" onClick={() => viewPlan(plan)}>
                          Просмотр
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {!showDocuments && showSpecificationTable &&(
              <div>
                <table id="specification-table" className="table">
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
                <button type="button" className="btn btn-primary" onClick={handleDownloadPDF}>
                  Скачать
                </button>
              </div>
            )}
            {modalVisible && selectedPlan && <ImageViewerModal plan={selectedPlan} onClose={() => setModalVisible(false)} />}
            {showAddDocumentButton && (
              <Link className="btn" style={{ backgroundColor: 'black', color: 'white' }} to={`/adddocumentation`}>
                Добавить документ
              </Link>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default UserDetails;
