import React, { useEffect, useState, useRef} from 'react';
import Styles from './Carousel.module.css'
import servicos from '../pages/servicoshome.json'
import setaleft from '../pages/img/angle-left.png'
import setarigth from '../pages/img/angle-right.png'
import { useNavigate } from 'react-router-dom';

function Carousel() {
    const carousel = useRef(null);
    const navigate = useNavigate();

    const handleLeftClick = (e) =>{
        e.preventDefault();
        carousel.current.scrollLeft -= carousel.current.offsetWidth;
    }

    const handleRightClick = (e) =>{
        e.preventDefault();
        carousel.current.scrollLeft += carousel.current.offsetWidth;
    }

    const handleAgendarClick = (id) => {
        navigate(`/agendar?servicoId=${id}`);
    };

    return(
        <div className={Styles.containerCarousel}>
            <button onClick={handleLeftClick} className={Styles.setaEsquerda}><img src={setaleft} alt="seta para a esquerda" /></button>
            <div className={Styles.carousel} ref={carousel}>
                {servicos.map((item) => {
                    const {id, titulo, tempo, valor} = item;
                    return(
                        <div className={Styles.item} key={id}>
                            <div className={Styles.info}>
                                <span className={Styles.name}>{titulo}</span>
                                <span className={Styles.tempo}>{tempo}</span>
                                <span className={Styles.valor}>{valor}</span>
                            </div>
                            <div className={Styles.buttonAgendar}>
                                <button onClick={() => handleAgendarClick(id)} className={Styles.agendar} key={id}>Agendar</button>
                            </div>
                        </div>
                    );
                })}
            </div>
            <button onClick={handleRightClick} className={Styles.setaDireita}><img src={setarigth} alt="seta para a direita" /></button>
        </div>
    );
}

export default Carousel;