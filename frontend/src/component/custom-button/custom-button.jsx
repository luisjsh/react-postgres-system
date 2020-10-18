import React from 'react'

import './custom-button-style.scss'

const CustomButton = ({color, gridArea, children, ...otherProps}) =>(
    <div className={color ? 'button-section': 'form-button'}>
        <button className={color ? color : 'button'} style={{gridArea: gridArea ? gridArea : ''}} {...otherProps}>{children}</button>
    </div>
)

export default CustomButton