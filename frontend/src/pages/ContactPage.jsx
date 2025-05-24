import React from 'react';
import { useNavigate } from 'react-router-dom';
import Styles from './ContactPage.module.css'
import logo from './img/SteniosBarbearia.png'
import contatoImage from './img/GarotoPropaganda.jpg'
import iconMarker from './img/marker.png'
import iconPhone from './img/phone-flip.png'
import iconInsta from './img/instagram.png'

function ContactPage() {
  const navigate = useNavigate();

  function paginaHome(){
    navigate('/');
  }

  function paginaContato(){
      navigate('/contato');
  }

  function paginaSobre(){
      navigate('/sobre');
  }

  const handleLogoClick = () => {
        navigate('/');
    };

  return (
    <div>
        <header className={Styles.header}>
            <div className={Styles.imagemcontainer}>
                <img onClick={handleLogoClick} src={logo} alt='Logo da Stenios Barbearia' className={Styles.logo}/>
            </div>
            <nav>
                <ul className={Styles.menu}>
                    <li><a onClick={paginaHome} className={Styles.home}>Home</a></li>
                    <li><a onClick={paginaContato} className={Styles.contatoButton}>Contato</a></li>
                    <li><a onClick={paginaSobre} className={Styles.sobre}>Sobre</a></li>
                </ul>
            </nav>
            <div className={Styles.gambi}>
                login
            </div>
        </header>
        <div className={Styles.aligncontato}>
            <li className={Styles.textcontato}>Contato</li>
        </div>
        <div className={Styles.corpopage}>
            <img src={contatoImage} className={Styles.gustavoimage}/>
            <div className={Styles.corpocontato}>
                <li className={Styles.contatoText}>Contato</li>
                <div className={Styles.containercontato}>
                    <div className={Styles.marker}>
                        <img src={iconMarker} alt='icone de marcação' className={Styles.iconmarker}/>
                        <li><a href="https://www.google.com/maps/place/Barbearia+Stenio's/@-23.9762195,-46.2254358,17z/data=!3m1!4b1!4m6!3m5!1s0x94ce01439946af7f:0x8aad6db98e1f1b9b!8m2!3d-23.9762195!4d-46.2254358!16s%2Fg%2F11h41gvwcy?entry=ttu&g_ep=EgoyMDI1MDQwNi4wIKXMDSoJLDEwMjExNjQwSAFQAw%3D%3D" target='_blank' className={Styles.enderecoText}>Av. Manoel Alves de Moraes - Balneario <br/>Guarujá, Guarujá - SP, 11441-105</a></li>
                    </div>
                    <div className={Styles.phone}>
                        <img src={iconPhone} alt='icone de telefone' className={Styles.iconphone}/>
                        <li><a href="https://api.whatsapp.com/send?phone=5513991999025" target='_blank' className={Styles.numeroText}>(13)99199-9025</a></li>
                    </div>
                    <div className={Styles.insta}>
                        <img src={iconInsta} alt='icone do instagram' className={Styles.iconinsta}/>
                        <li><a href="https://www.instagram.com/barbeariastenios/" target='_blank' className={Styles.instaText} >@barbeariastenios</a></li>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
}
export default ContactPage;