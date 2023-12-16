import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import AdminMenu from './AdminMenu';
import '../styles/Details.css';
import 'jspdf-autotable';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { Modal, Button, Form } from 'react-bootstrap';



const AdminDetails = () => {
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
  const [showDetailsSpecificationTable, setShowDetailsSpecificationTable] = useState(false);
  const [showNormaTable, setShowNormaTable] = useState(false);
  const [showDetailTable, setShowDetailTable] = useState(false);
  const [selectedVersion, setSelectedVersion] = useState(null);
  const [detailDocumentVersion, setDetailDocumentVersion] = useState(null);
  const [detailPlanSelectedVersion, setDetailPlanSelectedVersion] = useState(null);
  const [detailPlanVersion, setDetailPlanVersion] = useState(null);
  const [productDocumentSelectedVersion, setProductDocumentSelectedVersion] = useState(null);
  const [productDocumentVersion, setProductDocumentVersion] = useState(null);
  const [productPlanSelectedVersion, setProductPlanSelectedVersion] = useState(null);
  const [productPlanVersion, setProductPlanVersion] = useState(null);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [selectedDocumentation, setSelectedDocumentation] = useState(null);
  const [comment, setComment] = useState('');
  const [showPlanCommentModal, setShowPlanCommentModal] = useState(false);

  const userData = JSON.parse(localStorage.getItem('user'));
  const approverId = userData.id;
  console.log(approverId);

  useEffect(() => {
    const loadProductAndDetails = async () => {
      const productResult = await axios.get(`http://localhost:8080/product/${id}`);
      setProduct(productResult.data);
      const detailsResult = await axios.get(`http://localhost:8080/details/product/${id}`);
      const detailsData = detailsResult.data;

      // Проверка наличия ключа "details" и его типа
      if (Array.isArray(detailsData.details)) {
        // detailsData.details - это массив деталей
        setDetails(detailsData.details);
      }

      setSelectedProduct(productResult.data.id);
      setShowDetailTable(true);
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

      // Создаем массив версий из полученных документов
      const versionsArray = response.data.map(document => document.version);

      // Фильтруем массив, чтобы оставить только уникальные версии
      const uniqueVersions = [...new Set(versionsArray)];

      // Устанавливаем уникальные версии в состояние или храните их в контексте, в зависимости от вашей структуры компонентов
      setDetailDocumentVersion(uniqueVersions);
    } catch (error) {
      console.error('Error fetching documentations:', error);
    }

    setShowDocuments(true);
    setShowPlans(false);
    setShowSpecificationTable(false);
    setShowDetailsSpecificationTable(false);
    setShowNormaTable(false);
    setShowDetailTable(false);
  };


  const handleProductClick = async (productId) => {
    setSelectedProduct(productId);
    try {
      const response = await axios.get(`http://localhost:8080/documentations/product/${productId}`);
      setDocuments(response.data);
      const versionsArray = response.data.map(document => document.version);

      const uniqueVersions = [...new Set(versionsArray)];

      setProductDocumentVersion(uniqueVersions);
    } catch (error) {
      console.error('Error fetching documentations:', error);
    }
    setShowDocuments(false);
    setShowPlans(false);
    setShowSpecificationTable(false);
    setShowDetailsSpecificationTable(false);
    setShowNormaTable(false);
    setShowDetailTable(true);
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

      const versionsArray = response.data.map(plan => plan.version);

      const uniqueVersions = [...new Set(versionsArray)];

      setDetailPlanVersion(uniqueVersions);

      setPlans(response.data);
      setShowDocuments(false);
      setShowPlans(true);
      setShowSpecificationTable(false);
      setShowDetailsSpecificationTable(false);
    } catch (error) {
      console.error('Error fetching plans:', error);
    }
  };

  const handleProductDrawingsClick = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/plans/product/${selectedProduct}`);
      const versionsArray = response.data.map(plan => plan.version);

      const uniqueVersions = [...new Set(versionsArray)];

      setProductPlanVersion(uniqueVersions);

      setPlans(response.data);
      setShowDocuments(false);
      setShowPlans(true);
      setShowSpecificationTable(false);
      setShowDetailsSpecificationTable(false);
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

  const handleDetailsSpecificationClick = async () => {
    try {
      setShowDetailsSpecificationTable(true);
    } catch (error) {
      console.error('Error fetching details specification:', error);
    }
  };

  const handleNormaClick = async () => {
    try {
      setShowNormaTable(true);
    } catch (error) {
      console.error('Error fetching details specification:', error);
    }
  };

  const handleDetailTableClick = async () => {
    try {
      showDetailTable(true);
    } catch (error) {
      console.error('Error fetching details specification:', error);
    }
  };

  const handleReject = (documentation) => {
    setSelectedDocumentation(documentation);
    setShowCommentModal(true);
  };

  const handleModalClose = () => {
    setShowCommentModal(false);
    setSelectedDocumentation(null);
    setComment('');
  };

  const handleApprove = async (id) => {
    try {
      const status = 'Согласован';
      const result = await axios.put(`http://localhost:8080/documentation/${id}/${status}`);
      const updatedDocumentation = result.data;
      const updatedDocumentations = documents.map((o) => (o.id === updatedDocumentation.id ? updatedDocumentation : o));
      setDocuments(updatedDocumentations);
    } catch (error) {
      console.error('Ошибка при обновлении статуса документации:', error);
    }
  };
  const handleRejectWithComment = async () => {
    try {
      const status = 'На доработке';
      const statusResult = await axios.put(`http://localhost:8080/documentation/${selectedDocumentation.id}/${status}`);
      const commentResult = await axios.post(`http://localhost:8080/doccomment/${selectedDocumentation.id}/${comment}`);

      // Обновляем состояние на основе результатов запросов
      const updatedDocumentation = statusResult.data;
      const updatedDocumentations = documents.map((o) => (o.id === updatedDocumentation.id ? updatedDocumentation : o));
      setDocuments(updatedDocumentations);

      handleModalClose();
    } catch (error) {
      console.error('Ошибка при обновлении статуса документации или отправке комментария:', error);
    }
  };

  const handlePlanApprove = async (id) => {
    try {
      const status = 'Согласован';
      const result = await axios.put(`http://localhost:8080/plan/${id}`, {
        status: status,
      });
  
      const updatedPlan = result.data;
      const updatedPlans = plans.map((o) => (o.id === updatedPlan.id ? updatedPlan : o));
      setPlans(updatedPlans);
    } catch (error) {
      console.error('Ошибка при обновлении статуса чертежей:', error);
    }
  };
  

  const handlePlanReject = (plan) => {
    setSelectedPlan(plan);
    setShowPlanCommentModal(true);
  };

  const handlePlanModalClose = () => {
    setShowPlanCommentModal(false);
    setSelectedPlan(null);
    setComment('');
  };

  const handlePlanRejectWithComment = async () => {
    try {
      const status = 'На доработке';
      const statusResult = await axios.put(`http://localhost:8080/plan/${selectedPlan.id}`, {
      status: status,
    });
      const commentResult = await axios.post(`http://localhost:8080/plancomment/${selectedPlan.id}/${comment}`);

      const updatedPlan = statusResult.data;
      const updatedPlans = plans.map((o) => (o.id === updatedPlan.id ? updatedPlan : o));
      setPlans(updatedPlans);

      handlePlanModalClose();
    } catch (error) {
      console.error('Ошибка при обновлении статуса документации или отправке комментария:', error);
    }
  };

  // const deleteDetail = async (id) => {
  //   await axios.delete(`http://localhost:8080/detail/${id}`);
  //   //loadDetails();
  // };

  const deleteDetail = (id) => {
    confirmAlert({
      title: <h2 style={{ fontSize: '24px' }}>Подтверждение удаления</h2>,
      message: (
        <div>
          <p>Вы уверены, что хотите удалить эту деталь?</p>
          <small>Это действие нельзя будет отменить.</small>
        </div>
      ),
      buttons: [
        {
          label: <span style={{ fontSize: '14px' }}>Да</span>,
          onClick: async () => {
            try {
              await axios.delete(`http://localhost:8080/detail/${id}`);
              //loadProducts();
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

  return (
    <>
      <AdminMenu />
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
              className={`product-name ${selectedProduct === product.id ? 'selected-detail' : ''}`}
              onClick={() => {
                handleProductClick(product.id);
                setSelectedDetail(null);
              }}
              style={{ display: 'flex', justifyContent: 'space-between' }}
            >
              <span style={{ order: 1 }}>{product.name}</span>
              <span style={{ order: 2 }}>{product.creationDate}</span>
            </h6>
            <h5 style={{ textAlign: 'left' }}>Детали</h5>

            {filteredDetails.length > 0 && (
              <div className="details-list">
                <div className="detail-item header" style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ marginRight: '5px' }}>Наименование </span>
                  <span>Обозначение</span>
                  <span>Кол-во</span>
                  <span>Создана</span>
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
                    <span>{detail.creationDate}</span>
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
                      setShowNormaTable(false);
                      setShowPlans(false);
                      setShowDetailTable(false);
                    }}
                  >
                    Документы
                  </button>
                  <button
                    type="button"
                    className={`btn btn-secondary mx-1 ${showPlans ? 'active' : ''}`}
                    onClick={() => {
                      handleDrawingsClick();
                      setShowNormaTable(false);
                      setShowDocuments(false);
                      setShowDetailTable(false);
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
                    className={`btn btn-secondary mx-1 ${showDetailTable ? 'active' : ''}`}
                    onClick={() => {
                      handleDetailTableClick();
                      setShowPlans(false);
                      setShowNormaTable(false);
                      setShowDocuments(false);
                      setShowDetailTable(true);
                      setShowSpecificationTable(false);
                      setShowDetailsSpecificationTable(false);
                    }}
                  >
                    Детали
                  </button>
                  <button
                    type="button"
                    className={`btn btn-secondary mx-1 ${showDocuments ? 'active' : ''}`}
                    onClick={() => {
                      handleProductDocumentsClick();
                      setShowPlans(false);
                      setShowNormaTable(false);
                      setShowDetailTable(false);
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
                      setShowNormaTable(false);
                      setShowDetailTable(false);
                    }}
                  >
                    Чертежи
                  </button>
                  <button
                    type="button"
                    className={`btn btn-secondary mx-1 ${showNormaTable ? 'active' : ''}`}
                    onClick={() => {
                      handleNormaClick();
                      setShowSpecificationTable(false);
                      setShowDetailsSpecificationTable(false);
                      setShowDocuments(false);
                      setShowPlans(false);
                      setShowDetailTable(false);
                    }}>
                    Норма расхода
                  </button>
                  <button
                    type="button"
                    className={`btn btn-secondary mx-1 ${showSpecificationTable ? 'active' : ''}`}
                    onClick={() => {
                      handleSpecificationClick();
                      setShowDocuments(false);
                      setShowPlans(false);
                      setShowNormaTable(false);
                      setShowDetailTable(false);
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
                      setShowNormaTable(false);
                      setShowDetailTable(false);
                    }}>
                    Спецификация деталей
                  </button>
                </>
              )}

            </div>
            {showDocuments && selectedDetail && (
              <>
                <select
                  id="versionDropdown"
                  className="form-select"
                  value={selectedVersion}
                  onChange={(e) => setSelectedVersion(e.target.value)}
                  style={{ width: '185px', textAlignLast: 'center' }}
                >
                  <option value="">Выберите версию</option>
                  {detailDocumentVersion && detailDocumentVersion.map((version, index) => (
                    <option key={index} value={version}>
                      Версия {version}
                    </option>
                  ))}
                </select>
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
                    {documents
                      .filter((document) => !selectedVersion || Number(document.version) === Number(selectedVersion))
                      .map((document, index) => (
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
                            {document.approver.id === approverId && (
                              <>
                                {document.status === 'На согласовании' && (
                                  <>
                                    <button
                                      className='btn btn-outline-dark mx-2'
                                      onClick={() => handleApprove(document.id)}
                                    >
                                      Согласовать
                                    </button>
                                    <button
                                      className='btn btn-outline-dark mx-2'
                                      onClick={() => handleReject(document)}
                                    >
                                      На доработку
                                    </button>
                                  </>
                                )}
                              </>
                            )}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </>
            )}

            {showDocuments && selectedProduct && (
              <>
                <select
                  id="versionDropdown"
                  className="form-select"
                  value={productDocumentSelectedVersion}
                  onChange={(e) => setProductDocumentSelectedVersion(e.target.value)}
                  style={{ width: '185px', textAlignLast: 'center' }}
                >
                  <option value="">Выберите версию</option>
                  {productDocumentVersion && productDocumentVersion.map((version, index) => (
                    <option key={index} value={version}>
                      Версия {version}
                    </option>
                  ))}
                </select>
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
                    {documents
                      .filter((document) => !productDocumentSelectedVersion || Number(document.version) === Number(productDocumentSelectedVersion))
                      .map((document, index) => (
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
                            {document.approver.id === approverId && (
                              <>
                                {document.status === 'На согласовании' && (
                                  <>
                                    <button
                                      className='btn btn-outline-dark mx-2'
                                      onClick={() => handleApprove(document.id)}
                                    >
                                      Согласовать
                                    </button>
                                    <button
                                      className='btn btn-outline-dark mx-2'
                                      onClick={() => handleReject(document)}
                                    >
                                      На доработку
                                    </button>
                                  </>
                                )}
                              </>
                            )}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </>
            )}

            {showPlans && selectedDetail && (
              <>
                <select
                  id="versionDropdown"
                  className="form-select"
                  value={detailPlanSelectedVersion}
                  onChange={(e) => setDetailPlanSelectedVersion(e.target.value)}
                  style={{ width: '185px', textAlignLast: 'center' }}
                >
                  <option value="">Выберите версию</option>
                  {detailPlanVersion && detailPlanVersion.map((version, index) => (
                    <option key={index} value={version}>
                      Версия {version}
                    </option>
                  ))}
                </select>
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
                    {plans.filter((plan) => !detailPlanSelectedVersion || Number(plan.version) === Number(detailPlanSelectedVersion))
                      .map((plan, index) => (

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
                            {plan.approver.id === approverId && (
                              <>
                                {plan.status === 'На согласовании' && (
                                  <>
                                    <button
                                      className='btn btn-outline-dark mx-2'
                                      onClick={() => handlePlanApprove(plan.id)}
                                    >
                                      Согласовать
                                    </button>
                                    <button
                                      className='btn btn-outline-dark mx-2'
                                      onClick={() => handlePlanReject(plan)}
                                    >
                                      На доработку
                                    </button>
                                  </>
                                )}
                              </>
                            )}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </>
            )}
            {showPlans && selectedProduct && (
              <>
                <select
                  id="versionDropdown"
                  className="form-select"
                  value={productPlanSelectedVersion}
                  onChange={(e) => setProductPlanSelectedVersion(e.target.value)}
                  style={{ width: '185px', textAlignLast: 'center' }}
                >
                  <option value="">Выберите версию</option>
                  {productPlanVersion && productPlanVersion.map((version, index) => (
                    <option key={index} value={version}>
                      Версия {version}
                    </option>
                  ))}
                </select>
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
                    {plans.filter((plan) => !productPlanSelectedVersion || Number(plan.version) === Number(productPlanSelectedVersion))
                      .map((plan, index) => (
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
                            {plan.approver.id === approverId && (
                              <>
                                {plan.status === 'На согласовании' && (
                                  <>
                                    <button
                                      className='btn btn-outline-dark mx-2'
                                      onClick={() => handlePlanApprove(plan.id)}
                                    >
                                      Согласовать
                                    </button>
                                    <button
                                      className='btn btn-outline-dark mx-2'
                                      onClick={() => handlePlanReject(plan)}
                                    >
                                      На доработку
                                    </button>
                                  </>
                                )}
                              </>
                            )}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </>
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
                    {materials
                      .filter((material, index, self) =>
                        index === self.findIndex((m) => (
                          m.name === material.name &&
                          m.mark === material.mark &&
                          m.gost === material.gost &&
                          m.unit.name === material.unit.name
                        ))
                      )
                      .map((material, index) => (
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
                      <th style={{ padding: '5px' }} scope="col">Наименование</th>
                      <th style={{ padding: '5px' }} scope="col">Обозначение</th>
                      <th style={{ padding: '5px' }} scope="col">Количество</th>
                      <th style={{ padding: '5px' }} scope="col">Наименование материала</th>
                      <th style={{ padding: '5px' }} scope="col">Марка материала</th>
                      <th style={{ padding: '5px' }} scope="col">ГОСТ</th>
                      <th style={{ padding: '5px' }} scope="col">Ед. измерения</th>
                      <th style={{ padding: '5px' }} scope="col">Расход материала на ед. измерения</th>
                      <th style={{ padding: '5px' }} scope="col">Расход материала на кол-во деталей</th>
                    </tr>
                  </thead>
                  <tbody>
                    {details.map((detail, index) => (
                      <tr key={index}>
                        <th scope="row">{index + 1}</th>
                        <td>{detail.name}</td>
                        <td>{detail.designation}</td>
                        <td>{detail.quantity}</td>
                        <td>{detail.material.name}</td>
                        <td>{detail.material.mark}</td>
                        <td>{detail.material.gost}</td>
                        <td>{detail.material.unit.name}</td>
                        <td>{detail.materialQuantity}</td>
                        <td>{detail.quantity * detail.materialQuantity}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <button type="button" className="btn btn-primary" onClick={handleDownloadDetailsPDF}>
                  Скачать
                </button>
              </div>
            )}

            {showNormaTable && (
              <div>
                <table id="norma-table" className="table">
                  <thead>
                    <tr>
                      <th scope="col">#</th>
                      <th scope="col">Наименование</th>
                      <th scope="col">Обозначение</th>
                      <th scope="col">Количество</th>
                      <th scope="col">Материал</th>
                      <th scope="col">Ед.измерения</th>
                      <th scope="col">Расход материала</th>
                    </tr>
                  </thead>
                  <tbody>
                    {details.map((detail, index) => (
                      <tr key={index}>
                        <th scope="row">{index + 1}</th>
                        <td>{detail.name}</td>
                        <td>{detail.designation}</td>
                        <td>{detail.quantity}</td>
                        <td>{detail.material.name}</td>
                        <td>{detail.material.unit.name}</td>
                        <td>{detail.materialQuantity}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {showDetailTable && (
              <>
              <div className="table-wrapper">
              <div className="d-flex justify-content-between align-items-center">
                <Link className="btn" style={{ backgroundColor: 'black', color: 'white', marginLeft: 'auto'  }} to={`/adddetail`}>
                  Добавить деталь
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
                      <th scope="col">Обозначение</th>
                      <th scope="col">Изделие</th>
                      <th scope="col">Количество</th>
                      <th scope="col">Материал</th>
                      <th scope="col">Действие</th>
                    </tr>
                  </thead>
                  <tbody>
                    {details.map((detail, index) => (
                      <tr key={index}>
                        <th scope="row">{index + 1}</th>
                        <td>{detail.name}</td>
                        <td>{detail.designation}</td>
                        <td>{detail.product.name}</td>
                        <td>{detail.quantity}</td>
                        <td>{detail.material.name}</td>
                        <td>
                          <Link
                            className="btn btn-outline-dark mx-2"
                            to={`/editdetail/${detail.id}`}
                          >
                            Изменить
                          </Link>
                          <button
                            className="btn btn-danger mx-2"
                            onClick={() => deleteDetail(detail.id)}
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
            )}

            <Modal show={showCommentModal} onHide={handleModalClose}>
              <Modal.Header closeButton>
                <Modal.Title>Отправить на доработку</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form.Group controlId="comment">
                  <Form.Label>Комментарий</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  />
                </Form.Group>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleModalClose}>
                  Закрыть
                </Button>
                <Button variant="primary" onClick={handleRejectWithComment}>
                  Отправить на доработку
                </Button>
              </Modal.Footer>
            </Modal>

            <Modal show={showPlanCommentModal} onHide={handlePlanModalClose}>
              <Modal.Header closeButton>
                <Modal.Title>Отправить на доработку</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form.Group controlId="comment">
                  <Form.Label>Комментарий</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  />
                </Form.Group>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handlePlanModalClose}>
                  Закрыть
                </Button>
                <Button variant="primary" onClick={handlePlanRejectWithComment}>
                  Отправить на доработку
                </Button>
              </Modal.Footer>
            </Modal>

            {modalVisible && selectedPlan && <ImageViewerModal plan={selectedPlan} onClose={() => setModalVisible(false)} />}
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminDetails;
