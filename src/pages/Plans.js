import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import UserMenu from './UserMenu';
import "../styles/Modal.css";



const Plans = () => {
    const [plans, setPlans] = useState([]);

    useEffect(() => {
        loadPlans();
    }, []);

    const loadPlans = async () => {
        try {
            const result = await axios.get("http://localhost:8080/plans");
            setPlans(result.data);
        } catch (error) {
            console.error('Error loading plans:', error);
        }
    };

    const deletePlan = async (id) => {
        await axios.delete(`http://localhost:8080/plan/${id}`);
        loadPlans();
    };

    const [selectedPlan, setSelectedPlan] = useState(null);
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
            <UserMenu />
            <div className="table-wrapper">
                <div className="d-flex justify-content-between align-items-center">
                    <h4 style={{ margin: 'auto' }}>Список чертежей</h4>
                    <Link className="btn" style={{ backgroundColor: 'black', color: 'white' }} to={`/addplan`}>
                        Добавить чертеж
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
                            {plans.map((plan, index) => (
                                <tr key={index}>
                                    <th scope="row">{index + 1}</th>
                                    <td>{plan.title}</td>
                                    <td>{plan.status}</td>
                                    <td>{plan.version ? plan.version : 'No detail'}</td>
                                    <td>{plan.uploader.username}</td>
                                    <td>{plan.approver.username}</td>
                                    <td>{plan.detail ? plan.detail.name : 'No detail'}</td>
                                    <td>
                                        <button className="btn btn-primary mx-2" onClick={() => viewPlan(plan)}>
                                            Просмотр
                                        </button>
                                        {modalVisible && selectedPlan && (
                                            <ImageViewerModal plan={selectedPlan} onClose={() => setModalVisible(false)} />
                                        )}
                                        <button className='btn btn-danger mx-2' onClick={() => deletePlan(plan.id)}>
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

export default Plans;
