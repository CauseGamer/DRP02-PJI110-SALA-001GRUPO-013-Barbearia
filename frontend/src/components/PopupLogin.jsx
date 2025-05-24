import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import Styles from './PopupLogin.module.css';

function PopupLogin({ onClose }) { 
    const [name, setName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [loginError, setLoginError] = useState('');
    const navigate = useNavigate();

    const formatPhoneNumber = (value) => {
        if (!value) return value;
        const phoneNumber = value.replace(/[^\d]/g, '');
        const phoneNumberLength = phoneNumber.length;

        if (phoneNumberLength < 3) return phoneNumber;
        if (phoneNumberLength < 7) {
            return `(${phoneNumber.slice(0, 2)}) ${phoneNumber.slice(2)}`;
        }
        if (phoneNumberLength < 11) {
            return `(${phoneNumber.slice(0, 2)}) ${phoneNumber.slice(2, 6)}-${phoneNumber.slice(6, 10)}`;
        }
        return `(${phoneNumber.slice(0, 2)}) ${phoneNumber.slice(2, 7)}-${phoneNumber.slice(7, 11)}`;
    };

    const isValidPhoneNumber = (number) => {
        const regex = /^\(\d{2}\) \d{4,5}-\d{4}$/;
        return regex.test(number);
    };

    const handlePhoneNumberChange = (e) => {
        const formatted = formatPhoneNumber(e.target.value);
        setPhoneNumber(formatted);
        if (loginError && isValidPhoneNumber(formatted)) {
            setLoginError('');
        }
    };

    const handleContinue = () => {
        if (!name) {
            setLoginError('Por favor, preencha seu nome.');
            return;
        }
        if (!phoneNumber) {
            setLoginError('Por favor, preencha seu número de celular.');
            return;
        }
        if (!isValidPhoneNumber(phoneNumber)) {
            setLoginError('Por favor, insira um número de celular válido no formato (XX) XXXXX-XXXX ou (XX) XXXX-XXXX.');
            return;
        }

        const userData = { name, phoneNumber };
        navigate('/agendamentos', { state: { userData: userData } });
        onClose(); 
    };

    const isButtonDisabled = !name || !isValidPhoneNumber(phoneNumber);

    return (
        <div className={Styles.popupOverlay}> 
            <div className={Styles.loginContainer}>
                <button className={Styles.closeButton} onClick={onClose}>X</button>
                <h2>Aceder aos Meus Agendamentos</h2>
                {loginError && <p className={Styles.error}>{loginError}</p>}

                <div className={Styles.inputGroup}>
                    <label htmlFor="name">Nome:</label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Seu nome completo"
                    />
                </div>

                <div className={Styles.inputGroup}>
                    <label htmlFor="phoneNumber">Número de Celular:</label>
                    <input
                        type="tel"
                        id="phoneNumber"
                        value={phoneNumber}
                        onChange={handlePhoneNumberChange}
                        maxLength="15"
                        placeholder="(DD) XXXXX-XXXX"
                    />
                </div>

                <button onClick={handleContinue} className={Styles.loginButton} disabled={isButtonDisabled}>
                    Ver Meus Agendamentos
                </button>
            </div>
        </div>
    );
}

export default PopupLogin;