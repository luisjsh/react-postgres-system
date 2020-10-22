import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom';


import ImageCarousel from '../image-carousel/image-carousel'
import ImageCard from '../image-card/image-card'
import CardCarousel from '../cards-carousel/cards-carousel'
import InformationCard from '../information-card/information-card'
import './item-page-style.scss'

class ItemPage extends React.Component{
    constructor(props){
        super(props);
        this.state = {

            edit: false,
            hairInformation: false,
            goalInformation:false,
            //edit-values
            name: '',
            pelaje: '',
            fechanac: '',

            currentItemArray: false,
            grandpa: false,
            parents: false,
            childs: false,
            grandChilds: false
        }

        this.updateInformation = this.updateInformation.bind(this);
        this.handleEdit = this.handleEdit.bind(this)
    }

    async componentDidMount(){
        this.setState({ verifyUpdate : this.props.currentItemArray , id: this.props.match.params.id})
        this.updateInformation(this.props.match.params.id)
    }

    async updateInformation(id){
        await fetch('http://localhost:4000/item/search/profile/' + id)
            .then( async responseArray => {
                let { response } = await responseArray.json()
                this.setState({currentItemArray: response , id: id })
                this.props.setItem(response)
                console.log(response)
            })

        await fetch(
            "http://localhost:4000/configuration/getparticularhierro/" +
              this.state.currentItemArray.hierro,
            {
              method: "GET",
            }
          ).then(async (hierroResponse) =>
            this.setState({ hierro: await hierroResponse.json() })
          );

        await fetch('http://localhost:4000/item/search/family/parents/'+ id)
            .then( async responseArray => {
   
                let { detail ,  response } = await responseArray.json()
                
                if (detail.search('no-parents') !== -1 ){
                    
                    this.setState({parents: {response: false} , grandpa: {response: false}})


                }   else if ( detail.search('no-grandpa') !== -1){

                    this.setState({parents:  { response } , grandpa: { response: false}})
                }
            
            })


         await fetch('http://localhost:4000/item/search/family/child/' + id).then( async response => {
             let { detail , responseArray } = await response.json()
            
             if (detail.search('has childs') !== -1){
               
                this.setState({ childs: {response: responseArray} })

                let i=0;
                let grandChildArr = [];
                for( i = 0; i<this.state.childs.response.length; i++){
                    await fetch('http://localhost:4000/item/search/family/child/' + this.state.childs.response[i].id )
                        .then( async response => {
                        let { detail , responseArray } = await response.json()

                        if (detail.search('has childs') !== -1){
                            let i = 0;
                            for( i=0; i<responseArray.length; i++){
                                grandChildArr.push( responseArray[i] )
                            }
                        }

                        })
                }

                grandChildArr.length > 0 ? this.setState({ grandChilds: {response: grandChildArr}}) : this.setState({ grandChilds: { response: false}})

                
             } else if (detail.search('nochilds') !== -1){
                
                this.setState({ childs: {response: false},  grandChilds: { response: false}})
             }


             
         })   
       
    }
    

    async handleEdit(){
        if (this.state.hairInformation == false || this.state.goalInformation == false){
        await fetch("http://localhost:4000/configuration/getpelaje", {
            method: "GET",
            headers: {
              "x-access-token": this.props.currentToken,
            },
          })
            .then(async (response) => {
              this.setState({ hairInformation: await response.json() });
            })
            .catch((e) => alert("error de conexion"));


          await fetch("http://localhost:4000/configuration/logros", {
            method: "GET",
            headers: {
              "x-access-token": this.props.currentToken,
            },
          })
            .then(async (response) => {
              this.setState({ goalInformation: await response.json() });
            })
            .catch((e) => alert("error de conexion"));
            
            this.setState({edit: !this.state.edit})

        } else {

            this.setState({edit: !this.state.edit})
        }

   
    }
      //---------------- input-form ----------------------

