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

        this.handleFile = this.handleFile.bind(this);
        this.PhotoChanger = this.PhotoChanger.bind(this);
        this.formHandler = this.formHandler.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
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

    //--------------- onSubmit -----------------

    async onSubmit ( firstQuestion, firstQuestionAnswer, secondQuestion, secondQuestionAnswer ){
        
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
            let json = await response.json()
            if (json.detail.search('llave') >= 0 ){
                this.setState({emailLabel: 'Por favor introduzca otro correo', inputBorderColor: 'red'})
            }else {
                this.setState({emailLabel: 'Correo Valido', inputBorderColor: 'green'})
                this.props.saveToken(json.token);
                this.DontShow();
                this.props.history.push('/')
            }
             
        }).catch( e =>{
            alert('Error de conexion')
        })
    } else {
        this.setState({repeatPasswordLabel: 'Las contraseñas no coinciden' , repeatPasswordBorderColor: 'red'})
    }
    }


    //---------------- modal section ---------------

    Show () {
        this.setState({view: true}) //the modal will appear
    } 
    
    DontShow (){
        this.setState({view: false}) //when executed, the modal will disappear
    }
    //----------------------------------------------


    render(){
        return(
            <div className='signup-page'>

                {
                this.state.view ? <SecurityQuestions handleClick={this.DontShow} onSubmit={this.onSubmit}></SecurityQuestions>: ''
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
                        <CustomInput type='password' name='password' onChange={this.formHandler} value={this.state.password} label='Contraseña'></CustomInput>
                    </ImageAside>

                    <ImageAside id='lock'>
                        <CustomInput type='password' name='repeatPassword' onChange={this.formHandler} value={this.state.repeatPassword} label={this.state.repeatPasswordLabel} style={{border: '1px solid ' + this.state.repeatPasswordBorderColor}}></CustomInput>
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
                <Custombutton color='primary-blue' onClick={this.Show}>Registrarse</Custombutton>
                </div>
                </div>
                </div>
       
            </div>
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