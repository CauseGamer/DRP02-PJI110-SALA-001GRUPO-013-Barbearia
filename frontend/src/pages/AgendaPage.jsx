import React, { useState } from "react";
import Styles from './AgendaPage.module.css';
import logo from './img/SteniosBarbearia.png';
import Funcionarios from '../components/employees.jsx';
import Calendar from '../components/Calendar.jsx';
import Hour from '../components/Hour.jsx';
import TelaLogin from '../components/TelaLogin.jsx';
import { useSearchParams, useNavigate } from 'react-router-dom';
import servicosData from './servicoshome.json';

function AgendaPage(){
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const servicoId = searchParams.get('servicoId');

    const servicosMap = servicosData.reduce((acc, servico) => {
        acc[servico.id] = servico.titulo;
        return acc;
    }, {});

    const [showEmployees, setShowEmployees] = useState(true);
    const [showCalendar, setShowCalendar] = useState(false);
    const [showHour, setShowHour] = useState(false);
    const [showLogin, setShowLogin] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);

    const [selectedProfessional, setSelectedProfessional] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedHourForAppointment, setSelectedHourForAppointment] = useState(null);
    const [userData, setUserData] = useState(null);

    const handleProfessionalSelect = (professional) => {
        setSelectedProfessional(professional);
        setShowEmployees(false);
        setShowCalendar(true);
        setShowHour(false);
        setShowLogin(false);
        setShowConfirmation(false);
        setUserData(null);
        setSelectedDate(null);
        setSelectedHourForAppointment(null);
    };

    const handleDateSelect = (date) => {
        setSelectedDate(date);
        setShowCalendar(false);
        setShowHour(true);
        setShowLogin(false);
        setShowConfirmation(false);
        setUserData(null);
        setSelectedHourForAppointment(null);
    };

    const handleHourSelect = (hour) => {
        setSelectedHourForAppointment(hour);
        setUserData(null);
        setShowHour(false);
        setShowLogin(true);
        setShowConfirmation(false);
    };

    const handleLoginSuccess = (user) => {
        setUserData(user);
        setShowLogin(false);
        setShowConfirmation(true);
        console.log('Dados do usuário para agendamento:', user);
        console.log('Horário selecionado:', selectedHourForAppointment);
    };

    const handleConfirmBooking = async () => {
        const bookingData = {
            nomeCliente: userData.name,
            telefoneCliente: userData.phoneNumber,
            dataAgendamento: selectedDate,
            horaAgendamento: selectedHourForAppointment,
            profissional: selectedProfessional,
            servicoId: servicoId
        };

        console.log("Dados a enviar para o backend:", bookingData);

        try {
            const response = await fetch('/api/agendar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(bookingData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Falha ao confirmar o agendamento');
            }

            const result = await response.json();
            console.log('Agendamento realizado com sucesso:', result);
            alert('Agendamento realizado com sucesso!');
            navigate('/agendamentos', { state: { userData: userData } });

        } catch (error) {
            console.error('Erro ao agendar:', error.message);
            alert(`Erro ao agendar: ${error.message}`);
        }
    };

    const nomeServicoConfirmacao = servicosMap[servicoId] || 'Serviço Desconhecido';

    const handleLogoClick = () => {
        navigate('/');
    };

    return(
        <div>
            <header className={Styles.header}>
                <div className={Styles.imagemcontainer}>
                    <img onClick={handleLogoClick} src={logo} alt='Logo da Stenios Barbearia' className={Styles.logo}/>
                </div>
            </header>

            {showEmployees && <Funcionarios onProfessionalSelect={handleProfessionalSelect}/>}

            <div className={Styles.calendar}>
                {showCalendar && <Calendar onDateSelect={handleDateSelect} selectedProfessional={selectedProfessional}/>}
            </div>

            <div className={Styles.hour}>
                {showHour && (
                    <Hour
                        selectedDate={selectedDate}
                        selectedProfessional={selectedProfessional}
                        servicoId={servicoId}
                        onHourSelect={handleHourSelect}
                    />
                )}
            </div>

            <div className={Styles.login}>
                {showLogin && <TelaLogin onLoginSuccess={handleLoginSuccess} />}
            </div>

            {showConfirmation && userData && selectedDate && selectedHourForAppointment && (
                <div className={Styles.confirmarAgendamento}>
                    <h2>Confirmar Agendamento</h2>
                    <p>Nome: {userData.name}</p>
                    <p>Telefone: {userData.phoneNumber}</p>
                    <p>Data: {selectedDate}</p>
                    {selectedProfessional && <p>Profissional: {selectedProfessional}</p>}
                    <p>Horário: {selectedHourForAppointment}</p>
                    <p>Serviço: {nomeServicoConfirmacao}</p>
                    <button onClick={handleConfirmBooking}>Confirmar Agendamento Final</button>
                </div>
            )}
        </div>
    );
}

export default AgendaPage;
