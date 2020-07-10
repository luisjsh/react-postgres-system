import React from 'react';

import './item-information-card.styles.scss'

function itemInformation ({ title, children, id , ...otherProps}) {
    return (
            <div className="item" title={title}>
                            <div className="item-image" id={id}></div> 
                            {children}
            </div>
    )
}

export default itemInformation ;
