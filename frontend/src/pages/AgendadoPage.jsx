import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import moment from 'moment';
import 'moment/locale/pt-br';
import servicosData from './servicoshome.json';
import Styles from './AgendadoPage.module.css';
import logo from './img/SteniosBarbearia.png';

moment.locale('pt-br');

function AgendadoPage() {
    const location = useLocation();
    const { userData } = location.state || {};
    const navigate = useNavigate();
    const clientPhoneNumber = userData ? userData.phoneNumber : null;

    const [agendamentos, setAgendamentos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [cancelStatus, setCancelStatus] = useState(null);

    const diasDaSemana = [
        'Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira',
        'Quinta-feira', 'Sexta-feira', 'Sábado'
    ];

    const nomesDosMeses = [
        'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
        'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'
    ];

    const servicosMap = servicosData.reduce((acc, servico) => {
        acc[servico.id] = servico.titulo;
        return acc;
    }, {});

    useEffect(() => {
        const fetchAgendamentos = async () => {
            if (!clientPhoneNumber) {
                setError("Número de telefone do cliente não fornecido. Não é possível buscar agendamentos.");
                setLoading(false);
                return;
            }

            setLoading(true);
            setError(null);
            setCancelStatus(null);
            try {
                const response = await fetch(`/api/agendamentos/cliente/${clientPhoneNumber}`);
                
                const responseText = await response.text();
                
                if (!response.ok) {
                    let errorData = { error: 'Erro desconhecido ao buscar agendamentos.' };
                    try {
                        errorData = JSON.parse(responseText);
                    } catch (e) {
                        errorData.error = `Resposta inválida do servidor: ${responseText.substring(0, 100)}...`;
                    }
                    throw new Error(errorData.error || 'Falha ao buscar agendamentos do cliente.');
                }
                
                const data = JSON.parse(responseText);

                const agendamentosFuturos = data.filter(ag => {
                    const appointmentDateTime = moment(`${ag.data_agendamento} ${ag.horario_agendamento}`, 'YYYY-MM-DD HH:mm:ss');
                    return appointmentDateTime.isAfter(moment());
                });

                setAgendamentos(agendamentosFuturos);

            } catch (err) {
                console.error('Erro ao buscar agendamentos:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchAgendamentos();
    }, [clientPhoneNumber, cancelStatus]);

    const handleCancelAppointment = async (agendamentoId) => {
        if (!window.confirm("Tem certeza que deseja cancelar este agendamento?")) {
            return;
        }

        try {
            const response = await fetch(`/api/agendamentos/${agendamentoId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Falha ao cancelar o agendamento.');
            }

            setCancelStatus({ message: 'Agendamento cancelado com sucesso!', success: true });
            setAgendamentos(prev => prev.filter(ag => ag.id !== agendamentoId));

        } catch (err) {
            console.error('Erro ao cancelar agendamento:', err);
            setCancelStatus({ message: err.message || 'Erro ao cancelar agendamento.', success: false });
        }
    };

    const handleLogoClick = () => {
        navigate('/');
    };

    return(
        <div>
            <header className={Styles.header}>
                <div className={Styles.imagemcontainer}>
                    <img onClick={handleLogoClick} src={logo} alt='Logótipo da Barbearia Stenios' className={Styles.logo}/>
                </div>
            </header>

            <div className={Styles.container}>
                <h1 className={Styles.title}>Meus Agendamentos</h1>

                {cancelStatus && (
                    <div className={cancelStatus.success ? Styles.successMessage : Styles.errorMessage}>
                        {cancelStatus.message}
                    </div>
                )}

                {loading ? (
                    <p className={Styles.loading}>A carregar agendamentos...</p>
                ) : error ? (
                    <p className={Styles.error}>{error}</p>
                ) : agendamentos.length === 0 ? (
                    <p className={Styles.noAppointments}>Você não possui agendamentos futuros.</p>
                ) : (
                    <div className={Styles.agendamentosList}>
                        {agendamentos.map(agendamento => {
                            const dataAgendamento = moment(agendamento.data_agendamento);
                            
                            const diaSemanaIndex = dataAgendamento.day();
                            const diaSemanaNome = diasDaSemana[diaSemanaIndex];
                            
                            const mesIndex = dataAgendamento.month();
                            const mesNome = nomesDosMeses[mesIndex];
                            
                            const diaDoMes = dataAgendamento.date();
                            const ano = dataAgendamento.year();
                            
                            const dataFormatadaManual = `${diaDoMes} de ${mesNome} de ${ano}`;
                            
                            const horarioAgendado = moment(agendamento.horario_agendamento, 'HH:mm:ss').format('HH:mm');
                            
                            const nomeServico = servicosMap[agendamento.servico_id] || 'Serviço Desconhecido';

                            return (
                                <div key={agendamento.id} className={Styles.agendamentoCard}>
                                    <p className={Styles.dayOfWeek}>{diaSemanaNome}</p>
                                    <p className={Styles.date}>{dataFormatadaManual}</p>
                                    <p className={Styles.time}>Horário: {horarioAgendado}</p>
                                    <p className={Styles.service}>Serviço: {nomeServico}</p>
                                    <p className={Styles.barbershopName}>Barbearia Stenio's</p>
                                    <p className={Styles.barbershopPhone}>Telefone: (13)99199-9025</p>
                                    <button
                                        className={Styles.cancelButton}
                                        onClick={() => handleCancelAppointment(agendamento.id)}
                                    >
                                        Cancelar Agendamento
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}

export default AgendadoPage;