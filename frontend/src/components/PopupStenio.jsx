import React, {useState} from 'react';
import Styles from './PopupStenio.module.css'

function PopupStenio({ onAreaRestritaClick}){
    return (
        <div>
            <div onClick={() => onAreaRestritaClick((prev) => !prev)} className={Styles.popup}>
                <button>Área restrita</button>
            </div>
        </div>
    );
}

export default PopupStenio;