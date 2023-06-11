import React from 'react';
import './styles.css'

const Button = ({text, onClick, disabled, style, width}) => {
  return (
    <div onClick={onClick} className='custom-btn' disabled={disabled} style={style} width={'70vw'}>{text}</div>
  )
}

export default Button