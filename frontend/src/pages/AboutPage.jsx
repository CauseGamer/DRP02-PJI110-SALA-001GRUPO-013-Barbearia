import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from './img/SteniosBarbearia.png'
import imgquadrinho from './img/SteniosEmQuadrinho.png'
import Styles from './AboutPage.module.css'
import servicos from './servicossobre.json'

function AboutPage() {
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
      <div className={Styles.servicossobre}>
        <img src={imgquadrinho} alt="Stenios em quadrinho" className={Styles.quadrinho} />
        <div className={Styles.servicos}>
          {servicos.map((servicos, index) => (
            <div key={index}>
              <h3>{servicos.titulo}</h3>
              <p>
                {servicos.descricao.map((linha, i) => (
                  <React.Fragment key={i}>
                    {linha}
                    {i < servicos.descricao.length - 1 && <br/>}
                  </React.Fragment>
                ))}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AboutPage;