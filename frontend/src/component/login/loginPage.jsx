import React from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'


import './login-style.scss'

import CustomInput from '../custom-input/custom-input';
import CustomButton from '../custom-button/custom-button';
import ImageAtSide from '../item-information-card/item-information-card'

class LogIn extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            email: '',
            emailLabel: 'Correo',
            emailBorderColor: '#dedede',

            password: '',
            passwordLabel: 'Contraseña',
            passwordBorderColor: '#dedede'
        }
        this.Redirect = this.Redirect.bind(this);
        this.submit = this.submit.bind(this);
        this.formHandler = this.formHandler.bind(this)
    }

    //---- Redirect ----

    Redirect(event){
        let value = event.target.attributes.value.value;
        this.props.history.push('/'+value)
    }


//---------- form handler ---------

    formHandler ( event ){
        let { name, value } = event.target
        this.setState({[name]:value})
    }



//-------- on submit --------------

    async submit (event){
        event.preventDefault()
        let formData = new FormData()
        formData.append('correo', this.state.email)
        formData.append('clave', this.state.password)
        await fetch('http://localhost:4000/user/login', {
            method: 'POST',
            body: formData
        }).then( async response =>{
            let responsejson = await response.json()

            switch(responsejson.status){
                
                case 'password approved':
                    let userInformation = {
                        id: responsejson.userInformation.id,
                        name: responsejson.userInformation.nombre,
                        token: responsejson.token,
                        path: responsejson.userInformation.usuariosimagenes[0] !== undefined ? responsejson.userInformation.usuariosimagenes[0].path : false
                    }
                        this.props.login(userInformation);
                        this.props.history.push('/')
                break;

                case 'wrong':
                    this.setState({passwordLabel: 'Clave invalida', passwordBorderColor: 'red'})
                    break;

                case 'email':
                    this.setState({emailLabel: 'Correo invalido', emailBorderColor: 'red'})
                    break;
                
                    case 'bad db':
                        alert('Error de servidor');
                    break;

                default: 
            }
            }).catch( error => {
                alert('Error de Conexion')
            })
    }

    render(){
        return(
            <form onSubmit={this.submit}>
            <div className='login'>
                
                <div className="login-section" onKeyDown={ (event)=>{if(event.keyCode === '13'){this.submit(event)}}}>
                    
                    <div className="login-card">
                        <span className='iniciar-sesion'></span>
                        
                        <div className="try" style={{display: 'flex', flexDirection: 'column', width: '100%'}}>
                        <ImageAtSide id='mail' title='Correo'>
                            <CustomInput name='email' type='email' label={this.state.emailLabel} style={{border: '1px solid '+ this.state.emailBorderColor}} value={this.state.email} onChange={this.formHandler}></CustomInput>
                        </ImageAtSide>
                        <ImageAtSide id='lock' title='Contraseña'>
                            <CustomInput name='password' type='password' label={this.state.passwordLabel} style={{border: '1px solid '+ this.state.passwordBorderColor}} value={this.state.password} onChange={this.formHandler}></CustomInput>
                        </ImageAtSide>
                        </div>

                        <div className="captchap">

                        </div>
                        <CustomButton value='login' color='primary-blue'>Iniciar Sesión</CustomButton>
                    </div>
                    
                    <span> Recuperar contraseña </span>
                    <span value='signup' onClick={this.Redirect}> Registrarse </span>
                </div>

            </div>
            </form>
        )
    }
}

const mapDispatchtoProps = ( dispatch )=>(
    {
        login: (token)=>{ dispatch({ type: 'LOG_IN', payload: token})}
    }
)

export default connect (null, mapDispatchtoProps) (withRouter(LogIn))