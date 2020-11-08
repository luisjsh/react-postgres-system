import React, { Component } from 'react'
import { connect } from 'react-redux' 
import { withRouter } from 'react-router-dom'

import './change-password-style.scss'
import CustomButton from '../custom-button/custom-button'
import CustomInput from '../custom-input/custom-input'

class ChangePassword extends Component {
    constructor(props) {
        super(props)

        this.state = {
                 validation: false,
                 primeraPregunta: '',
                 segundaPregunta: '',
                 password: '',
                 passwordConfirmation: '',
                 buttonText: 'Siguiente'
        }
        this.formHandler = this.formHandler.bind(this)
        this.onSubmit = this.onSubmit.bind(this)
        this.changePassword = this.changePassword.bind(this)
    }

    componentDidMount(){
        console.log(this.props.currentUserArray)
    }

//---------------- input-form ----------------------

    formHandler( event ){
        let { name, value } = event.target
        this.setState({[name]: value})
    }

//-------------------- on submit -------------------

    onSubmit(){
        if (this.props.currentUserArray.primerapreguntarespuesta === this.state.primeraPregunta && 
            this.props.currentUserArray.segundapreguntarespuesta === this.state.segundaPregunta ){

            this.setState({ validation: true})
        
        } else{ 
        
            this.props.setBadNotification('Las respuestas a las preguntas de seguridad son incorrectas') 
        
        }
    }

    async changePassword(){
        if( this.state.password === this.state.passwordConfirmation){
            let formData = new FormData()
            formData.append('clave', this.state.password)
            formData.append('id', this.props.currentUserArray.id)
            try{
                await fetch('/user/changepassword', {
                    method: 'POST',
                    body: formData
                }).then( async (response)=>{
                    let {message} = await response.json()
                    console.log(message)
                    
                    if(message === 'updated'){
                        this.props.setGoodNotification('Guardado con exito')
                        this.props.history.push('/')
                    }

                    if(message === 'user not db'){
                        this.props.setBadNotification('El usuario no fue encontrado en el servidor')
                        this.props.history.push('/')
                    }

                    if(message === 'server error'){
                        this.props.setBadNotification('Error de servidor')
                    }
                })
            } catch (e){
                this.props.setBadNotification('Error de conexion')
            }        
        } else {
            this.props.setBadNotification('Las contraseñas no coinciden')
        }
    }


    render() {
        return (
            <div className='change-password-page'>

                {

                    this.props.currentUserArray ?
                    
                    this.state.validation ?

                    <div className='security-password-section'>
                         <span>Introduzca la nueva contraseña</span>
                         <CustomInput 
                            name='password' 
                            value={this.state.password} 
                            handleClick={this.formHandler} 
                            handleChange={this.formHandler} />

                         <span>Confirme la contraseña</span>

                         <CustomInput 
                            type='text' 
                            name='passwordConfirmation' 
                            value={this.state.passwordConfirmation} 
                            handleClick={this.formHandler} 
                            handleChange={this.formHandler}/>

                         <CustomButton color='primary-blue' onClick={this.changePassword}>Cambiar contraseña</CustomButton> 

                    </div>

                    :

                    <div className="security-password-section">
                    <span> {this.props.currentUserArray.primerapregunta} </span>

                        <CustomInput 
                        name='primeraPregunta' 
                        value={this.state.primeraPregunta} 
                        handleClick={this.formHandler} 
                        handleChange={this.formHandler} />
                        
                    <span> {this.props.currentUserArray.segundapregunta} </span>
                        <CustomInput 
                        name='segundaPregunta' 
                        value={this.state.segundaPregunta} 
                        handleClick={this.formHandler} 
                        handleChange={this.formHandler} />

                    <CustomButton color='primary-blue' onClick={this.onSubmit}>{this.state.buttonText}</CustomButton>
                    </div>

                    :

                    this.props.history.push('/')

                }

            </div>
        )
    }
}

const mapDispatchtoProps = (dispatch) =>(
    {
        setBadNotification: (message)=>{dispatch({type:'SET_BAD_NOTIFICATION', payload: message})},
        setGoodNotification: (message)=>{dispatch({type:'SET_GOOD_NOTIICATION', payload: message})}
    }
)

const mapStatetoProps = ({ user: { currentUserArray }}) =>{
    return ({
        currentUserArray
    })
}

export default connect (mapStatetoProps, mapDispatchtoProps) ( withRouter(ChangePassword) )
