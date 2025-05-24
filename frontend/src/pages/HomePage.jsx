import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import Styles from './HomePage.module.css'
import logo from './img/SteniosBarbearia.png'
import background from './img/SteniosBackground.png'
import pontosmenu from './img/menu-dots-vertical.png'
import Carousel from '../components/Carousel.jsx'
import PopupStenio from '../components/PopupStenio.jsx'
import PopupLogin from '../components/PopupLogin.jsx';
import PopupArea from '../components/PopupArea.jsx';

function HomePage() {
    const navigate = useNavigate();
    const [showPopupStenio, setShowPopupStenio] = useState(false);
    const [showPopupLogin, setShowPopupLogin] = useState(false);
    const [showPopupArea, setShowPopupArea] = useState(false);


    function paginaContato(){
        navigate('/contato');
    }

    function paginaSobre(){
        navigate('/sobre');
    }

    const handleCloseLoginPopup = () => {
        setShowPopupLogin(false);
    };

    const handleCloseAreaPopup = () => {
        setShowPopupArea(false);
    };

    const handleLogoClick = () => {
        navigate('/');
    };

    return (
        <div className={Styles.background}>
            <header className={Styles.header}>
                <div className={Styles.imagemcontainer}>
                    <img onClick={handleLogoClick} src={logo} alt='Logo da Stenios Barbearia' className={Styles.logo}/>
                </div>
                <nav>
                    <ul className={Styles.menu}>
                        <li><a className={Styles.home}>Home</a></li>
                        <li><a onClick={paginaContato} className={Styles.contatoButton}>Contato</a></li>
                        <li><a onClick={paginaSobre} className={Styles.sobre}>Sobre</a></li>
                    </ul>
                </nav>
                <button onClick={() => setShowPopupLogin((prev) => !prev)} className={Styles.login}>Login</button>
            </header>
            <button onClick={() => setShowPopupStenio((prev) => !prev)} className={Styles.buttonmenulogin}><img src={pontosmenu}/></button>
            <div className={Styles.containerServicos}>
                <div className={Styles.nServicos}>
                    <p className={Styles.textnServicos}>Nossos Serviços</p>
                </div>
            </div>
            <div className={Styles.centerCarousel}>
                <Carousel/>
            </div>
            <div className={Styles.popupStenio}>
                {showPopupStenio && <PopupStenio onAreaRestritaClick={setShowPopupArea}/>}
            </div>
            <div className={Styles.popupLogin}>
                {showPopupLogin && <PopupLogin onClose={handleCloseLoginPopup}/>}
            </div>
            <div className={Styles.popupArea}>
                {showPopupArea && <PopupArea onClose={handleCloseAreaPopup}/>}
            </div>
            <img src={background} className={Styles.backgroundimage}/>
        </div>
    );
}

export default HomePage;