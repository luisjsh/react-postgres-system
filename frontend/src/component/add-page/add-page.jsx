import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import CustomInput from "../custom-input/custom-input";
import Custombutton from "../custom-button/custom-button";
import USureCard from "../u-sure-card/u-sure-card";
import PhotoCarousel from "../image-carousel-add/image-carousel-add";
import "./add-page-styles.scss";
import ImageCard from "../image-card/image-card";


class AddPage extends React.Component {
  constructor() {
    super();
    this.state = {
      //values
      hierro: "",
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
      view: false,
      photos: false,
      x: 0,
      porcentaje: 100,
      porcentajeInput: 0,
      cursor: 0,
      hierroDropdownSelectedImage: false,
      hierroDropdownSelected: false,
    };

    this.handleFile = this.handleFile.bind(this);
    this.Show = this.Show.bind(this);
    this.DontShow = this.DontShow.bind(this);
    this.PhotoChanger = this.PhotoChanger.bind(this);
    this.GeneticRange = this.GeneticRange.bind(this);
    this.formHandler = this.formHandler.bind(this);
    this.hierroSelectedImage = this.hierroSelectedImage.bind(this);
    this.pelajeSelected = this.pelajeSelected.bind(this);
    this.handleSubmitandGoHomepage = this.handleSubmitandGoHomepage.bind(this);
    this.handleSubmitandAddAnother = this.handleSubmitandAddAnother.bind(this);
    this.searchParents = this.searchParents.bind(this);

    this.selectedParentFather = this.selectedParentFather.bind(this);
    this.selectedParentMother = this.selectedParentMother.bind(this);
  }

  async componentDidMount() {
    await fetch("http://localhost:4000/configuration/gethierro", {
      method: "GET",
      headers: {
        "x-access-token": this.props.currentToken,
      },
    })
      .then(async (response) => {
        this.setState({ hierroInformation: await response.json() });
      })
      .catch((e) => alert("error de conexion"));
    //--------------------------------------------------------------------------------
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
    //----------------------------------------------------------------------------------
    await fetch("http://localhost:4000/configuration/logros", {
      method: "GET",
      headers: {
        "x-access-token": this.props.currentToken,
      },
    })
      .then(async (response) => {
        this.setState({ logrosInformation: await response.json() });
      })
      .catch((e) => alert("error de conexion"));
  }

  //--------------------------------------------

  hierroSelectedImage(event) {
    let { name, value } = event.target;
    this.setState({
      hierroDropdownSelectedImage: name,
      hierroDropdownSelected: value,
    });
  }

  //---------------------------------------------

  pelajeSelected(event) {
    this.setState({ pelaje: event.target.attributes.value.value });
  }

  //---------------- input-form ----------------------

  formHandler(event) {
    let { name, value } = event.target;
    this.setState({ [name]: value });
  }

  //-----------input type file ----------------
  handleFile(event) {
    if (event.target.files !== undefined) {
      let photosFile = [];
      let i = 0;
      for (i = 0; i < event.target.files.length; i++) {
        let url = URL.createObjectURL(event.target.files[i]);
        photosFile.push({ id: i, file: url });
      }
      this.setState({ photos: photosFile, files: event.target.files });
    }

    if (event.target.files[0] !== undefined) {
      let url = URL.createObjectURL(event.target.files[0]);
      this.setState({ url: url, files: event.target.files });
    }
  }

  //--------------------------------------------

  //---------------PhotoChanger ---------------

  PhotoChanger(event) {
    this.setState({ url: event.target.attributes.value.value }); //when its clicked the url state changes to a new one
  }
  //-------------------------------------------

  //---------------- modal section ---------------

  Show() {
    this.setState({ view: true }); //the modal will appear
  }

  DontShow() {
    this.setState({ view: false }); //when executed, the modal will disappear
  }
  //----------------------------------------------

  //---------------- input range -----------------

  GeneticRange(event) {
    let { value, name } = event.target;
    let results = 100 - value;
    this.setState({ [name]: value, porcentaje: results });
  }

  //----------------------------------------------

  async handleSubmitandGoHomepage(event) {
    event.preventDefault(); 
    
    if ( this.state.hierro.length > 1 && this.state.nombre.length > 1 && this.state.pelaje.length > 0 && this.state.date.length > 1){
      let formData = new FormData();
    formData.append("nombre", this.state.nombre);
    formData.append("hierro", this.state.hierroDropdownSelected);
    formData.append("hierrocodigo", this.state.hierro);
    formData.append("pelaje", this.state.pelaje);
    formData.append("sexo", this.state.sexo);
    formData.append("fechaNac", this.state.date);
    formData.append("logros", this.state.logros);
    formData.append("notas", this.state.textarea);
    formData.append("madreId", this.state.madreId);
    formData.append("padreId", this.state.padreId);

    if (this.state.files != null) {
      for (let i = 0; i < this.state.files.length; i++) {
        formData.append("image", this.state.files[i]);
      }
    }
    await fetch("http://localhost:4000/item/add", {
      method: "POST",
      headers: {
        "x-access-token": this.props.currentToken,
      },
      body: formData,
    }).catch( e => alert('error de conexion'));

    }else{
      alert('Por favor introduzca todos los datos')
    }
    this.props.history.push('/')
  }

