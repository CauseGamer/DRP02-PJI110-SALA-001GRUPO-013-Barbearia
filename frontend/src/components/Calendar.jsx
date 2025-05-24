import React, { useState, useEffect, useRef } from "react";
import moment from 'moment';
import 'moment/locale/pt-br';
import Styles from './Calendar.module.css';
import setaleft from '../pages/img/angle-left.png';
import setarigth from '../pages/img/angle-right.png';

moment.locale('pt-br');

function Calendar({ onDateSelect, selectedProfessional }) {
    const [dataAtual, setDataAtual] = useState(moment());
    const primeiroDiaDoMes = dataAtual.clone().startOf('month');
    const ultimoDiaDoMes = dataAtual.clone().endOf('month');
    const primeiroDiaDaSemana = primeiroDiaDoMes.clone().startOf('week');
    const ultimoDiaDaSemana = ultimoDiaDoMes.clone().endOf('week');
    const [diaSelecionado, setDiaSelecionado] = useState(null);
    const diaAtualRef = useRef(null);

    useEffect(() => {
        if (diaAtualRef.current) {
            diaAtualRef.current.focus();
        }
    }, []);

    const dias = [];
    let diaAtual = primeiroDiaDaSemana.clone();

    while (diaAtual.isBefore(ultimoDiaDaSemana, 'day') || diaAtual.isSame(ultimoDiaDaSemana, 'day')) {
        dias.push(diaAtual.clone());
        diaAtual.add(1, 'day');
    }

    const semanas = [];
    for (let i = 0; i < dias.length; i += 7) {
        semanas.push(dias.slice(i, i + 7));
    }

    const navegarMesAnterior = () => {
        setDataAtual(dataAtual.clone().subtract(1, 'month'));
    };

    const navegarMesProximo = () => {
        setDataAtual(dataAtual.clone().add(1, 'month'));
    };

    const handleDiaClick = (dia) => {
        if (!dia.isBefore(moment(), 'day')) {
            setDiaSelecionado(dia);
            onDateSelect(dia.format('YYYY-MM-DD'));
        }
    };

    const diasDaSemanaAbreviados = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];
    const meses = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

    const indiceDoMesAtual = dataAtual.month();

    return (
        <div className={Styles.containerCalendar}>

            <div className={Styles.containerSetasMes}>
                <button onClick={navegarMesAnterior} className={Styles.setaEsq}><img src={setaleft} alt="seta para a esquerda" /></button>
                <h2>{meses[indiceDoMesAtual]}</h2>
                <button onClick={navegarMesProximo} className={Styles.setaDir}><img src={setarigth} alt="seta para a direita" /></button>
            </div>
            <table>
                <thead>
                    <tr className={Styles.diasSem}>
                        {diasDaSemanaAbreviados.map((dia, index) => (
                            <th key={index}>{dia}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {semanas.map((semana, index) => (
                        <tr key={index}>
                            {semana.map(dia => (
                                <td
                                    key={dia.format('YYYY-MM-DD')} style={{ padding: 0 }}>
                                    <button
                                        ref={dia.isSame(moment(), 'day') ? diaAtualRef : null}
                                        className={`dia-calendario ${dia.isSame(dataAtual, 'month') ? '' : Styles.outroMes} ${diaSelecionado && dia.isSame(dia, 'day') && !dia.isBefore(moment(), 'day') ? Styles.selecionado : ''}`}
                                        onClick={() => handleDiaClick(dia)}
                                        disabled={dia.isBefore(moment(), 'day')}
                                        style={dia.isBefore(moment(), 'day') ? { color: '#ccc', cursor: 'default' } : {}}
                                    >
                                        {dia.format('D')}
                                    </button>
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
            {selectedProfessional && (
                <p className={Styles.selectedProfessional}>Profissional: {selectedProfessional}</p>
            )}
        </div>
    );
}

export default Calendar;