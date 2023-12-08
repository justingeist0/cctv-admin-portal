import React, { useEffect, useState } from 'react';
import { useAuth } from '../AuthContext';
import Device from './Device';
import IconInputText from './view/IconInputText';
import { ReactComponent as Info } from './svg/info.svg';

function Devices({ venue, selectDevice }) {
    const [devices, setDevices] = useState([]);
    const [isAddDevice, setIsAddDevice] = useState(false);
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [remoteLink, setRemoteLink] = useState("");
    const { getToken } = useAuth();

    useEffect(() => {
      setDevices([]);
      if (venue)
        setTimeout(async () => {
            const token = await getToken();
            await updateDeviceDropDown(token, venue._id, setDevices);
        })
    }, [venue, getToken]);

    const addDevice = async () => {
      if (name === "") { 
        alert("Name can not be empty")
        return;
      }
      if (password === "") {
        alert("Password can not be empty")
        return;
      }
      if (remoteLink === "") {
        alert("Remote link can not be empty")
        return;
      }
      if (venue === null) {
        alert("Please select a venue")
        return;
      }
      
      const newDevice = {
        name: name,
        password: password,
        remoteLink: remoteLink,
        clientId: venue._id,
      }
      const token = await getToken()
      
      fetch(process.env.REACT_APP_API_URL + '/add-device', {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": token
        },
        body: JSON.stringify(newDevice)
      })
      .then(response => {
          return response.json()
      })
      .then(data => {
        console.log(data)
        newDevice["_id"] = data.insertedId;
        console.log(newDevice)
        setDevices([newDevice, ...devices]);
      })
      .catch(error => {
        console.error("Error fetching data: ", error);
      });

      setName("");
      setPassword("");
      setRemoteLink("");
      setIsAddDevice(false);
    }

    return (
        <div className='container '>
            <h2>{venue ? `${venue.name}'s Devices` : "Select Venue"}</h2>
            {venue && !isAddDevice &&
              <button className='clickable hover' style={{marginTop: "6px"}} onClick={() => { setIsAddDevice(true) }}>Add Device</button>
            }
            {venue && isAddDevice &&
                <div>
                <br/>
                  <h4>Device Name:</h4>
                  <IconInputText src={<Info className="text-input-icon" />} placeholderText={"Device Description..."} text={name} handleInputChange={(e) => { setName(e.target.value) }}/>
                  <h4>Device Password:</h4>
                  <IconInputText src={<Info className="text-input-icon" />} placeholderText={"PC Password..."} text={password} handleInputChange={(e) =>{ setPassword(e.target.value) }}/>
                  <h4>Remote Connection Link:</h4>
                  <IconInputText src={<Info className="text-input-icon" />} placeholderText={"Getscreen.me link..."} text={remoteLink} handleInputChange={(e) =>{ setRemoteLink(e.target.value) }}/>
                  <button className='clickable hover' style={{marginTop: "6px"}} onClick={addDevice}>Add Device</button>
                  <p className='hover' style={{marginLeft: "12px"}} onClick={() => { setIsAddDevice(false) }}>Cancel</p>
                  <br/>
                  <br/>
              </div>
            }
            {devices.map(device => (
                <Device key={device._id} device={device} selectDevice={selectDevice} />
            ))}
        </div>
    );
}

async function updateDeviceDropDown(token, clientId, setDevices) {
  fetch(process.env.REACT_APP_API_URL + `/devices/${clientId}`, {
    headers: {
      "Authorization": token
    }
  })
  .then(response => response.json())
  .then(data => {
      console.log(data)
      setDevices(data);
  })
  .catch(error => {
    console.error("Error fetching data: ", error);
  });
}

export default Devices;
