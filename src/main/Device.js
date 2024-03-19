import React, { useEffect, useState } from 'react';
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

const Device = ({ device, selectDevice, deviceState, setDeviceState }) => {
  const deviceSettings = deviceState[device._id] || {};
  const [isExpanded, setIsExpanded] = useState(deviceSettings.isExpanded !== undefined ? deviceSettings.isExpanded : false);
  const [isAddImage, setIsAddImage] = useState(deviceSettings.isAddImage !== undefined ? deviceSettings.isAddImage : true);
  const [showInfo, setShowInfo] = useState(deviceSettings.showInfo !== undefined ? deviceSettings.showInfo : true);
  const [showAds, setShowAds] = useState(deviceSettings.showAds !== undefined ? deviceSettings.showAds : true);
  const [name, setName] = useState(deviceSettings.name !== undefined ? deviceSettings.name : device.name);
  const [password, setPassword] = useState(deviceSettings.password !== undefined ? deviceSettings.password : device.password);
  const [remoteLink, setRemoteLink] = useState(deviceSettings.remoteLink !== undefined ? deviceSettings.remoteLink : device.remoteLink);
  const [adUrls, setAdUrls] = useState(deviceSettings.images !== undefined ? deviceSettings.images : (device.images || []));
  const [statusMessage, setStatusMessage] = useState(deviceSettings.statusMessage !== undefined ? deviceSettings.statusMessage : "");
  const [addAdUrl, setAddAdUrl] = useState(deviceSettings.addAdUrl !== undefined ? deviceSettings.addAdUrl : "");
  const [isMirroringDevice, setIsMirroringDevice] = useState(deviceSettings.isMirror !== undefined ? deviceSettings.isMirror : device.mirrorDeviceId !== undefined);
  const [mirrorDeviceId, setMirrorDeviceId] = useState(deviceSettings.mirrorDeviceId !== undefined ? deviceSettings.mirrorDeviceId : device.mirrorDeviceId !== undefined ? device.mirrorDeviceId : "");

  const [deleted, setDeleted] = useState(false);
  const { getToken } = useAuth();

  useEffect(() => {
    return () => {
      const updatedDeviceState = {
        isExpanded: isExpanded,
        isAddImage: isAddImage,
        showInfo: showInfo,
        showAds: showAds,
        name: name,
        password: password,
        remoteLink: remoteLink,
        images: adUrls,
        statusMessage: statusMessage,
        addAdUrl: addAdUrl,
        isMirror: isMirroringDevice,
        mirrorDeviceId: mirrorDeviceId
      }
      deviceState[device._id] = updatedDeviceState;
      setDeviceState(deviceState);
    };
  }, [isExpanded, isAddImage, showInfo, showAds, name, password, remoteLink, adUrls, statusMessage, addAdUrl, device._id, deviceState, setDeviceState, isMirroringDevice, mirrorDeviceId]);

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


  const handleMirrorInput = (e) => {
    setMirrorDeviceId(e.target.value);
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
    device['mirrorDeviceId'] = isMirroringDevice ? mirrorDeviceId : undefined;
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
            <AddImage className={isAddImage ? 'device-tab-button-selected' : 'device-tab-button'} onClick={() => { setIsAddImage(!isAddImage) }}/>
            <Info className={showInfo ? 'device-tab-button-selected' : 'device-tab-button'} onClick={() => { setShowInfo(!showInfo) }}/>
            <p style={{marginLeft: "12px"}}>{statusMessage}</p>
          </div>
          <div>
            <button className='clickable hover' onClick={undo}>Undo All</button>
            <button className='clickable hover' style={{marginLeft: "12px"}} onClick={saveAll}>{name === "" ? "Delete" : "Save Changes"}</button>
          </div>
        </div>
      )}
      {isExpanded && showAds && (!isMirroringDevice || `${device._id}` === `${mirrorDeviceId}`) && (
        <div className='image-container'>
          {adUrls.map((img, index) => (
            <ImageComponent key={index} index={index} handleDragEnd={handleDragEnd} handleDragStart={handleDragStart} handleDragOver={handleDragOver} img={img} deleteAd={deleteAd} copyAd={copyAd}/>
          ))}
        </div>
      )}
      {isExpanded && isAddImage && (
        <div>
          <br/>
          <div>
            <label>
              Sync Group
              <input
                type="checkbox"
                checked={isMirroringDevice}
                onChange={() => { setIsMirroringDevice(!isMirroringDevice) }}
              />
            </label>
          </div>
          <br/>
          {(!isMirroringDevice || `${device._id}` === `${mirrorDeviceId}`) && (
            <div>
                <IconInputText src={<AddImage className="text-input-icon" />} placeholderText={"Paste Ad Media URL or Copied Ad here..."} text={addAdUrl} handleInputChange={handleAddAdInput}/>
                <a className='hover' href='https://console.firebase.google.com/u/0/project/adtv-64129/storage/adtv-64129.appspot.com/files' target='_blank' rel="noreferrer">Upload Ad Here and Copy the URL</a>
                <br/>
                <br/>
                <button className='clickable hover' onClick={() => { addAd() }}>Add Ad</button>
            </div>
          )}
          {isMirroringDevice && (
             <IconInputText src={<AddImage className="text-input-icon" />} placeholderText={"Paste Device ID of what you want to sync. If this is host device paste this device's Device ID here."} text={mirrorDeviceId} handleInputChange={handleMirrorInput}/>
          )}
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
          
          <h4>Device ID:</h4>
          <div className='cursor-pointer' onClick={async () => {
              if (typeof window !== 'undefined') {
                  const newClipItem = new ClipboardItem({
                      "text/plain": new Blob([`${device._id}`], {type: "text/plain"})
                  });
                  await navigator.clipboard.write([newClipItem]);
                  alert("Copied Device ID to Clipboard")
              }
            }}>
            <IconInputText 
              src={<Info className="text-input-icon" />} 
              placeholderText={""} 
              text={`${device._id}`} 
              handleInputChange={(e) =>{ }}
            />
          </div>

          <h4>OBS Website Link:</h4>
          <div className='cursor-pointer' onClick={async () => {
              if (typeof window !== 'undefined') {
                  const newClipItem = new ClipboardItem({
                      "text/plain": new Blob([`https://linklocal.onrender.com/obs?deviceId=${device._id}`], {type: "text/plain"})
                  });
                  await navigator.clipboard.write([newClipItem]);
                  alert("Copied OBS Link to Clipboard")
              }
            }}>
            <IconInputText 
              src={<Info className="text-input-icon" />} 
              placeholderText={""} 
              text={`https://linklocal.onrender.com/obs?deviceId=${device._id}`} 
              handleInputChange={(e) =>{ }}
            />
          </div>
        </div>
      )}
    </div>
  )
};


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
    <div className='moveable' draggable onDragStart={(event) => handleDragStart(event, index)} onDragOver={(event) => handleDragOver(event, index)}>
      {!img.url.includes(".mp4") ? (
        <img src={img.url || ""} alt="Click to view, this URL is probably wrong" className="media-element" />
      ) : (
        <video autoPlay muted loop controls height="200" className="media-element">
          <source src={img.url} type="video/mp4" />
          Your browser does not support the video tag, please use a different browser.
        </video>
      )}
    </div>
    {!isEditingDuration &&
      <div className='image-svg-container'>
        <Delete className='trash-icon' title="Delete Ad" onClick={() => { deleteAd(index); } } />
        <div className='hover device-header' title="Set Duration" onClick={() => { setIsEditingDuration(true); } }>
          <p style={{ margin: '0',marginRight: '2px', padding: '0' }}>{img.duration}</p>
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

export default Device
