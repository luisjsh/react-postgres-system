import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import "./style.scss";

import ErrorPage from '../../page/error/errorPage'
import Card from "../image-card/image-card";

class HomePage extends React.Component {
  _isMounted = false;

  constructor(props) {
    super(props);
    this.state = {
      loadError: false,

      items: false,
      admin: false,
    };
    this.handleRef = React.createRef();
    this.handleArrow = this.handleArrow.bind(this);
    this.Redirect = this.Redirect.bind(this);
  }

  //----------------- Admin validation ----------------------------

  async componentDidMount() {
    await fetch("http://localhost:4000/item/", {
      method: "GET",
    }).then(async (response) =>{
      let {message, fetchedData} = await response.json()

      if(message){
        this.setState({loadError: true})
      }  
      if(fetchedData) this.setState({ items: fetchedData })}
    ).catch( e=>{
      this.props.setBadNotification('error de conexion')
      this.setState({loadError: true})
    })
  }

  componentDidUpdate(prevProps, prevState){
    if(this.state.loadError !== prevState.loadError){ 
      console.log('they´re diferrent')
      return true
    }
  }

  handleArrow(e) {
    if (e.keyCode === 39) {
    } else if (e.keyCode === 37) {
      console.log("left arrow");
    }
  }

  //---- Redirect ----

  Redirect(event) {
    let value = event.target.attributes.value.value;
    this.props.history.push("/" + value);
  }

  componentWillUnmount(){
    this._isMounted = false;
  }


  render() {
    if(this.state.loadError) return (
        <div className='HomePage'>
        <ErrorPage/>
        </div>
      )

    return (
      <div
        className="HomePage"
        onKeyDown={this.handleArrow}
        style={{
           overflow: this.state.items ? "visible" : "hidden" 
          }}
      >
        <div className="loader">
          {this.state.items ? (
            <div className="card-section">
              {this.state.items.map(
                ({ id, nombre, hierro, torosimagenes, fechanac}) => (
                  <Card
                    key={id}
                    hierro={hierro}
                    nombre={nombre}
                    fechanac={fechanac.slice(2, 4)}
                    imagenes={torosimagenes}
                    handleClick={() => {
                        this.props.history.push('/item/'+ id )
                    }}
                  />
                )
              )}

    
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
    );
  }
}

const mapStatetoProps = ({
  user: {
    currentUser,
    currentToken,
    currentUserArray,
    currentUserAdmin,
    currentUserImagePath,
  },
}) => {
  return {
    currentUser,
    currentToken,
    currentUserArray,
    currentUserAdmin,
    currentUserImagePath,
  };
};

const mapDispatchtoProps = (dispatch) => ({
  setBadNotification: (message) =>dispatch({type:'SET_BAD_NOTIFICATION', payload: message }),
  admin: () => dispatch({ type: "ADMIN" }),
  setItem: (itemData) =>
    dispatch({ type: "SET_CURRENT_ITEM", payload: itemData }),
});

export default connect(
  mapStatetoProps,
  mapDispatchtoProps
)(withRouter(HomePage));
