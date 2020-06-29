import React from 'react';
import { connect } from 'react-redux'


import './infocard-styles.scss'

function infocard(props) {
    return (
        <div className='infocard'>
            <div className="inside-card">
                            <div className="profile-picture" style={{background: 'url(http://localhost:4000'+props.currentUserImagePath+') center center / cover no-repeat'}}>

                            </div>
            </div>
            <div className="below-card">

                        <span>Perfil</span>
                        <span>Configuracion</span>
                      
                        <div className="log-out" onClick={props.LogOut}></div>
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