  async handleSubmitandAddAnother(){

    if ( this.state.hierro.length > 1 && this.state.nombre.length > 1 && this.state.pelaje.length > 1 && this.state.date.length > 1){
      let formData = new FormData();
    formData.append("nombre", this.state.nombre);
    formData.append("hierro", this.state.hierroDropdownSelected);
    formData.append("hierrocodigo", this.state.hierro);
    formData.append("pelaje", this.state.pelaje);
    formData.append("sexo", this.state.sexo);
    formData.append("fechaNac", this.state.date);
    formData.append("logros", this.state.logros);
    formData.append("notas", this.state.textarea);
    formData.append("madreId", this.state.madreId);
    formData.append("padreId", this.state.padreId);
    console.log('asdasd')
    if (this.state.files != null) {
      for (let i = 0; i < this.state.files.length; i++) {
        formData.append("image", this.state.files[i]);
      }
    }
    await fetch("http://localhost:4000/item/add", {
      method: "POST",
      headers: {
        "x-access-token": this.props.currentToken,
      },
      body: formData,
    }).then( response =>{
      this.DontShow()
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
      view: false,
      photos: false,
      x: 0,
      porcentaje: 100,
      porcentajeInput: 0,
      cursor: 0,
      hierroDropdownSelectedImage: false,
      hierroDropdownSelected: false,})
    })


