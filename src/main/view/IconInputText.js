import React from 'react';
import './IconInputText.css';

const IconInputText = ({src, placeholderText, text, handleInputChange, isAboveAd}) => {
  const mIsAboveAd = isAboveAd || false;
  return (
    <div className='input-container' style={mIsAboveAd ? { marginTop: '12px', marginBottom: '0px', "borderRadius": "10px 10px 0px 0px" } : {}}>    
        {src}
        <input className='text-input' type="text" placeholder={placeholderText} onChange={handleInputChange} value={text}/>
    </div>
  );
};

export default IconInputText;
