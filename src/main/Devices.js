import React, { useEffect, useState } from 'react';
import { useAuth } from '../AuthContext';
import Device from './Device';

function Devices({ venue, selectDevice }) {
    const [devices, setDevices] = useState([]);
    const { getToken } = useAuth();

    useEffect(() => {
      setDevices([]);
      if (venue)
        setTimeout(async () => {
            const token = await getToken();
            await updateDeviceDropDown(token, venue._id, setDevices);
        })
    }, [venue]);

    return (
        <div className='container '>
            <h2>{venue ? `${venue.name}'s Devices` : "Select Venue"}</h2>
            {venue &&
              <button className='clickable hover' style={{marginTop: "6px"}}>Add Device</button>
            }
            {devices.map(device => (
                <Device key={device._id} device={device} selectDevice={selectDevice} />
            ))}
        </div>
    );
}

async function updateDeviceDropDown(token, clientId, setDevices) {
    fetch(`/devices/${clientId}`, {
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
