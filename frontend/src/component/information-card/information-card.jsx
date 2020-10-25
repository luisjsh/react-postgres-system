import React, { Component } from 'react'
import { withRouter } from 'react-router-dom' 
import { connect } from 'react-redux' 

import './information-card-styles.scss'

import ConfirmationCard from '../confirmation-card/confirmation-card'
import SecundaryText from '../secundary-text/secundary-text'
import ItemInformationCard from '../item-information-card/item-information-card'
import DropdownSelect from '../dropdown-select/dropdown-select'
import DropdownInput from '../dropdown-with-input-text/dropdown-with-input'
import TextArea from '../text-area-component/text-area-component'
import CustomInput from '../custom-input/custom-input'
import ButtonConfirmation from '../button-confirmation/button-confirmation'

class informationCard extends Component {
    constructor(props) {
        super(props)

        this.state = {
                name: '',
                fechanac: '',
                goal: '',
                notepad: '',
                pelaje: '',
                tientadia: '',
                tientaresultado: '',
                tientatentadopor: '',
                tientalugar: '',
                tientacaballo: '',
                tientacapa: '',
                tientamuleta: '',

                confirmation: false,

                currentItemArray: false,
                pelajeInformation: false
    }

        this.pelajeSelected = this.pelajeSelected.bind(this);
        this.handleUpdateandMount = this.handleUpdateandMount.bind(this)
        this.formHandler = this.formHandler.bind(this);
        this.applyUpdateEdit = this.applyUpdateEdit.bind(this);
    }

    async componentDidMount ( ) {
        let {id} = this.props
        this.handleUpdateandMount(id)

        await fetch("http://localhost:4000/configuration/getpelaje", {
            method: "GET",
            headers: {
              "x-access-token": this.props.currentToken,
            },
          })
            .then(async (response) => {
              this.setState({ pelajeInformation: await response.json() });
            })
            .catch((e) => alert("error de conexion"));

    }

    componentDidUpdate(){     
      if(this.props.id !== this.state.id){
        this.setState({id: this.props.id})
        this.handleUpdateandMount(this.props.id)
      } 
    }

    async handleUpdateandMount(id){
        await fetch('http://localhost:4000/item/search/profile/' + id)
        .then( async responseArray => {
            let { response } = await responseArray.json()
            console.log(response)
            response && this.setState({currentItemArray: response , id: id , name: response.nombre, pelaje: response.pelajes.nombre, notepad: response.notas})
        })
    }

    formHandler(event) {
        let { name, value } = event.target;
        this.setState({ [name]: value });
    }

    async applyUpdateEdit(event) {
        event.preventDefault();
        let formData = new FormData()

        formData.append('id' , this.props.currentItemArray.id)
        formData.append('nombre' , this.state.name)
        formData.append('pelaje' , this.state.pelaje )
        formData.append('fechanac' , this.state.fechanac)
        formData.append('logro' , this.state.goal)
        formData.append('tatuaje' , this.state.tatuaje)
        formData.append('encaste' , this.state.encaste)
        formData.append('tientaDia' , this.state.tientadia)
        formData.append('tientaTentadoPor' , this.state.tientatentadopor)
        formData.append('tientaLugar' , this.state.tientalugar)
        formData.append('tientaCaballo' , this.state.tientacaballo)
        formData.append('tientaCapa' , this.state.tientacapa)
        formData.append('tientaMuleta' , this.state.tientamuleta)
        try{
            await fetch('http://localhost:4000/item/update',{
            method: 'POST',
            headers:{
                'x-access-token' : this.props.currentToken
            },
            body: formData
                }).then( async response => {
                    
                    let {data} = await response.json()
                    this.setState({currentItemArray: data, goal:data.logros, goalValue: data.logro.nombre, pelaje:data.pelajes.nombre})
                    this.props.handleClick()
                    this.props.updateInformation(this.props.currentItemArray.id)
                    
                    
                }).catch( async error =>{ console.log(error) } )
        } catch(e){
            console.log(e)
        }
    }
        
        pelajeSelected(event) {
            this.setState({ pelaje: event.target.attributes.value.value });
          }
        

