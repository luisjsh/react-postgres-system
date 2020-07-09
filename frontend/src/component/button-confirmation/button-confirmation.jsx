import React from 'react';

import './button-confirmation-styles.scss'

function ButtonConfirmation({handleClick}) {
    return (
        <div className="button-confirmatio">
            <button onClick={handleClick}></button>
        </div>
    )
}

export default ButtonConfirmation;
