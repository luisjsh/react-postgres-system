import React from 'react';

import './item-information-card.styles.scss'

function itemInformation ({ children, id , ...otherProps}) {
    return (
            <div className="item">
                            <div className="item-image" id={id}></div> 
                            {children}
            </div>
    )
}

export default itemInformation ;
