import React, {useState, useRef, useCallback} from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import useSearchWithPagination from '../../functions/paginator'

import "./style.scss";

import ErrorPage from '../../page/error/errorPage'
import Card from "../image-card/image-card";

function HomePage ({history}) {
  const [pageNumber, setPageNumber] = useState(1)
  const {loading, error, items, hasMore} = useSearchWithPagination('', pageNumber)

  
  console.log(items)

  const observer = useRef()

  const lastItemReferred = useCallback(node => {
    /*if (loading) return
    if (observer.current) observer.current.disconnect()
    observer.current = new IntersectionObserver(entries => {
      console.log(entries)
      if (entries[0].isIntersecting && hasMore) {
        setPageNumber(prevPageNumber => prevPageNumber + 1)
      }
    })
    if(node) observer.current.observe(node)*/
  }, [loading, hasMore])

  return (
    <div className="HomePage" >
      <div className='loader'>
        <div className="card-section">
        {
          items.map( ({ id, nombre, hierro, torosimagenes, fechanac, tientadia, tientaresultado, tientatentadopor,tientalugar}, index) => {
            if (items.length === index + 1) {
              return <div
              key={id}
              ref={lastItemReferred}
              hierro={hierro}
              nombre='the last one'
              animationDelay={index}
              fechanac={fechanac.slice(2, 4)}
              imagenes={torosimagenes}
              tientaDia={tientadia}
              tientaResultado={tientaresultado}
              tientaTentadoPor={tientatentadopor}
              tientaLugar={tientalugar}
              handleClick={() => {
                history.push('/item/'+ id )
              }}/>
            } else {
              return <Card
              key={id}
              hierro={hierro}
              nombre={nombre}
              animationDelay={index}
              fechanac={fechanac.slice(2, 4)}
              imagenes={torosimagenes}
              tientaDia={tientadia}
              tientaResultado={tientaresultado}
              tientaTentadoPor={tientatentadopor}
              tientaLugar={tientalugar}
              handleClick={() => {
                history.push('/item/'+ id )
              }} />
            
            }})
        }
        </div>
        {loading && 'loading...'}
      </div>
    </div>
  );
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
