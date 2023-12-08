import React, { useState } from 'react';
import './Device.css';
import IconInputText from './view/IconInputText';
import { ReactComponent as Chevron } from './svg/chevron.svg';
import { ReactComponent as Copy } from './svg/copy.svg';
import { ReactComponent as Delay } from './svg/delay.svg';
import { ReactComponent as Delete } from './svg/delete.svg';
import { ReactComponent as Expand } from './svg/expand.svg';
import { ReactComponent as AddImage } from './svg/add_image.svg';
import { ReactComponent as Close } from './svg/close_circle.svg';
import { ReactComponent as Check } from './svg/check_circle.svg';
import { ReactComponent as Ad } from './svg/ad.svg';
import { ReactComponent as Info } from './svg/info.svg';
import { useAuth } from '../AuthContext';

let isFetching = false

const Device = ({ device, selectDevice }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isAddImage, setIsAddImage] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [showAds, setShowAds] = useState(true);
  const [name, setName] = useState(device.name);
  const [password, setPassword] = useState(device.password);
  const [remoteLink, setRemoteLink] = useState(device.remoteLink);
  const [adUrls, setAdUrls] = useState(device.images || []);
  const [statusMessage, setStatusMessage] = useState("");
  const [addAdUrl, setAddAdUrl] = useState("");
  const [deleted, setDeleted] = useState(false);
  const { getToken } = useAuth();

  let mStartIdx = -1;
  let mEndIdx = -1;

  const handleDragStart = (event, startIndex) => {
    mStartIdx = startIndex;
  };
  
  const handleDragOver = (event, endIndex) => {
    event.preventDefault();
    mEndIdx = endIndex;
  };

  const handleDragEnd = (event) => {
    event.preventDefault();
    if (mStartIdx !== mEndIdx) {
      const updatedAdUrls = [...adUrls];
      const temp = updatedAdUrls[mStartIdx];
      updatedAdUrls[mStartIdx] = updatedAdUrls[mEndIdx];
      updatedAdUrls[mEndIdx] = temp;
      setAdUrls(updatedAdUrls);
    }
  };

  const deleteAd = (index) => {
    const updatedAdUrls = [...adUrls];
    updatedAdUrls.splice(index, 1);
    setAdUrls(updatedAdUrls);
  }

  const showStatusMessage = (message) => {
    setStatusMessage(message);
    setTimeout(() => {
        setStatusMessage("");
    }, 2000);
  }

  const copyAd = (ad) => {
    navigator.clipboard.writeText(JSON.stringify(ad));
    showStatusMessage("Copied Ad Data to Clipboard");
  }

  const handleAddAdInput = (e) => {
    setAddAdUrl(e.target.value);
  }

  const addAd = () => {
    const text = addAdUrl
    if (`${text}`.length > 0) {
      if (text[0] === '{')
        setAdUrls([...adUrls, JSON.parse(text)])
      else
        setAdUrls([...adUrls, {url: text, duration: 10}])
      setAddAdUrl("");
    } else {
      alert("This isn't a valid URL or Ad object")
    }
  }

  const saveAll = async () => {
    if (isFetching)
      return
    isFetching = true
    const token = await getToken();
    device['images'] = adUrls;
    device['name'] = name;
    device['password'] = password;
    device['remoteLink'] = remoteLink;

    fetch(process.env.REACT_APP_API_URL + `/devices/${device._id}`, {
      method: 'PUT',
      headers: {
        "Authorization": token,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(device)
    })
    .then(response => {
      if (response.ok){
        showStatusMessage("Saved Changes");
        if (name === "")
          setDeleted(true)
      }
      else
       showStatusMessage("Error Saving Changes");
      isFetching = false
    })
    .catch((error) => {
      console.error("Error fetching data: ", error);
      isFetching = false
    });
  }
  
  const undo = () => { 
    setAdUrls(device.images || [])
    setName(device.name)
    setPassword(device.password)
    setRemoteLink(device.remoteLink)
  }

  if (deleted) {
    return (<div></div>)
  }

  return (
    <div className='box'>
      <div className='device-header' onClick={() => setIsExpanded(!isExpanded)}>
        <h3>{name}</h3>
        <Chevron style={{transform: `rotate(${!isExpanded ? "90" : "270"}deg)`, fill: '#fff'}}/>
      </div>
      {isExpanded && (
        <div className='device-header' style={{marginTop: '12px'}}>
          <div className='device-header'>
            <Ad className={showAds ? 'device-tab-button-selected' : 'device-tab-button'} onClick={() => { setShowAds(!showAds) }}/>
            <Info className={showInfo ? 'device-tab-button-selected' : 'device-tab-button'} onClick={() => { setShowInfo(!showInfo) }}/>
            <AddImage className={isAddImage ? 'device-tab-button-selected' : 'device-tab-button'} onClick={() => { setIsAddImage(!isAddImage) }}/>
            <p style={{marginLeft: "12px"}}>{statusMessage}</p>
          </div>
          <div>
            <button className='clickable hover' onClick={undo}>Undo All</button>
            <button className='clickable hover' style={{marginLeft: "12px"}} onClick={saveAll}>{name === "" ? "Delete" : "Save Changes"}</button>
          </div>
        </div>
      )}
      {isExpanded && isAddImage && (
        <div>
          <br/>
          <IconInputText src={<AddImage className="text-input-icon" />} placeholderText={"Paste Ad Media URL or Copied Ad here..."} text={addAdUrl} handleInputChange={handleAddAdInput}/>
          <a className='hover' href='https://console.firebase.google.com/u/0/project/adtv-64129/storage/adtv-64129.appspot.com/files' target='_blank' rel="noreferrer">Upload Ad Here and Copy the URL</a>
          <br/>
          <br/>
          <button className='clickable hover' onClick={() => { addAd() }}>Add Ad</button>
          <p style={{marginLeft: '12px', fontSize: '12px'}} className='hover' onClick={() => { setIsAddImage(false) }}>Cancel</p>
        </div>
      )}
      {isExpanded && showInfo && (
        <div>
          <br/>
          <h4>Device Name:</h4>
          <IconInputText src={<Info className="text-input-icon" />} placeholderText={"Device Name..."} text={name} handleInputChange={(e) => { setName(e.target.value) }}/>
          <h4>Device Password:</h4>
          <IconInputText src={<Info className="text-input-icon" />} placeholderText={"Device Name..."} text={password} handleInputChange={(e) =>{ setPassword(e.target.value) }}/>
          <h4>Remote Connection Link:</h4>
          <IconInputText src={<Info className="text-input-icon" />} placeholderText={"Device Name..."} text={remoteLink} handleInputChange={(e) =>{ setRemoteLink(e.target.value) }}/>
          <h4>OBS Website Link:</h4>
          <IconInputText src={<Info className="text-input-icon" />} placeholderText={"Device Name..."} text={`https://cc-tv.onrender.com/obs?deviceId=${device._id}`} handleInputChange={(e) =>{ }}/>
        </div>
      )}
      {isExpanded && showAds && (
        <div className='image-container'>
          {adUrls.map((img, index) => (
            <ImageComponent key={index} index={index} handleDragEnd={handleDragEnd} handleDragStart={handleDragStart} handleDragOver={handleDragOver} img={img} deleteAd={deleteAd} copyAd={copyAd}/>
          ))}
        </div>
      )}
    </div>
  )
};

