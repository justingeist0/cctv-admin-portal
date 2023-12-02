import React from 'react';
import './IconInputText.css';

const IconInputText = ({src, placeholderText, text, handleInputChange}) => {
  return (
    <div className='input-container'>    
        {src}
        <input className='text-input' type="text" placeholder={placeholderText} onChange={handleInputChange} value={text}/>
    </div>
  );
};

export default IconInputText;
