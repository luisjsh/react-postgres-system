import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import './signup-page-styles.scss';


import Custombutton from '../custom-button/custom-button';
import CarouselAdd from '../image-carousel-add/image-carousel-add';
import CustomInput from '../custom-input/custom-input';
import SecurityQuestions from '../security-questions-modal/security-questions'
import ImageAside from '../item-information-card/item-information-card'

class signUpPage extends React.Component {  
    constructor (props){
        super(props);
        this.state={
            loadError: false, 

            url: false,
            view: false,
            photos: false,
            admin: false,
            files: [],
            x: 0,
            email: '',
            password: '',
            repeatPassword: '',
            inputBorderColor: '#DEDEDE',
            name: '',
            emailLabel: 'Correo',
            repeatPasswordLabel: 'Repita la contraseña',
            repeatPasswordBorderColor: '#DEDEDE'
        }

        let error = false 

        this.handleFile = this.handleFile.bind(this);
        this.PhotoChanger = this.PhotoChanger.bind(this);
        this.formHandler = this.formHandler.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.Show = this.Show.bind(this);
        this.DontShow = this.DontShow.bind(this);
    }


 
    //-----------input type file ----------------
    handleFile (event){

        if( event.target.files !== undefined){
            let photosFile = []
            let i=0;
            for ( i = 0; i<event.target.files.length; i++){
                let url = URL.createObjectURL(event.target.files[i])
                photosFile.push({id: i, file: url })
            }
            this.setState({ files: event.target.files , photos: photosFile})
        }

        if (event.target.files[0] !== undefined ){        
        let url = URL.createObjectURL(event.target.files[0])
        this.setState({url: url})       
        }
    }
    
    //---------------- input-form ----------------------

    formHandler( event ){
        let { name, value } = event.target
        this.setState({[name]: value})
    }

    //---------------PhotoChanger ---------------

    PhotoChanger ( event ){
        this.setState({url: event.target.attributes.value.value}) //when its clicked the url state changes to a new one   
    }
    //-------------------------------------------

    //--------------- handleSubmit -----------------

    async handleSubmit ( firstQuestion, firstQuestionAnswer, secondQuestion, secondQuestionAnswer ){
        
        if (this.state.password === this.state.repeatPassword ){
            this.setState({repeatPasswordLabel: 'Las contraseñas coinciden' ,repeatPasswordBorderColor: 'green'})
        let formData = new FormData();
        formData.append('correo', this.state.email)
        formData.append('contrasena', this.state.password)
        formData.append('admin', this.state.admin)
        formData.append('nombre', this.state.name)
        formData.append('primerapregunta', firstQuestion)
        formData.append('primerapreguntarespuesta', firstQuestionAnswer)
        formData.append('segundapregunta', secondQuestion)
        formData.append('segundapreguntarespuesta', secondQuestionAnswer)

        if ( this.state.files != null){
            for( let i = 0; i<this.state.files.length; i++){
                formData.append('image', this.state.files[i])
                }
        }


        await fetch('http://localhost:4000/user/add',{
            method: 'POST',
            body: formData
        }).then ( async ( response ) => {
            let {message, token} = await response.json()
            
            switch(message){
                case 'succedd':
                    this.setState({emailLabel: 'Correo Valido', inputBorderColor: 'green'})
                    this.props.saveToken(token);
                    this.DontShow();
                    this.props.history.push('/')
                    break;
                
                case 'llave':
                    this.setState({emailLabel: 'Por favor introduzca otro correo', inputBorderColor: 'red'})
                    break;

                case 'error db':
                    alert('error de servidor')
                    this.props.history.push('/')
                    break;
            }
        }).catch( e =>{
            console.log('recuerde iniciar el servidor!')
        })
    } else {
        this.setState({repeatPasswordLabel: 'Las contraseñas no coinciden' , repeatPasswordBorderColor: 'red'})
    }
    }


    //---------------- modal section ---------------

    Show (event) {
        event.preventDefault()
        this.setState({view: true}) //the modal will appear
    } 
    
    DontShow (){
        this.setState({view: false}) //when executed, the modal will disappear
    }
    //----------------------------------------------


    render(){

        return(
            <form onSubmit={this.Show}>
            <div className='signup-page'>

                {
                this.state.view ? <SecurityQuestions handleClick={this.DontShow} onSubmit={this.handleSubmit}></SecurityQuestions>: ''
                }

                <CarouselAdd  photoChanger={this.PhotoChanger} url={this.state.url} handleFile={this.handleFile} photos={this.state.photos}/>
            
                <div className="information-section">
                    <span>Informacion</span>
                <div className="information">
                    <div className="input-section">
                    
                    <ImageAside id='name'>
                        <CustomInput name='name' onChange={this.formHandler} value={this.state.name} label='Nombre'></CustomInput>
                    </ImageAside>
                    
                    <ImageAside id='mail'>
                        <CustomInput type='email' name='email' onChange={this.formHandler} value={this.state.email} label={this.state.emailLabel} style={{border: '1px solid '+ this.state.inputBorderColor}}></CustomInput>
                    </ImageAside>

                    <ImageAside id='lock'>
                        <CustomInput name='password' onChange={this.formHandler} value={this.state.password} label='Contraseña'></CustomInput>
                    </ImageAside>

                    <ImageAside id='lock'>
                        <CustomInput name='repeatPassword' onChange={this.formHandler} value={this.state.repeatPassword} label={this.state.repeatPasswordLabel} style={{border: '1px solid ' + this.state.repeatPasswordBorderColor}}></CustomInput>
                    </ImageAside>
                    
                {
                    this.props.currentUserAdmin ? 

                    <ImageAside id='admin'>
                        <div className="admin-section">
                            <span>Administrador</span>
                            <div className='switch'>
                                <input id='switch-1' type='checkbox' onClick={()=>{ this.setState({ admin: !this.state.admin })}} className='switch-input'/>
                                <label htmlFor='switch-1' className="switch-label"></label>
                            </div>
                        </div>
                    </ImageAside>

                    :

                    ''
                }


                </div>
                </div>
                <div className="button-side">
                <div className="button-pack">
                <Custombutton color='primary-blue'>Registrarse</Custombutton>
                </div>
                </div>
                </div>
       
            </div></form>
        )
    }
}

const mapDispatchtoProps = (dispatch) =>(
    {
        saveToken: (token) => {dispatch({ type:'SAVE-TOKEN' , payload: token})}
    }
)

const mapStatetoProps = ({
    user:{
        currentUserAdmin
    }
  }) => {
    return {
        currentUserAdmin
    };
  };


export default connect(mapStatetoProps, mapDispatchtoProps) (withRouter(signUpPage))