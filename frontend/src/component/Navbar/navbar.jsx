import React from 'react'
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import './navbar-style.scss'
import SearchBar from '../search-bar/search-bar'
import validator from '../../functions/validator'

class Nav extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            user: null,
            admin: false
        }
        this.Redirect = this.Redirect.bind(this);
        this.LogOut = this.LogOut.bind(this);
        this.correctHeight = this.correctHeight.bind(this);
        this.setUserForProfile = this.setUserForProfile.bind(this);
        this.UpdateStatus = this.UpdateStatus.bind(this)
    }


    //--------- Admin validation ---------


     componentDidMount(){

        this.UpdateStatus()
    }


    //----------------- update 4 admin --------------

     componentDidUpdate(){
        this.UpdateStatus()
    }


    async UpdateStatus ( ){
        if ( this.props.currentToken !== null ){

            await fetch("http://localhost:4000/user/admin", {
                method: "GET",
                headers: {
                  "Content-type": "application/json",
                  "x-access-token": this.props.currentToken,
                },
              })
                .then(async (response) => {
                  let { detail } = await response.json();
    
                  let validated = await validator ( detail , this.props.history, this.props.logOut)
               
                  if (validated) {
                      
                    this.props.admin();
                  }
    
                })
                .catch((e) => console.log("ERROR"));
            }
    }

    //------------- Redirect ---------

    Redirect (event){
        let value = event.target.attributes.value.value;
        this.props.history.push('/'+value)
    }

    //--------------- correct height ---------------------

    correctHeight(){
        this.setState({height: '40px'})
    }

    //--------------- LogOut ----------

    LogOut(){
        this.props.logOut()
    }

    //--------------- image fetch ----------------------

    async setUserForProfile(event){
        await fetch('http://localhost:4000/user/profile/',{
            method:'GET',
            headers:{
                'Content-type' :'application/json',
                'x-access-token' : this.props.currentToken
            }
        } ).then(async response =>{
            if (response.status === 401 ){
                alert('Por favor vuelva a iniciar sesion')
                this.props.history.push('/login')
            } else {
            let { userInformation } = await response.json()
            this.props.setUser(userInformation[0])
            this.props.history.push('/profile/')
            }
        }).catch( e =>{
            console.log(e)
        })
    }

    //--------------------------------------------------

    render(){
        return(
            <div>
                <nav className='navbar'>
                    <div className="logo" value='' onClick={this.Redirect} tabIndex={0}>

                    </div>
                        <SearchBar/>
                    {
                        this.props.currentUser !== null  ?
                        
                    <div className='info-section'>
                    <button className='info' style={{background: 'url(http://localhost:4000'+this.props.currentUserImagePath+') center center / 80px no-repeat'}}>
                      
                    </button>    

                    <div className='information-card'>
                        <div className="inside-card">
                            <div className="profile-picture" style={{background: 'url(http://localhost:4000'+this.props.currentUserImagePath+') center center / cover no-repeat'}}>

                            </div>
                        </div>
                        <div className="below-card">

                        <span onClick={this.setUserForProfile}>Perfil</span>
                        <span value='configuration' onClick={this.Redirect}>Configuración</span>
                      
                        <div className="log-out" onClick={this.LogOut}></div>
                        </div>                        
                    </div>
   

                    </div>

                        :      
                    
                    
                    <button className='profile-info' value='login' onClick={this.Redirect}>
                        Iniciar Sesion
                    </button>

                    } 

                    {this.props.currentUserAdmin ? 
                            <button
                            value="add-res"
                            tabIndex={3}
                            className='button'
                            onClick={this.Redirect}
                            ></button>
                             : 
                                    ""
                    }   
                </nav>

                <div className="navbar-bottom"  >
                    <div className="home-button" value='' onClick={this.Redirect}  tabIndex={0}>

                    </div>
                    <div className="trofeos-button" value='trofeo'  onClick={this.Redirect} tabIndex={0}>

                    </div>
                    {
                        this.props.currentUser != null ?

                        <div className="information"  value='infocard'   tabIndex={0} onFocus={this.Redirect}>
                            <div className="info" style={{background: 'url(http://localhost:4000'+this.props.currentUserImagePath+') center center / 60px no-repeat'}}>
                              
                            </div>
                        </div>

                        :

                        <div className="log-in"  value='login' onClick={this.Redirect} tabIndex={0}>

                        </div>
                    }
                </div>
                
            </div>
        )
    }
}


const mapStatetoProps = ({user: {currentUser , currentUserAdmin, currentUserImagePath, currentToken}}) =>{
    return ({
        currentUser, currentUserAdmin, currentUserImagePath, currentToken
    })
}

const mapDispatchtoProps = ( dispatch )=>(
    {
        admin: () => dispatch({ type: "ADMIN" }),
        logOut: ()=>{dispatch({type:'LOG_OUT'})},
        setUser: user =>{dispatch({type:'SET_CURRENT_USER' , payload: user})}
    }
)

export default  connect (mapStatetoProps, mapDispatchtoProps) (withRouter(Nav))