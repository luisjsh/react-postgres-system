import React, { Component } from "react";
import styled, {keyframes} from 'styled-components'

import NoImageIcon from './IMG/no-image.svg'

import SecundaryText from '../secundary-text/secundary-text'

const Appear = keyframes`
  0%{
    transform: translateY(20px);
    opacity: 0;
  }

  100%{
    transform: translateY(0);
    opacity: 1;
  }
`

const Card = styled.div`
  background: #F2F2F2;
  border-radius: 10px;
  opacity: 0;
  display: grid;
  box-shadow: 0px 4px 4px 0 rgba(0,0,0,0.2);
  transition: .3s;
  grid-template-areas: ${props => props.hovered? `
    "header"
    "section"
  ` : `
    "header"
    "header"
  `};
  animation: ${Appear} ease 1s .${props => props.animationDelay ? props.animationDelay : ''}0s forwards;
  cursor: pointer;

  &:hover{
    transform: translateY(-10px);
    background: #0E8FFF;
    color: white;
  }
`

const CardHeader = styled.header`
  height: ${props => props.hovered ? '300px' : '50px'};
  padding: .4em;
  grid-area: header;
  transition: .3s;
  `
  
const HeaderWrapper = styled.div`
  height: 50px;
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
  justify-items: center;
  font-weight: bold;
  align-items: center;
`

const HeaderWrapperBottom = styled.div`
  padding: 1em;
  text-align: center;
  font-weight: bold;
`

const Hierro = styled.div`
  width: 30px;
  height: 30px;
  background-size: cover;
  border-radius: 100% ;
`


const CardSection = styled.section`
  padding: .4em;
`

const CardNoImage = styled.div`
  height: ${props => props.hovered ? '0' : '300px'};
  border-radius: 10px;
  background: url(${NoImageIcon}) no-repeat;
  background-color: white;
  background-position: center;
  background-size: 60%;
  transition: .3s;
`

const Span = styled.span`
  text-transform: full-width;
  height: 99%;
  text-align: center;
  display: flex;
  align-items: center;
  overflow: hidden;
  text-overflow: ellipsis;
`

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

  componentWillUnmount(){
    clearTimeout(this.state.interval);
    this.setState({ interval: false, hovered: false });
  }

  render() {
    return (
        <Card
          animationDelay={this.props.animationDelay}
          onMouseEnter={this.onHover}
          onFocus={this.onHover}
          onBlur={this.onHoverLeft}
          onMouseLeave={this.onHoverLeft}
          onClick={this.props.handleClick}
          title={this.props.nombre}
          >
          <CardHeader
            hovered={this.state.hovered}
          >
            <HeaderWrapper>
              <Hierro
                className="hierro-logo"
                style={{
                  backgroundImage: this.state.hierro
                    ? "url(http://localhost:4000" +
                      this.state.hierro.response.path +
                      ")"
                    : "",
                }}
              ></Hierro>
              <Span> {this.props.nombre}</Span>
              <Span> - {this.props.fechanac}</Span>
            </HeaderWrapper>
            <HeaderWrapperBottom
              hovered={this.state.hovered}
            >
              Datos de la tienta
              <SecundaryText title='Resultado:'>{this.props.tientaResultado}</SecundaryText>
              <SecundaryText title='Lugar:'>{this.props.tientaLugar}</SecundaryText>
              <SecundaryText title='Fecha:'>{this.props.tientaDia}</SecundaryText>
              <SecundaryText title='Tentado por:'>{this.props.tientaTentadoPor}</SecundaryText>
            </HeaderWrapperBottom>
          </CardHeader>
          <CardSection>
          {
            this.props.imagenes[0] !== undefined ?
            <div className="image" alt='image-array' style={{background: 'url(http://localhost:4000' + this.props.imagenes[0].path + ')'}}>
            <img
            className="card-image"
            alt='inside the card'
            loading="lazy"
            src={"http://localhost:4000" + this.props.imagenes[0].path} />

            </div>
             : <CardNoImage 
                hovered={this.state.hovered}
              />
          }</CardSection>
        </Card>
    );
  }
}

export default imageCard;
