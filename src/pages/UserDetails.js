import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import UserMenu from './UserMenu';
import '../styles/Details.css';
import 'jspdf-autotable';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';



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
  const [showPlans, setShowPlans] = useState(false);
  const [showSpecificationTable, setShowSpecificationTable] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [showAddDocumentButton, setShowAddDocumentButton] = useState(false);
  const [showAddPlanButton, setShowAddPlanButton] = useState(false);
  const [showAddProductDocumentButton, setShowAddProductDocumentButton] = useState(false);
  const [showAddProductPlanButton, setShowAddProductPlanButton] = useState(false);
  const [showDetailsSpecificationTable, setShowDetailsSpecificationTable] = useState(false);
  const [comments, setComments] = useState([]);
  const [isCommentModalVisible, setCommentModalVisible] = useState(false);

  const userData = JSON.parse(localStorage.getItem('user'));
  const uploaderId = userData.id;

  useEffect(() => {
    const loadProductAndDetails = async () => {
      const productResult = await axios.get(`http://localhost:8080/product/${id}`);
      setProduct(productResult.data);
      const detailsResult = await axios.get(`http://localhost:8080/details/product/${id}`);
      setDetails(detailsResult.data);
      setSelectedProduct(productResult.data.id);
      setShowDocuments(true);
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
    setShowPlans(false);
    setShowSpecificationTable(false);
    setShowDetailsSpecificationTable(false);
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
    setShowPlans(false);
    setShowSpecificationTable(false);
    setShowDetailsSpecificationTable(false);
    setShowAddProductDocumentButton(true);
  };

  const handleDocumentsClick = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/documentations/detail/${selectedDetail}`);
      setDocuments(response.data);
      setShowDocuments(true);
      setShowSpecificationTable(false);
      setShowDetailsSpecificationTable(false);
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
      setShowDetailsSpecificationTable(false);
    } catch (error) {
      console.error('Error fetching documentations:', error);
    }
  };

  const handleDrawingsClick = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/plans/detail/${selectedDetail}`);
      setPlans(response.data);
      setShowDocuments(false);
      setShowPlans(true);
      setShowSpecificationTable(false);
      setShowDetailsSpecificationTable(false);
      setShowAddPlanButton(true);
    } catch (error) {
      console.error('Error fetching plans:', error);
    }
  };

  const handleProductDrawingsClick = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/plans/product/${selectedProduct}`);
      setPlans(response.data);
      setShowDocuments(false);
      setShowPlans(true);
      setShowSpecificationTable(false);
      setShowDetailsSpecificationTable(false);
      setShowAddProductPlanButton(true);
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
    setShowPlans(false);
    setShowDocuments(false);
    setShowSpecificationTable(true);
    setShowDetailsSpecificationTable(false);
    setSelectedDetail(null);
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

  const handleDownloadDetailsPDF = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/details/product/download/${id}`, {
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'details.pdf');
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

  const deleteDetailDocument = (documentId) => {
    confirmAlert({
      title: <h2 style={{ fontSize: '24px' }}>Подтверждение удаления</h2>,
      message: (
        <div>
          <p>Вы уверены, что хотите удалить этот документ?</p>
          <small>Это действие нельзя будет отменить.</small>
        </div>
      ),
      buttons: [
        {
          label: <span style={{ fontSize: '14px' }}>Да</span>,
          onClick: async () => {
            try {
              await axios.delete(`http://localhost:8080/documentation/${documentId}`);
              handleDocumentsClick();
            } catch (error) {
              console.error('Ошибка удаления документа:', error);
            }
          },
        },
        {
          label: <span style={{ fontSize: '14px' }}>Нет</span>,
          onClick: () => { },
        },
      ],
    });
  };

  const deleteProductDocument = (documentId) => {
    confirmAlert({
      title: <h2 style={{ fontSize: '24px' }}>Подтверждение удаления</h2>,
      message: (
        <div>
          <p>Вы уверены, что хотите удалить этот документ?</p>
          <small>Это действие нельзя будет отменить.</small>
        </div>
      ),
      buttons: [
        {
          label: <span style={{ fontSize: '14px' }}>Да</span>,
          onClick: async () => {
            try {
              await axios.delete(`http://localhost:8080/documentation/${documentId}`);
              handleProductDocumentsClick();
            } catch (error) {
              console.error('Ошибка удаления документа:', error);
            }
          },
        },
        {
          label: <span style={{ fontSize: '14px' }}>Нет</span>,
          onClick: () => { },
        },
      ],
    });
  };

  const deleteDetailPlan = (planId) => {
    confirmAlert({
      title: <h2 style={{ fontSize: '24px' }}>Подтверждение удаления</h2>,
      message: (
        <div>
          <p>Вы уверены, что хотите удалить этот чертеж?</p>
          <small>Это действие нельзя будет отменить.</small>
        </div>
      ),
      buttons: [
        {
          label: <span style={{ fontSize: '14px' }}>Да</span>,
          onClick: async () => {
            try {
              await axios.delete(`http://localhost:8080/plan/${planId}`);
              handleDrawingsClick();
            } catch (error) {
              console.error('Ошибка удаления чертежа:', error);
            }
          },
        },
        {
          label: <span style={{ fontSize: '14px' }}>Нет</span>,
          onClick: () => { },
        },
      ],
    });
  };

  const deleteProductPlan = (planId) => {
    confirmAlert({
      title: <h2 style={{ fontSize: '24px' }}>Подтверждение удаления</h2>,
      message: (
        <div>
          <p>Вы уверены, что хотите удалить этот чертеж?</p>
          <small>Это действие нельзя будет отменить.</small>
        </div>
      ),
      buttons: [
        {
          label: <span style={{ fontSize: '14px' }}>Да</span>,
          onClick: async () => {
            try {
              await axios.delete(`http://localhost:8080/plan/${planId}`);
              handleProductDrawingsClick();
            } catch (error) {
              console.error('Ошибка удаления чертежа:', error);
            }
          },
        },
        {
          label: <span style={{ fontSize: '14px' }}>Нет</span>,
          onClick: () => { },
        },
      ],
    });
  };


  const handleDetailsSpecificationClick = async () => {
    try {
      setShowDetailsSpecificationTable(true);
    } catch (error) {
      console.error('Error fetching details specification:', error);
    }
  };

  const handleOpenCommentModal = async (documentId) => {
    try {
      const response = await axios.get(`http://localhost:8080/doccomments/document/${documentId}`);
      setComments(response.data);
      setCommentModalVisible(true);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  // Метод для закрытия модального окна с комментариями
  const handleCloseCommentModal = () => {
    setCommentModalVisible(false);
    setComments([]); 
  };

  return (
    <>
      <UserMenu />
      <div className="container-fluid ">
        <div className="row" style={{ padding: '10px' }}>
          <div className="col-md-3 separator">
            <input
              className="form-control mb-2"
              type="search"
              placeholder="Поиск по названию детали"
              aria-label="Search"
              value={searchTerm}
              onChange={handleSearchChange}
              style={{ fontSize: '12px' }}
            />
            <h5 style={{ textAlign: 'left' }}>Изделие</h5>
            <h6
              className={` product-name ${selectedProduct === product.id ? 'selected-detail' : ''}`}
              onClick={() => {
                handleProductClick(product.id);
                setSelectedDetail(null);
              }}
            >
              {product.name}
            </h6>
            <h5 style={{ textAlign: 'left' }}>Детали</h5>

            {filteredDetails.length > 0 && (
              <div className="details-list">
                <div className="detail-item header">
                  <span>Наименование</span>
                  <span>Обозначение</span>
                  <span>Количество</span>
                </div>
                {filteredDetails.map((detail, index) => (
                  <div
                    key={index}
                    className={`detail-item ${selectedDetail === detail.id ? 'selected-detail' : ''}`}
                    onClick={() => {
                      handleDetailClick(detail.id);
                      setSelectedProduct(null);
                    }}
                  >
                    <span>{detail.name}</span>
                    <span>{detail.designation}</span>
                    <span>{detail.quantity}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="col-md-9" style={{ padding: '10px' }}>
            <div className="d-flex mb-3">
              {selectedDetail && (
                <>
                  <button
                    type="button"
                    className={`btn btn-secondary mx-1 ${showDocuments ? 'active' : ''}`}
                    onClick={() => {
                      handleDocumentsClick();
                      setShowPlans(false);
                    }}
                  >
                    Документы
                  </button>
                  <button
                    type="button"
                    className={`btn btn-secondary mx-1 ${showPlans ? 'active' : ''}`}
                    onClick={() => {
                      handleDrawingsClick();
                      setShowDocuments(false);
                    }}
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
                    onClick={() => {
                      handleProductDocumentsClick();
                      setShowPlans(false);
                    }}
                  >
                    Документы
                  </button>
                  <button
                    type="button"
                    className={`btn btn-secondary mx-1 ${showPlans ? 'active' : ''}`}
                    onClick={() => {
                      handleProductDrawingsClick();
                      setShowDocuments(false);
                    }}
                  >
                    Чертежи
                  </button>
                  <button
                    type="button"
                    className={`btn btn-secondary mx-1 ${showSpecificationTable ? 'active' : ''}`}
                    onClick={() => {
                      handleSpecificationClick();
                      setShowDocuments(false);
                      setShowPlans(false);
                    }}
                  >
                    Спецификация материалов
                  </button>
                  <button
                    type="button"
                    className={`btn btn-secondary mx-1 ${showDetailsSpecificationTable ? 'active' : ''}`}
                    onClick={() => {
                      handleDetailsSpecificationClick();
                      setShowSpecificationTable(false);
                      setShowDocuments(false);
                      setShowPlans(false);
                    }}>
                    Спецификация деталей
                  </button>

                </>
              )}

            </div>
            {showDocuments && selectedDetail && (
              <table className="table">
                <thead>
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">Заголовок</th>
                    <th scope="col">Статус</th>
                    <th scope="col">Версия</th>
                    <th scope="col">Загрузил</th>
                    <th scope="col">Согласует</th>
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
                      <td>{document.uploader.surname}</td>
                      <td>{document.approver.surname}</td>
                      <td>
                        {document.status === 'На доработку' && (
                          <button
                            className="btn btn-info mx-2"
                            onClick={() => handleOpenCommentModal(document.id)}
                          >
                            Комментарий
                          </button>
                        )}
                        <Link className="btn btn-primary mx-2" to={`/viewdocumentation/${document.id}`}>
                          Просмотр
                        </Link>
                        <button className="btn btn-success mx-2" onClick={() => downloadDocument(document)}>
                          Скачать
                        </button>
                        {document.uploader.id === uploaderId && (
                          <>
                            <button className="btn btn-danger mx-2" onClick={() => deleteDetailDocument(document.id)}>
                              Удалить
                            </button>
                          </>
                        )}
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
                    <th scope="col">Загрузил</th>
                    <th scope="col">Согласует</th>
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
                      <td>{document.uploader.surname}</td>
                      <td>{document.approver.surname}</td>
                      <td>
                        <Link className="btn btn-primary mx-2" to={`/viewdocumentation/${document.id}`}>
                          Просмотр
                        </Link>
                        <button className="btn btn-success mx-2" onClick={() => downloadDocument(document)}>
                          Скачать
                        </button>
                        {document.uploader.id === uploaderId && (
                          <>
                            <button className="btn btn-danger mx-2" onClick={() => deleteProductDocument(document.id)}>
                              Удалить
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            {showPlans && selectedDetail && (
              <table className="table">
                <thead>
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">Заголовок</th>
                    <th scope="col">Статус</th>
                    <th scope="col">Версия</th>
                    <th scope="col">Загрузил</th>
                    <th scope="col">Согласует</th>
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
                      <td>{plan.uploader.surname}</td>
                      <td>{plan.approver.surname}</td>
                      <td>
                        <button className="btn btn-primary mx-2" onClick={() => viewPlan(plan)}>
                          Просмотр
                        </button>
                        {plan.uploader.id === uploaderId && (
                          <>
                            <button className="btn btn-danger mx-2" onClick={() => deleteDetailPlan(plan.id)}>
                              Удалить
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            {showPlans && selectedProduct && (
              <table className="table">
                <thead>
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">Заголовок</th>
                    <th scope="col">Статус</th>
                    <th scope="col">Версия</th>
                    <th scope="col">Загрузил</th>
                    <th scope="col">Согласует</th>
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
                      <td>{plan.uploader.surname}</td>
                      <td>{plan.approver.surname}</td>
                      <td>
                        <button className="btn btn-primary mx-2" onClick={() => viewPlan(plan)}>
                          Просмотр
                        </button>
                        {plan.uploader.id === uploaderId && (
                          <>
                            <button className="btn btn-danger mx-2" onClick={() => deleteProductPlan(plan.id)}>
                              Удалить
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {showSpecificationTable && (
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

            {showDetailsSpecificationTable && (
              <div>
                <table id="specification-table" className="table">
                  <thead>
                    <tr>
                      <th scope="col">#</th>
                      <th scope="col">Наименование</th>
                      <th scope="col">Обозначение</th>
                      <th scope="col">Количество</th>
                    </tr>
                  </thead>
                  <tbody>
                    {details.map((detail, index) => (
                      <tr key={index}>
                        <th scope="row">{index + 1}</th>
                        <td>{detail.name}</td>
                        <td>{detail.designation}</td>
                        <td>{detail.quantity}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <button type="button" className="btn btn-primary" onClick={handleDownloadDetailsPDF}>
                  Скачать
                </button>
              </div>
            )}

            {isCommentModalVisible && (
              <div className="modal">
                <div className="modal-content">
                  <span className="close" onClick={handleCloseCommentModal}>
                    &times;
                  </span>
                  <h2>Комментарии</h2>
                  <ul>
                    {comments.map((comment, index) => (
                      <li key={index}>{comment.comm}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {modalVisible && selectedPlan && <ImageViewerModal plan={selectedPlan} onClose={() => setModalVisible(false)} />}
            {showAddDocumentButton && showDocuments && selectedDetail && (
              <Link className="btn" style={{ backgroundColor: 'black', color: 'white' }} to={`/adddocumentation`}>
                Добавить документ
              </Link>
            )}
            {showAddPlanButton && showPlans && selectedDetail && (
              <Link className="btn" style={{ backgroundColor: 'black', color: 'white' }} to={`/addplan`}>
                Добавить чертеж
              </Link>
            )}
            {showAddProductDocumentButton && showDocuments && selectedProduct && (
              <Link className="btn" style={{ backgroundColor: 'black', color: 'white' }} to={`/addproductdocumentation`}>
                Добавить документ
              </Link>
            )}
            {showAddProductPlanButton && showPlans && selectedProduct && (
              <Link className="btn" style={{ backgroundColor: 'black', color: 'white' }} to={`/addproductplan`}>
                Добавить чертеж
              </Link>
            )}

          </div>
        </div>
      </div>
    </>
  );
};

export default UserDetails;