export default Device;

function ImageComponent({index, handleDragEnd, handleDragStart, handleDragOver, img, deleteAd, copyAd}) {
  const [isEditingDuration, setIsEditingDuration] = useState(false);
  const [duration, setDuration] = useState(img.duration);
  const [adName, setAdName] = useState(img.name || '')

  const handleInputChange = (event) => {
    setDuration(event.target.value);
  };

  return <div key={index} className='item' onDragEnd={handleDragEnd}>
    <div>
      <IconInputText src={<Ad className="text-input-icon" />} placeholderText={"Ad Name..."} text={adName} handleInputChange={(e) =>{ setAdName(e.target.value); img['name'] = e.target.value }} isAboveAd={true}/>
    </div>
    <p className='moveable' draggable onDragStart={(event) => handleDragStart(event, index)} onDragOver={(event) => handleDragOver(event, index)}>
      {!img.url.includes(".mp4") ? (
        <img src={img.url || ""} alt="Click to view, this URL is probably wrong" className="media-element" />
      ) : (
        <video autoPlay muted loop controls height="200" className="media-element">
          <source src={img.url} type="video/mp4" />
          Your browser does not support the video tag, please use a different browser.
        </video>
      )}
    </p>
    {!isEditingDuration &&
      <div className='image-svg-container'>
        <Delete className='trash-icon' title="Delete Ad" onClick={() => { deleteAd(index); } } />
        <div className='hover device-header' title="Set Duration" onClick={() => { setIsEditingDuration(true); } }>
          <p style={{ marginRight: '2px', padding: '0' }}>{img.duration}</p>
          <Delay className='image-svg'/>
        </div>
        <Expand className='image-svg' title="Full Screen Preview" onClick={() => { window.open(img.url, "_blank"); } } />
        <Copy className='image-svg' title="Copy Ad" onClick={() => { copyAd(img) }}/>
      </div>}
    {isEditingDuration &&
      <div className='image-svg-container'>
        <input type="number" placeholder="Duration" value={duration} onChange={handleInputChange} />
        <Close className='image-svg' title="Cancel" onClick={() => { setIsEditingDuration(false); setDuration(img.duration)} } />
        <Check className='image-svg' title="Save Duration" onClick={() => { setIsEditingDuration(false); img.duration = duration } } />
      </div>}
  </div>;
}

