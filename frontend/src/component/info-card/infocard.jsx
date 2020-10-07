import React from 'react';
import { connect } from 'react-redux'


import './infocard-styles.scss'

function infocard({ image , user , addMore, profile , LogOut }) {
    return (
        <div className='infocard'>
            <div className="inside-card">
                    {
                         image === false || image === 'false'   ? 
                        
                        <div className='no-picture'>

                        </div> 

                        :

                        <div className="profile-picture" style={{background: 'url(http://localhost:4000'+image+') center center / cover no-repeat'}}>

                        </div>
                    }
            </div>

            <p>{
                user === 'null' || 
                user === undefined || 
                user === false ? 'Usuario no ha iniciado sesión' : user}</p>
            
            <div className="below-card">

                    <button onClick={profile}>Perfil</button>
                    <div className='dropdown'>

                        <button className='dropdown-button'>Mas Opciones <div className='arrow'></div></button>

                        <div className='displayed-dropdown'>
                            <button value='configuration' onClick={addMore}>Agregar pelaje / hierro</button>
                        </div>
                    </div>
                    
                    <div className="log-out" onClick={LogOut}></div>
            </div>      
        </div>
    )
}

const mapStatetoProps = ({user: {currentUser , currentUserImagePath}}) =>{
    return ({
        currentUser, currentUserImagePath
    })
}

const mapDispatchtoProps = ( dispatch )=>(
    {
        logOut: ()=>{dispatch({type:'LOG_OUT'})}
    }
)
export default  connect (mapStatetoProps, mapDispatchtoProps) (infocard);
