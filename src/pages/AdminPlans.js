import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminMenu from './AdminMenu';
import { Modal, Button, Form } from 'react-bootstrap';

const AdminPlans = () => {
    const [plans, setPlans] = useState([]);
    const [pendingPlans, setPendingPlans] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [comment, setComment] = useState('');

    useEffect(() => {
        loadPlans();
    }, []);

    const userData = JSON.parse(localStorage.getItem('user'));
    const approverId = userData.id;

    const loadPlans = async () => {
        try {
            const result = await axios.get(`http://localhost:8080/plans/approver/${approverId}`);
            setPlans(result.data);

            const pendingPlans = result.data.filter(plan => plan.status === 'На согласовании');
            setPendingPlans(pendingPlans);
        } catch (error) {
            console.error('Ошибка при загрузке чертежей:', error);
        }
    };

    const handleApprove = async (id) => {
        try {
            const status = 'Согласован';
            const result = await axios.put(`http://localhost:8080/plan/${id}/${status}`);
            const updatedPlan = result.data;
            const updatedPlans = plans.map((o) => (o.id === updatedPlan.id ? updatedPlan : o));
            setPlans(updatedPlans);

            // Обновляем массив с документами со статусом "На согласовании"
            const updatedPendingPlans = pendingPlans.filter(plan => plan.id !== updatedPlan.id);
            setPendingPlans(updatedPendingPlans);
        } catch (error) {
            console.error('Ошибка при обновлении статуса чертежей:', error);
        }
    };

    const handleReject = (plan) => {
        setSelectedPlan(plan);
        setShowModal(true);
    };

    const handleModalClose = () => {
        setShowModal(false);
        setSelectedPlan(null);
        setComment('');
    };

    const handleRejectWithComment = async () => {
        try {
            const status = 'На доработку';
            const statusResult = await axios.put(`http://localhost:8080/plan/${selectedPlan.id}/${status}`);
            const commentResult = await axios.post(`http://localhost:8080/plancomment/${selectedPlan.id}/${comment}`);

            const updatedPlan = statusResult.data;
            const updatedPlans = plans.map((o) => (o.id === updatedPlan.id ? updatedPlan : o));
            setPlans(updatedPlans);

            handleModalClose();

            const updatedPendingPlans = pendingPlans.filter(plan => plan.id !== updatedPlan.id);
            setPendingPlans(updatedPendingPlans);
        } catch (error) {
            console.error('Ошибка при обновлении статуса документации или отправке комментария:', error);
        }
    };

    const [modalVisible, setModalVisible] = useState(false);

    const viewPlan = (plan) => {
        setSelectedPlan(plan);
        setModalVisible(true);
    };

    const ImageViewerModal = ({ plan, onClose }) => {
        console.log("Plan Path:", plan.planFilePath);
        return (
            <div className="modal">
                <div className="modal-content">
                    <span className="close" onClick={onClose}>&times;</span>
                    <img className="modal-image" src={`http://localhost:8080${plan.planFilePath}`} alt="нет" height="50" />
                </div>
            </div>
        );
    };


    return (
        <>
            <AdminMenu />
            <div className="table-wrapper">
                <h4 style={{ textAlign: 'center', margin: 'auto' }}>Чертежи на согласование</h4>
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
                                <th scope="col">Cогласует</th>
                                <th scope="col">Деталь</th>
                                <th scope="col">Действия</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pendingPlans.map((plan, index) => (
                                <tr key={index}>
                                    <th scope="row">{index + 1}</th>
                                    <td>{plan.title}</td>
                                    <td>{plan.status}</td>
                                    <td>{plan.version ? plan.version : 'Нет данных'}</td>
                                    <td>{plan.uploader.surname}</td>
                                    <td>{plan.approver.surname}</td>
                                    <td>{plan.detail ? plan.detail.name : 'Нет данных'}</td>
                                    <td>
                                        {plan.status === 'На согласовании' && (
                                            <>
                                                <button className="btn btn-primary mx-2" onClick={() => viewPlan(plan)}>
                                                    Просмотр
                                                </button>
                                                {modalVisible && selectedPlan && (
                                                    <ImageViewerModal plan={selectedPlan} onClose={() => setModalVisible(false)} />
                                                )}
                                                <button
                                                    className='btn btn-outline-dark mx-2'
                                                    onClick={() => handleApprove(plan.id)}
                                                >
                                                    Согласовать
                                                </button>
                                                <button
                                                    className='btn btn-outline-dark mx-2'
                                                    onClick={() => handleReject(plan)}
                                                >
                                                    На доработку
                                                </button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <Modal show={showModal} onHide={handleModalClose}>
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
        </>
    );
};

export default AdminPlans;
