import React from 'react';
import Venue from './Venue';

function Venues({ selectVenue, selectedVenue, venues, editVenue }) {
    console.log(venues)
    return (
        <div className='container'>
            <h2>Venues</h2>
            {venues.map(venue => (
                <Venue key={venue._id} venue={venue} selectVenue={selectVenue} isVenueSelected={selectedVenue !== null && selectedVenue._id === venue._id} editVenue={editVenue}/>
            ))}
        </div>
    );
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
