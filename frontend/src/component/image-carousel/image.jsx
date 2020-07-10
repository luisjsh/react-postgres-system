import React from 'react';

import './image-styles.scss'

function Image({ path , reference }) {
    return (
        <div className='slide' style={{transform:'translateX('+reference+'%)', zIndex: '-1'}} >
            <img src={'http://localhost:4000'+ path} />                  
        </div>
    )
}

export default Image;
