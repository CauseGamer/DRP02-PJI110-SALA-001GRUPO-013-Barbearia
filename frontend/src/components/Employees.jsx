import React from "react";
import Styles from './Employees.module.css'

function Employees({ onProfessionalSelect }){
    return(
        <div className={Styles.containerfuncionarios}>
            <div className={Styles.funcionario1}>
                <p>Lucas</p>
                <button onClick={() => onProfessionalSelect('Lucas')}>Selecionar</button>
            </div>
            <div className={Styles.funcionario2}>
                <p>Murilo</p>
                <button onClick={() => onProfessionalSelect('Murilo')}>Selecionar</button>
            </div>
            <div className={Styles.funcionario3}>
                <p>Stenio</p>
                <button onClick={() => onProfessionalSelect('Stenio')}>Selecionar</button>
            </div>
        </div>
    );
}

export default Employees;