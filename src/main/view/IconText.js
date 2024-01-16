import React from 'react';
import './IconText.css';

const IconText = ({src, text, textClass}) => {
  if (text === null || text.length === 0)
    return (<></>)
  const mText = text ? text : "Not Provided"
  return (
    <div className='text-container'>    
        {src}
        <p className={`${'icon-text-text'} ${textClass}`}>{mText}</p>
    </div>
  );
};

export default IconText;
