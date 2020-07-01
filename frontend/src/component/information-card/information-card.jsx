import React, { Component } from 'react'
import { withRouter } from 'react-router-dom' 
import { connect } from 'react-redux' 

import './information-card-styles.scss'
import ItemInformationCard from '../item-information-card/item-information-card'
import DropdownSelect from '../dropdown-select/dropdown-select'
import TextArea from '../text-area-component/text-area-component'

class informationCard extends Component {
    constructor(props) {
        super(props)

        this.state = {
                 name: '',
                 hair: '',
                 fechanac: '',
                 goal: '',
                 notepad: '',
                 currentItemArray: false
        }

        this.handleUpdateandMount = this.handleUpdateandMount.bind(this)
        this.formHandler = this.formHandler.bind(this);
        this.applyUpdateEdit = this.applyUpdateEdit.bind(this);
    }



    async componentDidMount ( ) {
        let {id} = this.props
        this.handleUpdateandMount(id)
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
            this.setState({currentItemArray: response , id: id , name: response.nombre, hair: response.pelaje, goal: response.logros ,goalValue: response.logro.nombre, notepad: response.notas})
        })
    }

    formHandler(event) {
        let { name, value } = event.target;
        this.setState({ [name]: value });
        console.log(this.state)
    }

    async applyUpdateEdit(event) {
        event.preventDefault();
        let formData = new FormData()
        formData.append('id' , this.props.currentItemArray.id)
        formData.append('nombre' , this.state.name)
        formData.append('pelaje' , this.state.hair )
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
                this.setState({currentItemArray: data})
                this.props.handleClick()
                this.props.updateInformation(this.props.currentItemArray.id)
                
                
            }).catch( async error =>{ console.log(error)} )
        }

        

    render() {
        return (
            <div >
                {
                    this.props.currentItemArray ? 
                    
                        this.props.edit  ? 
    
                    <div className="information-card">
                        
                        <ItemInformationCard id='name'><input type='text' onChange={this.formHandler} name='name' value={this.state.name} placeholder={this.props.currentItemArray.nombre}/> </ItemInformationCard>

                        <ItemInformationCard id='hair'><input type='text' onChange={this.formHandler} name='hair' value={this.state.hair} placeholder={this.props.currentItemArray.pelaje}/></ItemInformationCard>

                        <ItemInformationCard id='sexo'><span>{this.state.currentItemArray.sexo}</span></ItemInformationCard>
                      
                        <ItemInformationCard id='date'><span>{this.state.currentItemArray.fechanac}</span></ItemInformationCard>

                        <ItemInformationCard id='goal'>
                                <DropdownSelect  onChange={this.formHandler} name='goal' value={this.state.goal}>
                                    <option>{this.state.goalValue}</option>
                                    { 
                                        this.props.goals.response.map( ({id,nombre}) => (
                                        <option key={id} value={id}>{nombre}</option>
                                        ))
                                    }
                                </DropdownSelect>
                            </ItemInformationCard>

                        <ItemInformationCard id='notepad'>
                                <TextArea value={this.state.notepad}  onChange={this.formHandler} name='notepad' style={{width: '80%'}}></TextArea>
                        </ItemInformationCard>

                            
                        <div className="button-section">
                        <button onClick={this.props.handleClick} className='cancel'>Cancelar</button><button onClick={this.applyUpdateEdit}> Guardar </button>
                        </div>
                        
                    </div>
    
                        :
    
                    <div className="information-card">
    
                        <ItemInformationCard id='name'><span>{this.state.currentItemArray.nombre}</span></ItemInformationCard>

                        <ItemInformationCard id='hair'><span>{this.state.currentItemArray.pelaje}</span></ItemInformationCard>

                        <ItemInformationCard id='sexo'><span>{this.state.currentItemArray.sexo}</span></ItemInformationCard>
                      
                        <ItemInformationCard id='date'><span>{this.state.currentItemArray.fechanac}</span></ItemInformationCard>

                        <ItemInformationCard id='goal'><span>{this.state.goalValue}</span></ItemInformationCard>

                        <ItemInformationCard id='notepad'><span className='notepad'>{this.state.notepad}</span></ItemInformationCard>

                        
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
