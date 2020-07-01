import React from 'react';
import { connect } from 'react-redux'


import './infocard-styles.scss'

function infocard({ image , user , LogOut }) {
    console.log( image == false || image == 'false' )
    return (
        <div className='infocard'>
            <div className="inside-card">
                    {
                         image == false || image == 'false'   ? 
                        
                        <div className='no-picture'>

                        </div> 

                        :

                        <div className="profile-picture" style={{background: 'url(http://localhost:4000'+image+') center center / cover no-repeat'}}>

                        </div>
                    }
            </div>

            <span>{user}</span>
            
            <div className="below-card">

                    <span>Perfil</span>
                    <span>Configuracion</span>
                      
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
