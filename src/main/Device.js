import React, { useState } from 'react';
import './Device.css';

const Device = ({ device, selectDevice }) => {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(device.name);
  const [imageUrl, setImageUrl] = useState(device.address || "No Image Url");
  const [showImage, setShowImage] = useState(false)

  const handleEdit = () => {
    setEditing(!editing);
  };

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleAddressChange = (e) => {
    setImageUrl(e.target.value);
  };

  return (
    <div className="venue-container" onClick={() => setShowImage(!showImage)}>
      {editing ? (
        <>
          <input type="text" value={name} onChange={handleNameChange} />
          <input type="text" value={imageUrl} onChange={handleAddressChange} />
        </>
      ) : (
        <>
          <p className="venue-name">{name}</p>
          <p className="venue-address">{imageUrl}</p>
        </>
      )}
      <button onClick={handleEdit}>{editing ? 'Save' : 'Edit'}</button>
      {showImage &&
        <>
          {device.images.map((img, index) => (
            <a key={index} href={img.url} target="_blank">
              {!img.url.includes(".mp4") ? (
                <img src={img.url} style={{height: '200px'}} alt="Click to view image, this URL is probably wrong" className="media-element" />
              ) : (
                <video autoPlay muted loop controls height="200" className="media-element">
                  <source src={img.url} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              )}
            </a>
          ))}
        </>
      }
    </div>
  );
};

export default Device;