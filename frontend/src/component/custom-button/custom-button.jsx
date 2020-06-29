import React from 'react'

import './custom-button-style.scss'

const CustomButton = ({color, children, ...otherProps}) =>(
    <div className={color ? 'button-section': 'form-button'}>
        <button className={color ? color : 'button'}{...otherProps}>{children}</button>
    </div>
)

export default CustomButton