      render(){   
        return(
            <div className='item-page'>
                <div className="profile-section">
                <ImageCarousel id={this.props.currentItemArray.id} context='item' />
                
                    <div className="information-card">
                        
                        <div className="information-title">
                        <span>{this.props.currentItemArray.nombre} 
                        {
                            this.props.currentUserAdmin ? 
                            <div className='admin-privileges'>
                                <button className='edit' onClick={this.handleEdit}></button>
                            </div>

                            : 

                            ''
                        }</span>
                        </div>
                        
                        {
                            this.state.currentItemArray ?
                            
                            <InformationCard id={this.state.id} edit={this.state.edit} hair={this.state.hairInformation} goals={this.state.goalInformation} handleClick={()=>this.setState({edit: !this.state.edit})}  updateInformation={this.updateInformation} />

                            :

                            ''
                        }
                    </div>
                </div>

                <div className="results-side">
                    <span className='main-title'>{this.state.currentItemArray.nombre}</span>

                    <div className="parents-section">
                        <div className="cards-section">
                            <span className='title-span'>Padres</span>
                            <div className="card">
                                {

                                    // the first validation if its false, the function wont run
                                    this.state.parents ? 

                                     this.state.parents.response ? 
                                        
                                     this.state.parents.response.map( ({id, nombre, hierro, torosimagenes , fechanac}) =>(
                                                    <ImageCard
                                                    key={id}
                                                    hierro={hierro}
                                                    nombre={nombre}
                                                    fechanac={fechanac.slice(2, 4)}
                                                    imagenes={torosimagenes}
                                                    handleClick={() => {
                                                        this.updateInformation(id);
                                                        this.props.history.push('/item/'+id)
                                                    }}
                                                />
                                     ))
                                    : <div className='no-response'> </div> 
                                    
                                     :

                                    ''
                                }
                            </div>
                        </div>
                        <div className="cards-section"> 
                            <span className='title-span'>Abuelos</span>
                            <div className="card" style={{marginLeft: '10px'}}>
                                {
                                    this.state.grandpa ? 

                                        this.state.grandpa.response ? ' ' : <div className='no-response'> </div>

                                    :

                                    ''
                                }
                            </div>
                        </div>
                        
                    </div>
                
                    <CardCarousel title='Hijos' itemArray={this.state.childs.response}>
                    {
                                    this.state.childs ? 

                                        this.state.childs.response ? 
                                        
                                        this.state.childs.response.map( ({id, nombre, hierro, torosimagenes , fechanac}) =>(
                                            <ImageCard
                                            key={id}
                                            hierro={hierro}
                                            nombre={nombre}
                                            fechanac={fechanac.slice(2, 4)}
                                            imagenes={torosimagenes}
                                            handleClick={() => {
                                                this.updateInformation(id);
                                                this.props.history.push('/item/'+id)
                                            }}
                                        />
                             ))
                                        : <div className='no-response'> </div>

                                    :

                                    ''
                        }
                    </CardCarousel>
                    <CardCarousel title='Nietos' itemArray={this.state.grandChilds.response}>
                    {
                                    this.state.grandChilds ? 

                                        this.state.grandChilds.response ? 
                                        
                                        this.state.grandChilds.response.map( ({id, nombre, hierro, torosimagenes , fechanac}) =>(
                                            <ImageCard
                                            key={id}
                                            hierro={hierro}
                                            nombre={nombre}
                                            fechanac={fechanac.slice(2, 4)}
                                            imagenes={torosimagenes}
                                            handleClick={() => {
                                                this.updateInformation(id);
                                                this.props.history.push('/item/'+ id)
                                            }}
                                        />
                                        ))
                                        
                                        : <div className='no-response'> </div>

                                    :

                                    ''
                        }
                    </CardCarousel>                    
                </div>
            </div>
        )
    }
}

const mapDispatchtoProps = (dispatch) => ({
    setItem: (itemData) =>
      dispatch({ type: "SET_CURRENT_ITEM", payload: itemData }),
});
  
const mapStatetoProps = ({
    item: {
      currentItemArray
    }, user:{
        currentUserAdmin,
        currentToken
    }
  }) => {
    return {
        currentItemArray,
        currentUserAdmin,
        currentToken
    };
  };
export default connect (mapStatetoProps, mapDispatchtoProps) (withRouter(ItemPage))