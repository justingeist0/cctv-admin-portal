import React, { useEffect, useState } from 'react';
import { useAuth } from '../AuthContext';
import Venue from './Venue';

function Venues({ selectVenue }) {
    const [venues, setVenues] = useState([]);
    const { getToken } = useAuth();

    useEffect(() => {
        setTimeout(async () => {
            const token = await getToken();
            await updateVenueDropDown(token, setVenues);
        })
    }, []);

    return (
        <div className='container'>
            <h2>Venues</h2>
            {venues.map(venue => (
                <Venue key={venue._id} venue={venue} selectVenue={selectVenue} isVenueSelected={true}/>
            ))}
        </div>
    );
}




    
async function updateVenueDropDown(token, setVenues) {
    fetch('https://cc-tv.onrender.com/clients', {
        headers: {
            "Authorization": token
        }
    })
    .then(response => response.json())
    .then(data => {
        setVenues(data)
    })
    .catch(error => {
        console.error("Error fetching data: ", error);
    });
}

// async function updateDeviceDropDown(clientId) {
//     fetch(`/devices/${clientId}`, {
//       headers: {
//         "Authorization": await getToken()
//       }
//     })
//     .then(response => response.json())
//     .then(data => {
//         console.log(data)
//         setDevices(data);
//     })
//     .catch(error => {
//       console.error("Error fetching data: ", error);
//     });
//   }

export default Venues;
