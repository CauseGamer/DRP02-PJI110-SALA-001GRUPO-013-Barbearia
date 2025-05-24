import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Styles from './PopupArea.module.css';

function PopupArea({ onClose }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loginError, setLoginError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async () => {
        setLoginError('');

        if (!username || !password) {
            setLoginError('Por favor, preencha o nome de usuário e a senha.');
            return;
        }

        try {
            const response = await fetch('/api/admin-login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ nome: username, senha: password }),
            });

            const data = await response.json();

            if (response.ok && data.success) {
                navigate('/admin');
                onClose();
            } else {
                setLoginError(data.message || 'Erro desconhecido no login.');
            }
        } catch (error) {
            console.error('Erro ao tentar fazer login de administrador:', error);
            setLoginError('Erro de conexão. Tente novamente mais tarde.');
        }
    };

    return (
        <div className={Styles.popupOverlay}>
            <div className={Styles.loginContainer}>
                <button className={Styles.closeButton} onClick={onClose}>X</button>
                <h2>Acesso Restrito - Administrador</h2>
                {loginError && <p className={Styles.error}>{loginError}</p>}

                <div className={Styles.inputGroup}>
                    <label htmlFor="username">Usuário:</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Nome de usuário"
                    />
                </div>

                <div className={Styles.inputGroup}>
                    <label htmlFor="password">Senha:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Senha"
                    />
                </div>

                <button onClick={handleLogin} className={Styles.loginButton}>
                    Entrar como Administrador
                </button>
            </div>
        </div>
    );
}

export default PopupArea;
