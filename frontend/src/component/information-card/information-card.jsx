import React, { Component } from 'react'
import { withRouter } from 'react-router-dom' 
import { connect } from 'react-redux' 

import './information-card-styles.scss'

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
            console.log(response.nombre)
            this.setState({currentItemArray: response , id: id , name: response.nombre, pelaje: response.pelajes.nombre, notepad: response.notas})
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
        formData.append('notas' , this.state.notepad)

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
 
        }
       
        pelajeSelected(event) {
            this.setState({ pelaje: event.target.attributes.value.value });
          }
        

    render() {
        return (
            <div >
                {
                    this.props.currentItemArray ? 
                    
                        this.props.edit  ? 
    
                    <div className="information-card">
                        
                        <ItemInformationCard id='name' title='Nombre'><CustomInput type='text' onChange={this.formHandler} name='name' value={this.state.name} placeholder={this.props.currentItemArray.nombre}/> </ItemInformationCard>

                        <ItemInformationCard id='hair' title='Pelaje'>

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

                        </ItemInformationCard>

                        <ItemInformationCard id='sexo' title='Sexo'><span>{this.state.currentItemArray.sexo}</span></ItemInformationCard>
                      
                        <ItemInformationCard id='date' title='Fecha de nacimiento'><span>{this.state.currentItemArray.fechanac}</span></ItemInformationCard>

                    
                        <ItemInformationCard id='notepad' title='Notas'>
                                <TextArea value={this.state.notepad}  onChange={this.formHandler} name='notepad' style={{width: '80%'}}></TextArea>
                        </ItemInformationCard>

                            
                        <div className="button-section">
                        <ButtonConfirmation handleClose={this.props.handleClick} handleClick={this.applyUpdateEdit} />
                        </div>
                        
                    </div>
    
                        :
    
                    <div className="information-card">
    
                        <ItemInformationCard id='name' title='Nombre'><span>{this.state.currentItemArray.nombre}</span></ItemInformationCard>

                        <ItemInformationCard id='hair' title='Pelaje'><span>{this.state.pelajes}</span></ItemInformationCard>

                        <ItemInformationCard id='sexo' title='Sexo'><span>{this.state.currentItemArray.sexo}</span></ItemInformationCard>
                      
                        <ItemInformationCard id='date' title='Fecha de nacimiento'><span>{this.state.currentItemArray.fechanac}</span></ItemInformationCard>


                        <ItemInformationCard id='notepad' title='Notas'><span className='notepad'>{this.state.notepad}</span></ItemInformationCard>

                        
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
