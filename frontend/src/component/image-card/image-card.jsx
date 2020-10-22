import React, { Component } from "react";

import "./image-card-style.scss";

class imageCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hierro: false,
      interval: false,
      hovered: false,
    };
    this.onHover = this.onHover.bind(this);
    this.onHoverLeft = this.onHoverLeft.bind(this);
  }

  async componentDidMount() {
    await fetch(
      "http://localhost:4000/configuration/getparticularhierro/" +
        this.props.hierro,
      {
        method: "GET",
      }
    ).then(async (hierroResponse) =>
      this.setState({ hierro: await hierroResponse.json() })
    );
  }

  onHover() {
    this.setState({
      interval: setTimeout(() => this.setState({ hovered: true }), 1000),
    });
  }

  onHoverLeft() {
    clearTimeout(this.state.interval);
    this.setState({ interval: false, hovered: false });
  }

  render() {
    return (
      <div
        onMouseEnter={this.onHover}
        onFocus={this.onHover}
        onBlur={this.onHoverLeft}
        onMouseLeave={this.onHoverLeft}
        onClick={this.props.handleClick}
        title={this.props.nombre}
        >
        <div
          className="cards"
          aria-label={this.props.nombre}
          aria-required="true"
          tabIndex={1}
          style={{animationDelay: this.props.animationDelay ? `.${ this.props.animationDelay }0 s`: '0'}}
          >
          <div
            className="card-title"
            style={{
              height: this.state.hovered ? "100%" : "50px",
            }}
          >
            <div
              className="hierro-logo"
              style={{
                backgroundImage: this.state.hierro
                  ? "url(http://localhost:4000" +
                    this.state.hierro.response.path +
                    ")"
                  : "",
              }}
            ></div>
            <span> {this.props.nombre}</span>
            <span> - {this.props.fechanac}</span>
          </div>
          {
            this.props.imagenes[0] !== undefined ?
            <div className="image" alt='image-array' style={{background: 'url(http://localhost:4000' + this.props.imagenes[0].path + ')'}}>
            <img
            className="card-image"
            alt='inside the card'
            loading="lazy"
            src={"http://localhost:4000" + this.props.imagenes[0].path} />

            </div>
             : <div className='card-image-empty'> </div>
          }
        
        </div>
      </div>
    );
  }
}

export default imageCard;
