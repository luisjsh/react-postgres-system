import React, { Component } from "react";
import { connect } from "react-redux";

import "./configurationPage-styles.scss";
import CustomInput from "../custom-input/custom-input";
import CustomButton from "../custom-button/custom-button";

class configurationPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      url: false,
      pelaje: null,
      pelajeCode: "",
      hierroCode: "",
    };
    this.handleFile = this.handleFile.bind(this);
    this.formHandler = this.formHandler.bind(this);
    this.submit = this.submit.bind(this);
  }

  //-------------- handle file ----------------------
  handleFile(event) {
    if (event.target.files[0] !== undefined) {
      let url = URL.createObjectURL(event.target.files[0]);
      this.setState({ url: url, file: event.target.files[0] });
    }
  }

  //---------------- input-form ----------------------

  formHandler(event) {
    let { name, value } = event.target;
    this.setState({ [name]: value });
  }

  //------------------ submit handler --------------------

  async submit(event) {
    let { name } = event.target;

    if (name === "pelaje") {
      if (this.state.pelajeCode.length > 3) {
        let formData = new FormData();
        formData.append("pelaje", this.state.pelajeCode);

        await fetch("http://localhost:4000/configuration/pelajes", {
          method: "POST",
          headers: {
            "x-access-token": this.props.currentToken,
          },
          body: formData,
        })
          .then(async (response) => {
            this.setState({ pelaje: await response.json() });
          })
          .catch((e) => alert("error de conexion"));
      }
    } else if (name === "hierro") {
      if (this.state.hierroCode.length > 1 && this.state.url) {
        let formData = new FormData();
        formData.append("hierroCode", this.state.hierroCode);
        formData.append("image", this.state.file);
        await fetch("http://localhost:4000/configuration/hierros", {
          method: "POST",
          headers: {
            "x-access-token": this.props.currentToken,
          },
          body: formData,
        }).then((response) => alert("Agregado exitosamente"));
      }
    }
  }

  async componentDidMount() {
    await fetch("http://localhost:4000/configuration/getpelaje", {
      method: "GET",
      headers: {
        "x-access-token": this.props.currentToken,
      },
    })
      .then(async (response) => {
        this.setState({ pelaje: await response.json() });
      })
      .catch((e) => alert("error de conexion"));
  }

  render() {
    return (
      <div className="configuration-page">
        <div className="table">
          <div className="add-section">
            <div className="inputfile-section">
              <CustomInput
                name="hierroCode"
                value={this.state.hierroCode}
                onChange={this.formHandler}
                label="Introduzca el codigo del Hierro"
              />
              <label
                htmlFor="file"
                className="input-file"
                style={{
                  width: "100%",
                  background: this.state.url
                    ? "url(" +
                      this.state.url +
                      ") center center / 100% no-repeat"
                    : "",
                  border: "1px solid #DEDEDE",
                  borderRadius: "4px",
                  height: "60%",
                }}
              ></label>
              <input type="file" id="file" onChange={this.handleFile} />
              <CustomButton
                name="hierro"
                onClick={this.submit}
                color="primary-blue"
              >
                Agregar
              </CustomButton>
            </div>
            <div className="items">
              <CustomInput
                label="Introduzca el nombre del pelaje"
                name="pelajeCode"
                value={this.state.pelajeCode}
                onChange={this.formHandler}
              />
              <div className="pelajes-db">
                {this.state.pelaje != null
                  ? this.state.pelaje.response.map(({ id, nombre }) => (
                      <span key={id}>{nombre}</span>
                    ))
                  : ""}
              </div>
              <CustomButton
                name="pelaje"
                onClick={this.submit}
                color="primary-blue"
              >
                Agregar
              </CustomButton>
            </div>
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
export default connect(mapStatetoProps)(configurationPage);
