import React, { useState, useEffect } from 'react';
import Styles from './Hour.module.css';
import moment from 'moment';

function Hour({ selectedDate, selectedProfessional, servicoId, onHourSelect }) {
    const [horariosDisponiveis, setHorariosDisponiveis] = useState([]);
    const [selectedHour, setSelectedHour] = useState(null);

    useEffect(() => {
        const fetchAvailableHours = async () => {
            if (selectedDate) {
                try {
                    const queryParams = new URLSearchParams();
                    if (selectedProfessional) {
                        queryParams.append('profissional', selectedProfessional);
                    }
                    if (servicoId) {
                        queryParams.append('servicoId', servicoId);
                    }

                    const response = await fetch(`/api/horarios-disponiveis/${selectedDate}?${queryParams.toString()}`);
                    if (!response.ok) {
                        throw new Error(`Erro ao buscar horários: ${response.status}`);
                    }
                    const data = await response.json();
                    setHorariosDisponiveis(data);
                } catch (error) {
                    console.error('Erro ao buscar horários:', error);
                    setHorariosDisponiveis([]);
                }
            } else {
                setHorariosDisponiveis([]);
            }
        };

        fetchAvailableHours();
    }, [selectedDate, selectedProfessional, servicoId]);

    const handleHourSelect = (hour) => {
        setSelectedHour(hour);
        onHourSelect(hour); 
    };

    const isManha = (hour) => {
        const horaMoment = moment(hour, 'HH:mm');
        return horaMoment.isSameOrAfter(moment('10:00', 'HH:mm')) && horaMoment.isBefore(moment('11:50', 'HH:mm'));
    };

    const isTarde = (hour) => {
        const horaMoment = moment(hour, 'HH:mm');
        return horaMoment.isSameOrAfter(moment('12:00', 'HH:mm')) && horaMoment.isBefore(moment('17:50', 'HH:mm'));
    };

    const isNoite = (hour) => {
        const horaMoment = moment(hour, 'HH:mm');
        return horaMoment.isSameOrAfter(moment('18:00', 'HH:mm')) && horaMoment.isBefore(moment('20:01', 'HH:mm'));
    };

    let exibiuManha = false;
    let exibiuTarde = false;
    let exibiuNoite = false;

    return (
        <div className={Styles.containerHour}>
            {horariosDisponiveis.length > 0 ? (
                <div className={Styles.hoursGrid}>
                    {horariosDisponiveis.map(hour => {
                        const mostrarManha = isManha(hour) && !exibiuManha;
                        const mostrarTarde = isTarde(hour) && !exibiuTarde;
                        const mostrarNoite = isNoite(hour) && !exibiuNoite;

                        if (mostrarManha) {
                            exibiuManha = true;
                        }
                        if (mostrarTarde) {
                            exibiuTarde = true;
                        }
                        if (mostrarNoite) {
                            exibiuNoite = true;
                        }

                        return (
                            <React.Fragment key={hour}>
                                {mostrarManha && <div className={Styles.manhaHeader}>Manhã</div>}
                                {mostrarTarde && <div className={Styles.tardeHeader}>Tarde</div>}
                                {mostrarNoite && <div className={Styles.noiteHeader}>Noite</div>}
                                <button
                                    className={selectedHour === hour ? Styles.selected : Styles.hourButton}
                                    onClick={() => handleHourSelect(hour)}
                                >
                                    {hour}
                                </button>
                            </React.Fragment>
                        );
                    })}
                </div>
            ) : (
                <p>{selectedDate ? 'Nenhum horário disponível para esta data.' : 'Selecione uma data para ver os horários.'}</p>
            )}
        </div>
    );
}

export default Hour;