    render() {
        return (
            <div >
                {this.state.confirmation && <ConfirmationCard handleClick={()=>this.setState({confirmation: !this.state.confirmation})} />}
                {
                    this.props.currentItemArray ? 
                    
                        this.props.edit  ? 
    
                    <div className="information-card">
                        
                        <CustomInput type='text' label='Nombre' onChange={this.formHandler} name='name' value={this.state.name} placeholder={this.props.currentItemArray.nombre}/>


                        <DropdownInput
                            id='pelaje' 
                            name="pelaje"
                            onChange={this.formHandler}
                            labelName='Pelaje' 
                            value={this.state.pelaje}
                            >
                                
                            {
                                this.state.pelajeInformation ?
                                    this.state.pelajeInformation.response.map(
                                        ({ id, nombre }) =>
                                            nombre
                                            .toLowerCase()
                                            .indexOf(this.state.pelaje.toLowerCase()) > -1 ? (
                                            <button
                                                key={id}
                                                name="pelaje"
                                                value={nombre}
                                                onClick={this.pelajeSelected}
                                            >
                                                {nombre}
                                            </button>
                                            ) : (
                                            ""
                                            )
                                        )
                                    : ""
                            }
                        </DropdownInput>

                        <DropdownSelect
                            labelName='Sexo'
                            value={this.state.currentItemArray.sexo}
                        >
                            <option value="Hembra">Hembra</option>
                            <option value="Macho">Macho</option>
                        </DropdownSelect>
                      
                        <ItemInformationCard id='date' title='Fecha de nacimiento'><span>{this.state.currentItemArray.fechanac}</span></ItemInformationCard>

                    
                                <TextArea value={this.state.notepad}  onChange={this.formHandler} name='notepad' style={{width: '80%'}}></TextArea>
                          
                                <h4>Datos de la tienta</h4>

                            
                        <CustomInput label='Resultado' type='text' onChange={this.formHandler} name='tientaresultado' value={this.state.currentItemArray.tientaresultado} />
                
                        <CustomInput label='Tentado por' type='text' onChange={this.formHandler} name='tientatentadopor' value={this.state.currentItemArray.tientatentadopor} />

                        <CustomInput label='Fecha' type='text' onChange={this.formHandler} name='tientadia' value={this.state.currentItemArray.tientadia}/>

                        <CustomInput label='Lugar' type='text' onChange={this.formHandler} name='tientalugar' value={this.state.currentItemArray.tientalugar}/>

                        <CustomInput label='Capa' type='text' onChange={this.formHandler} name='tientacapa' value={this.state.currentItemArray.tientacapa}/>
                                
                        <CustomInput label='Caballo' type='text' onChange={this.formHandler} name='tientacaballo' value={this.state.currentItemArray.tientacaballo}/>

                        <CustomInput label='Muleta' type='text' onChange={this.formHandler} name='tientamuleta' value={this.state.currentItemArray.tientamuleta}/>

                        <div className="button-section">
                        <ButtonConfirmation handleClose={this.props.handleClick} handleClick={this.applyUpdateEdit} />
                        </div>
                        
                    </div>
    
                        :
    
                    <div className="information-card">
    
                        <SecundaryText title='Nombre:'>{this.state.currentItemArray.nombre}</SecundaryText>

                        <SecundaryText title='Pelaje:'>{this.state.pelaje}</SecundaryText>

                        <SecundaryText id='sexo' title='Sexo:'><span>{this.state.currentItemArray.sexo}</span></SecundaryText>
                      
                        <SecundaryText id='date' title='Fecha de nacimiento:'><span>{this.state.currentItemArray.fechanac}</span></SecundaryText>

                        <SecundaryText title='Notas:'>{this.state.notepad}</SecundaryText>

                        <h4>Datos de la tienta</h4>
                        
                        <SecundaryText title='Resultado:'>{this.state.currentItemArray.tientaresultado}</SecundaryText>
                        
                        <SecundaryText title='Realizado por:'>{this.state.currentItemArray.tientatentadopor}</SecundaryText>
                        
                        <SecundaryText title='Fecha:'>{this.state.currentItemArray.tientadia}</SecundaryText>
                        
                        <SecundaryText title='Lugar:'>{this.state.currentItemArray.tientalugar}</SecundaryText>

                        <SecundaryText title='Capa:'>{this.state.currentItemArray.tientacapa}</SecundaryText>
                        
                        <SecundaryText title='Caballo:'>{this.state.currentItemArray.tientacaballo}</SecundaryText>
                        
                        <SecundaryText title='Muleta:'>{this.state.currentItemArray.tientamuleta}</SecundaryText>

                    </div>
                    
                    :
                    ''
                }
            </div>
        )
    }
}

const mapStatetoProps = ({ item: { currentItemArray } , user: { currentToken } })=> {
    return {
        currentItemArray , currentToken
    }
}

  

export default connect ( mapStatetoProps ) (informationCard)
