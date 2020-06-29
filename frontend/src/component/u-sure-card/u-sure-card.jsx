import React from 'react'

import Modal from '../modal/modalComponent'
import './u-sure-card-style.scss'
import CustomButton from '../custom-button/custom-button'

const uSureCard = ({handleClick, handleSubmit, handleAddAnother})=>(
    <Modal handleClick={handleClick}>
        <div className='background'>    
            <div className="card">
                <div className="button-section">

                <CustomButton color='secundary-red' onClick={handleClick} style={{width: '160px', margin: '10px'}}>cancelar</CustomButton>

                <CustomButton color='secundary-blue' onClick={handleAddAnother} style={{width: '160px', margin: '10px'}}>Subir Otro</CustomButton>


                <CustomButton color='primary-blue' onClick={handleSubmit} style={{width: '360px', margin: '10px'}} >Ir a Inicio</CustomButton>

                </div>
            </div>
        </div>
    </Modal>
)


export default uSureCard