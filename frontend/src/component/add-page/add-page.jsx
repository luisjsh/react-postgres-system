import React, {useState} from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import "./add-page-styles.scss";

import LidiaPart from './steps/lidia-step'
import MainInfo from './steps/mainInfo-step'

class AddPage extends React.Component {
  constructor() {
    super();
    this.state = {
      step: 'first',
      hierroInformation: false,
      pelajeInformation: false,

      motherArray: false,
      fatherArray: false
    };

    
   /* this.GeneticRange = this.GeneticRange.bind(this);*/
    this.submitToDb = this.submitToDb.bind(this);
    this.updateState = this.updateState.bind(this);
    this.searchParents = this.searchParents.bind(this);
  }

  async componentDidMount() {
    if(this.props.currentUser === 'null' || this.props.currentUser === null) 
    return this.props.history.push('/')
    
    await fetch("http://localhost:4000/configuration/gethierro", {
      method: "GET",
      headers: {
        "x-access-token": this.props.currentToken,
      },
    })
      .then(async (response) => {
        this.setState({ hierroInformation: await response.json() });
      })
      .catch((e) => this.props.setBadNotification("error de conexion"));

      await fetch("http://localhost:4000/configuration/getpelaje", {
      method: "GET",
      headers: {
        "x-access-token": this.props.currentToken,
      },
    })
      .then(async (response) => {
        this.setState({ pelajeInformation: await response.json() });
      })
      .catch((e) => this.props.setBadNotification("error de conexion"));
    //----------------------------------------------------------------------------------
    /*await fetch("http://localhost:4000/configuration/logros", {
      method: "GET",
      headers: {
        "x-access-token": this.props.currentToken,
      },
    })
      .then(async (response) => {
        this.setState({ logrosInformation: await response.json() });
      })
      .catch((e) => this.props.setBadNotification("error de conexion")); */
  }

  //--------------------------------------------
 
  /*GeneticRange(event) {
    let { value, name } = event.target;
    let results = 100 - value;
    this.setState({ [name]: value, porcentaje: results });
  }*/

  async submitToDb(){
    console.log(this.state)
    let formData = new FormData();
    formData.append("nombre", this.state.firstStep.nombre);
    formData.append("hierro", this.state.firstStep.hierroDropdownSelected);
    formData.append("hierrocodigo", this.state.firstStep.hierro);
    formData.append("tatuaje", this.state.firstStep.tatuaje);
    formData.append("encaste", this.state.firstStep.encaste);
    formData.append("pelaje", this.state.firstStep.pelaje);
    formData.append("sexo", this.state.firstStep.sexo);
    formData.append("fechaNac", this.state.firstStep.fechaNac);
    //formData.append("logros", this.state.firstStep.logros);
    formData.append("notas", this.state.firstStep.textarea);
    formData.append("madreId", this.state.firstStep.madreId);
    formData.append("padreId", this.state.firstStep.padreId);
    formData.append('tientaDia', this.state.secondStep.tientaDate);
    formData.append('tientaResultado', this.state.secondStep.result);
    formData.append('tientaTentadoPor', this.state.secondStep.temptedBy);
    formData.append('tientaLugar', this.state.secondStep.place);
    formData.append('tientaCapa', this.state.secondStep.withCape);
    formData.append('tientaCaballo', this.state.secondStep.withHorse);
    formData.append('tientaMuleta', this.state.secondStep.withCrutch);

    if (this.state.firstStep.files != null) {
      for (let i = 0; i < this.state.firstStep.files.length; i++) {
        formData.append("image", this.state.firstStep.files[i]);
      }
    }

    try {
          await fetch("http://localhost:4000/item/add", {
            method: "POST",
            headers: {
              "x-access-token": this.props.currentToken,
            },
            body: formData,
          }).then( response =>{
            this.setState({ hierro: "",
            nombre: "",
            pelaje: "",
            padreId: 0,
            madreId: 0,
            files: {},
            sexo: "Hembra",
      
            //mother - father array
            motherArray: false,
            fatherArray: false,
      
            //mother-father searchbar
            motherSearchbarValue: "",
            fatherSearchbarValue: "",
      
            mother: "",
            father: "",
            url: false,
            viewModal: false,
            photos: false,
            x: 0,
            porcentaje: 100,
            porcentajeInput: 0,
            cursor: 0,
            hierroDropdownSelectedImage: false,
            hierroDropdownSelected: false,})
          }).then( response =>{
            this.props.history.push('/')
            this.props.setGoodNotification('Agregado exitosamente')
          })
    } catch(e){
      this.props.setBadNotification('Error de conexión')
    }
  }

  async searchParents(event) {
    let { name, value } = event.target;
    this.setState({ [name]: value });
    let parent = " ";
    if (name.search("mother") === 0) {
      parent = "Hembra";
      let formData = new FormData();
      formData.append("name", value);
      formData.append("sex", parent);

      await fetch("http://localhost:4000/item/searchforParent", {
        method: "POST",
        headers: {
          "x-access-token": this.props.currentToken,
        },
        body: formData,
      }).then(async (response) => {
        let { parentsArray } = await response.json();
        this.setState({ motherArray: parentsArray });
      }).catch( e =>  
        this.props.this.props.setBadNotification('Error de conexion')
      );
      
    } else if (name.search("father") === 0) {
      parent = "Macho";

      let formData = new FormData();
      formData.append("name", value);
      formData.append("sex", parent);

      await fetch("http://localhost:4000/item/searchforParent", {
        method: "POST",
        headers: {
          "x-access-token": this.props.currentToken,
        },
        body: formData,
      }).then(async (response) => {
        let { parentsArray } = await response.json();
        this.setState({ fatherArray: parentsArray });
      }).catch( e =>  
        this.props.setBadNotification('error de conexion')
      )}
  }

  updateState(stepName, stepData){
    this.setState({
      [stepName]:stepData
    })
  }

  render() {
    if (this.state.step === 'first') return (
      <MainInfo 
        hierroInformation={this.state.hierroInformation}
        pelajeInformation={this.state.pelajeInformation}
        motherArray={this.state.motherArray}
        fatherArray={this.state.fatherArray}
        handleClick={()=>this.setState({step: 'second'})}
        updateState={this.updateState}
      />
    );
    
    if (this.state.step === 'second') return (
      <LidiaPart
        updateState={this.updateState}
        handleClickConfirmation={this.submitToDb}
      />
    )

  }
}

const mapStatetoProps = ({
  user: { currentUser, currentUserImagePath, currentToken },
}) => {
  return {
    currentUser,
    currentUserImagePath,
    currentToken,
  };
};

const mapDispatchtoProps = (dispatch)=>({
  setBadNotification: (message) =>dispatch({type:'SET_BAD_NOTIFICATION', payload: message }),
  setGoodNotification: (message) =>dispatch({type:'SET_GOOD_NOTIFICATION', payload: message })
})

export default connect(mapStatetoProps, mapDispatchtoProps)(withRouter(AddPage));