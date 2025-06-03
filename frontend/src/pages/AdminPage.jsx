import React, { useState, useEffect } from 'react';
import moment from 'moment';
import 'moment/locale/pt-br';
import servicosData from './servicoshome.json';
import Styles from './AdminPage.module.css';
import logo from './img/SteniosBarbearia.png';
import {useNavigate} from 'react-router-dom';

moment.locale('pt-br');

function AdminPage() {
    const [agendamentos, setAgendamentos] = useState([]);
    const [profissionais, setProfissionais] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const [selectedDate, setSelectedDate] = useState(moment().format('YYYY-MM-DD'));
    const [selectedProfessional, setSelectedProfessional] = useState('');
    const [cancelStatus, setCancelStatus] = useState(null); 

    const servicosMap = servicosData.reduce((acc, servico) => {
        acc[Number(servico.id)] = servico.titulo;
        return acc;
    }, {});

    const diasDaSemana = [
        'Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira',
        'Quinta-feira', 'Sexta-feira', 'Sábado'
    ];
    const nomesDosMeses = [
        'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
        'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'
    ];

    useEffect(() => {
        const fetchProfissionais = async () => {
            try {
                const response = await fetch('/api/profissionais');
                if (!response.ok) {
                    throw new Error('Falha ao buscar lista de profissionais.');
                }
                const data = await response.json();
                setProfissionais(['Todos', ...data]);
            } catch (err) {
                console.error('Erro ao buscar profissionais:', err);
            }
        };

        fetchProfissionais();
    }, []);

    useEffect(() => {
        const fetchAgendamentos = async () => {
            setLoading(true);
            setError(null);
            setCancelStatus(null);
            try {
                let url = `/api/agendamentos?data=${selectedDate}`;
                if (selectedProfessional && selectedProfessional !== 'Todos') {
                    url += `&profissional=${selectedProfessional}`;
                }

                const response = await fetch(url);
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || 'Falha ao buscar agendamentos.');
                }
                const data = await response.json();
                setAgendamentos(data);
            } catch (err) {
                console.error('Erro ao buscar agendamentos:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchAgendamentos();
    }, [selectedDate, selectedProfessional, cancelStatus]);

    const handleCancelAppointment = async (agendamentoId) => {
        if (!window.confirm("Tem certeza que deseja cancelar este agendamento? Esta ação é irreversível.")) {
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

    return (
        <div>
            <header className={Styles.header}>
                <div className={Styles.imagemcontainer}>
                    <img onClick={handleLogoClick} src={logo} alt='Logótipo da Barbearia Stenios' className={Styles.logo}/>
                </div>
                <h1 className={Styles.pageTitle}>Painel de Administração - Agendamentos</h1>
            </header>

            <div className={Styles.container}>
                <div className={Styles.filters}>
                    <div className={Styles.filterGroup}>
                        <label htmlFor="dateFilter">Data:</label>
                        <input
                            type="date"
                            id="dateFilter"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                        />
                    </div>
                    <div className={Styles.filterGroup}>
                        <label htmlFor="professionalFilter">Profissional:</label>
                        <select
                            id="professionalFilter"
                            value={selectedProfessional}
                            onChange={(e) => setSelectedProfessional(e.target.value)}
                        >
                            {profissionais.map(prof => (
                                <option key={prof} value={prof}>{prof}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {cancelStatus && ( 
                    <div className={cancelStatus.success ? Styles.successMessage : Styles.errorMessage}>
                        {cancelStatus.message}
                    </div>
                )}

                {loading ? (
                    <p className={Styles.loading}>A carregar agendamentos...</p>
                ) : error ? (
                    <p className={Styles.error}>Erro: {error}</p>
                ) : agendamentos.length === 0 ? (
                    <p className={Styles.noAppointments}>Nenhum agendamento encontrado para os filtros selecionados.</p>
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
                            const nomeServico = servicosMap[Number(agendamento.servico_id)] || 'Serviço Desconhecido';

                            return (
                                <div key={agendamento.id} className={Styles.agendamentoCard}>
                                    <p className={Styles.dayOfWeek}>{diaSemanaNome}</p>
                                    <p className={Styles.date}>{dataFormatadaManual}</p>
                                    <p className={Styles.time}>Horário: {horarioAgendado}</p>
                                    <p className={Styles.service}>Serviço: {nomeServico}</p>
                                    <p className={Styles.professional}>Profissional: {agendamento.profissional}</p>
                                    <p className={Styles.clientName}>Cliente: {agendamento.nomeCliente}</p>
                                    <p className={Styles.clientPhone}>Telefone: {agendamento.telefoneCliente}</p>
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

export default AdminPage;