    .catch( e => alert('error de conexion'));
    

    }else{
    
      alert('Por favor introduzca todos los datos')
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
        alert('Error de conexion')
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
        alert('Error de conexion')
      )}
  }

  selectedParentFather(id, nombre, hierro, fechanac, torosimagenes) {
    this.setState({padreId: id, fatherArray: [{id, nombre, hierro, fechanac, torosimagenes}]})
  }

  selectedParentMother(id, nombre, hierro, fechanac, torosimagenes) {
    this.setState({madreId: id, motherArray: [{id, nombre, hierro, fechanac, torosimagenes}]})
  }



  render() {
    return (
      <div className="add-page">
        {this.state.view ? (
          <USureCard
            handleSubmit={this.handleSubmitandGoHomepage}
            handleClick={this.DontShow}
            handleAddAnother={this.handleSubmitandAddAnother}
          ></USureCard>
        ) : (
          ""
        )}

        <PhotoCarousel
          photoChanger={this.PhotoChanger}
          url={this.state.url}
          handleFile={this.handleFile}
          photos={this.state.photos}
        />

        <div className="card-information">
          <span>Informacion</span>
          <div className="information-enter">
            <div className="first-half-form">
              <CustomInput
                name="nombre"
                value={this.state.nombre}
                onChange={this.formHandler}
                required
                label="Nombre"
              ></CustomInput>
              <div className="pelaje-search">
                <CustomInput
                  name="pelaje"
                  value={this.state.pelaje}
                  onChange={this.formHandler}
                  required
                  label="Pelaje"
                ></CustomInput>
                <div className="pelaje-results">
                  {this.state.pelajeInformation
                    ? this.state.pelajeInformation.response.map(
                        ({ id, nombre }) =>
                          nombre
                            .toLowerCase()
                            .indexOf(this.state.pelaje.toLowerCase()) > -1 ? (
                            <button
                              key={id}
                              name="pelaje"
                              value={id}
                              onClick={this.pelajeSelected}
                            >
                              {nombre}
                            </button>
                          ) : (
                            ""
                          )
                      )
                    : ""}
                </div>
              </div>

              <div className="birth-date">
                <label htmlFor="date">Date</label>
                <input
                  name="date"
                  onChange={this.formHandler}
                  required
                  type="date"
                  id="date"
                  style={{ width: "290px", borderRadius: "4px" }}
                />
              </div>
            </div>

            <div className="second-half">
              <div className="hierro">
                <label htmlFor="hierro">Hierro</label>
                <div className="hierro-section" label="hierro">
                  <div className="image-select">
                    <button
                      className="image-select"
                      style={{
                        background: this.state.hierroDropdownSelectedImage
                          ? this.state.hierroDropdownSelectedImage
                          : "",
                      }}
                    ></button>

                    <div className="image-select-list">
                      {this.state.hierroInformation
                        ? this.state.hierroInformation.response.map(
                            ({ id, path }) => (
                              <button
                                key={id}
                                value={id}
                                name={
                                  "url(http://localhost:4000" +
                                  path +
                                  ") center center / 100% no-repeat"
                                }
                                style={{
                                  background:
                                    "url(http://localhost:4000" + path + ")",
                                }}
                                onClick={this.hierroSelectedImage}
                              />
                            )
                          )
                        : ""}
                    </div>
                  </div>

                  <input
                    name="hierro"
                    value={this.state.hierro}
                    onChange={this.formHandler}
                    required
                  ></input>
                </div>
              </div>

              <div className="sex-section">
                <label htmlFor="sexo">Sexo</label>
                <select
                  name="sexo"
                  id="sexo"
                  onChange={this.formHandler}
                  required
                >
                  <option value="Hembra">Hembra</option>
                  <option value="Macho">Macho</option>
                </select>
              </div>
            </div>
          </div>

          {/*
  HERE BEGINS THE SECTION WHERE THEY´LL CHOOSE WHOS THE "PARENT" 
*/}
          <div className="family-choose">
            <div className="mother">
              <span>Madre</span>

              <div className="search-bar">
                <div className="search-inputs">
                  <div className="search">
                    <input
                      type="text"
                      tabIndex={0}
                      name="motherSearchbarValue"
                      value={this.state.motherSearchbarValue}
                      onChange={this.searchParents}
                      onClick={this.searchParents}
                    />
                  </div>
                  <div
                    className="deleate-them"
                    onClick={() =>
                      this.setState({
                        motherSearchbarValue: "",
                        motherArray: false,
                      })
                    }
                    tabIndex={0}
                  ></div>
                  <div className="search-icon" tabIndex={0}></div>
                </div>
              </div>
              {/*

*/}
              <div className="cards-result">
                <div className="parents-card">
                  {this.state.motherArray
                    ? this.state.motherArray.map(
                        ({ id, nombre, hierro, fechanac, torosimagenes }) => (
                          <ImageCard
                            key={id}
                            hierro={hierro}
                            nombre={nombre}
                            fechanac={fechanac.slice(2, 4)}
                            imagenes={torosimagenes}
                            handleClick={()=>this.selectedParentMother(id, nombre, hierro, fechanac, torosimagenes)}
                          />
                        )
                      )
                    : ""}
                </div>
              </div>
            </div>

            <div className="father">
              <span>Padre</span>
              <div className="search-bar">
                <div className="search-inputs">
                  <div className="search">
                    <input
                      type="text"
                      tabIndex={0}
                      name="fatherSearchbarValue"
                      value={this.state.fatherSearchbarValue}
                      onChange={this.searchParents}
                      onClick={this.searchParents}
                    />
                  </div>
                  <div
                    className="deleate-them"
                    onClick={() =>
                      this.setState({
                        fatherSearchbarValue: "",
                        fatherArray: false,
                      })
                    }
                    tabIndex={0}
                  ></div>
                  <div className="search-icon" tabIndex={0}></div>
                </div>
              </div>

              <div className="cards-result">
                <div className="parents-card">
                  {this.state.fatherArray
                    ? this.state.fatherArray.map(
                        ({ id, nombre, hierro, fechanac, torosimagenes }) => (
                          <ImageCard
                            key={id}
                            id={id}
                            hierro={hierro}
                            nombre={nombre}
                            fechanac={fechanac.slice(2, 4)}
                            imagenes={torosimagenes}
                            handleClick={()=>this.selectedParentFather(id, nombre, hierro, fechanac, torosimagenes)}
                          />
                        )
                      )
                    : ""}
                </div>
              </div>
            </div>
          </div>
          {/*

*/}
          <div className="genetic-range">
            <span>Genetica</span>
            <div className="genetic-information">
              <div className="porcentaje">{this.state.porcentaje}</div>

              <div className="genetica">
                <CustomInput label="Casta" />
                <CustomInput
                  label="Porcentaje"
                  name="porcentajeInput"
                  style={{ width: "30px", marginLeft: "20px" }}
                  onChange={this.GeneticRange}
                  value={this.state.porcentajeInput}
                />
              </div>

              <Custombutton color="secundary-blue">Agregar Otro</Custombutton>
            </div>
          </div>
          {/*

*/}
          <div className="information-goals-enter">
            <span>Comportamiento</span>
            <div className="goals-information">
              <div className="logros-area-section">
                <label htmlFor="logros">Logros</label>
                <select
                  value={this.state.logros}
                  id="logros"
                  name="logros"
                  onChange={this.formHandler}
                  required
                >
                  <option>Por favor escoja un logro</option>
                  {this.state.logrosInformation
                    ? this.state.logrosInformation.response.map(
                        ({ id, nombre }) => (
                          <option key={id} value={id}>
                            {nombre}
                          </option>
                        )
                      )
                    : ""}
                </select>
              </div>
              {/*

*/}
              <div className="text-area-section" style={{ marginLeft: "10px" }}>
                <label htmlFor="textarea">Notas</label>
                <textarea
                  id="textarea"
                  name="textarea"
                  value={this.state.textarea}
                  onChange={this.formHandler}
                  required
                ></textarea>
              </div>
            </div>
          </div>

          <div className="button-section">
            <Custombutton color="primary-blue" onClick={this.Show}>
              Guardar
            </Custombutton>
          </div>
        </div>
      </div>
    );
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

export default connect(mapStatetoProps)(withRouter(AddPage));