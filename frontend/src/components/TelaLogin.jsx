import React, { useState } from 'react';
import Styles from './TelaLogin.module.css';

function TelaLogin({ onLoginSuccess }) {
    const [name, setName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [loginError, setLoginError] = useState('');

    // Função para formatar o número de telefone conforme o usuário digita
    const formatPhoneNumber = (value) => {
        if (!value) return value;
        const phoneNumber = value.replace(/[^\d]/g, ''); // Remove tudo que não for dígito
        const phoneNumberLength = phoneNumber.length;

        if (phoneNumberLength < 3) return phoneNumber; // Ex: (XX
        if (phoneNumberLength < 7) { // Ex: (XX) XXXX
            return `(${phoneNumber.slice(0, 2)}) ${phoneNumber.slice(2)}`;
        }
        if (phoneNumberLength < 11) { // Ex: (XX) XXXX-XXXX (fixo) ou (XX) XXXXX-XXXX (celular)
            return `(${phoneNumber.slice(0, 2)}) ${phoneNumber.slice(2, 6)}-${phoneNumber.slice(6, 10)}`;
        }
        // Para celular com 9 dígitos: (XX) 9XXXX-XXXX
        return `(${phoneNumber.slice(0, 2)}) ${phoneNumber.slice(2, 7)}-${phoneNumber.slice(7, 11)}`;
    };

    // Função para validar o formato final do número de telefone (usando regex)
    const isValidPhoneNumber = (number) => {
        // Regex para (XX) XXXXX-XXXX ou (XX) XXXX-XXXX
        const regex = /^\(\d{2}\) \d{4,5}-\d{4}$/;
        return regex.test(number);
    };

    const handlePhoneNumberChange = (e) => {
        const formatted = formatPhoneNumber(e.target.value);
        setPhoneNumber(formatted);
        // Limpa o erro se o usuário começar a corrigir
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

        // Se tudo estiver válido, continua
        onLoginSuccess({ name, phoneNumber });
    };

    // Determina se o botão deve estar desabilitado
    const isButtonDisabled = !name || !isValidPhoneNumber(phoneNumber);

    return (
        <div className={Styles.loginContainer}>
            <h2>Informações para Agendamento</h2>
            {loginError && <p className={Styles.error}>{loginError}</p>}

            <div className={Styles.inputGroup}>
                <label htmlFor="name">Nome:</label>
                <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
            </div>

            <div className={Styles.inputGroup}>
                <label htmlFor="phoneNumber">Número de Celular:</label>
                <input
                    type="tel"
                    id="phoneNumber"
                    value={phoneNumber}
                    onChange={handlePhoneNumberChange} // Usa a nova função de mudança
                    maxLength="15" // Define o tamanho máximo para o formato (XX) XXXXX-XXXX
                    placeholder="(DD) XXXXX-XXXX"
                />
            </div>

            <button onClick={handleContinue} className={Styles.loginButton} disabled={isButtonDisabled}>
                Continuar Agendamento
            </button>
        </div>
    );
}

export default TelaLogin;