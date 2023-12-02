import React from 'react';
import './IconText.css';

const IconText = ({src, text, textClass}) => {
  const mText = text || 'Not provided';
  return (
    <div className='text-container'>    
        {src}
        <p className={`${'icon-text-text'} ${textClass}`}>{mText}</p>
    </div>
  );
};

export default IconText;
