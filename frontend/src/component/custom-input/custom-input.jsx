import React from 'react';

import './custom-input-style.scss'

const CustomInput = ({label, handleChange, ...otherProps}) =>(
    <div className='group'>
        <input className='form-input' onChange={handleChange} {...otherProps}/>

        {label ? 
            (<label  className={' ' + otherProps.value.length ? 'shrink' : '', 'form-input-label'}>
                {label}
            </label>)        
        : null 
        }
    </div>
)

export default CustomInput;