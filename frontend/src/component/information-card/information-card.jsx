import React, { Component } from 'react'
import { withRouter } from 'react-router-dom' 
import { connect } from 'react-redux' 

import './information-card-styles.scss'

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
            this.setState({currentItemArray: response , id: id , name: response.nombre, hair: response.pelaje, goal: response.logro.nombre, notepad: response.notas})
        })
    }

    formHandler(event) {
        let { name, value } = event.target;
        this.setState({ [name]: value });
    }

//---------------------------------------------------------------------------
/* 
    Function that updates the information of the item    
*/
    async applyUpdateEdit(event) {
        event.preventDefault();
        let formData = new FormData()
        formData.append('id' , this.props.currentItemArray.id)
        formData.append('nombre' , this.state.name)
        formData.append('pelaje' , this.state.hair )
        formData.append('fechanac' , this.state.fechanac)

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
    
                        <div className="item">
                            <div className="item-image" id='name'></div> <input type='text' onChange={this.formHandler} name='name' value={this.state.name} placeholder={this.props.currentItemArray.nombre}/>
                            
                        </div>
    
                        <div className="item">
                            <div className="item-image" id='hair'></div> <input type='text' onChange={this.formHandler} name='hair' value={this.state.hair} placeholder={this.props.currentItemArray.pelaje}/>                
                        </div>
    
                        <div className='item'>
                            <div className="item-image" id='sexo'></div> <span>{this.state.currentItemArray.sexo}</span>
                        </div>
    
                        <div className="item">
                            <div className="item-image" id='date'></div> <span>{this.state.currentItemArray.fechanac}</span>
                        </div>
    
                        <div className="button-section">
                        <button onClick={this.props.handleClick} className='cancel'>Cancelar</button><button onClick={this.applyUpdateEdit}> Guardar </button>
                        </div>
                    </div>
    
                        :
    
                    <div className="information-card">
    
                        <div className="item">
                            <div className="item-image" id='name'></div> <span>{this.state.currentItemArray.nombre}</span>
                            
                        </div>
                        <div className="item">
                            <div className="item-image" id='hair'></div> <span>{this.state.currentItemArray.pelaje}</span>
                        </div>
                        <div className='item'>
                            <div className="item-image" id='sexo'></div> <span>{this.state.currentItemArray.sexo}</span>
                        </div>
    
                        <div className="item">
                            <div className="item-image" id='date'></div> <span>{this.state.currentItemArray.fechanac}</span>
                        </div>
                            
                        <div className='item'>
                            <div className="item-image" id='goal'></div> <span>{this.state.goal}</span>
                        </div>

                        <div className='item'>
                            <div className="item-image" id='notepad'></div> <span className='notepad'>{this.state.notepad}</span>
                        </div>
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
