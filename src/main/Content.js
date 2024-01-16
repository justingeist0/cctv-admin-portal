import { useState, useEffect } from 'react';
import React from 'react';
import './Content.css';
import Venues from './Venues';
import Devices from './Devices';
import SearchBar from './SearchBar';
import AddVenue from './AddVenue';
import { useAuth } from '../AuthContext';

const Content = () => {
    const [venues, setVenues] = useState([]);
    const [venue, setVenue] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [deviceState, setDeviceState] = useState({});
    const { getToken } = useAuth();

    useEffect(() => {
        setTimeout(async () => {
            const token = await getToken();
            await updateVenueDropDown(token, setVenues);
        })
    }, [getToken]);

    const editVenue = async (venue) => {  
        const token = await getToken();
        updateVenue(token, venue, () => {
            const newVenues = venues.map(v => {
                if (v._id === venue._id)
                    return venue;
                return v;
            });
            setVenues(newVenues);
        });
    }

    return (
        <div className="content-container">
            <div className="column">
                <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>
                <AddVenue addVenue={(v) => {
                    const newVenues = [v, ...venues];
                    setVenues(newVenues);
                }}/>
                <Venues selectVenue={setVenue} selectedVenue={venue} venues={venues} editVenue={editVenue}/>
            </div>
            <div className="column-wide">
                <Devices venue={venue} selectDevice={() => {}} deviceState={deviceState} setDeviceState={setDeviceState} />
            </div>
        </div>
    );
};

async function updateVenueDropDown(token, setVenues) {
    fetch(process.env.REACT_APP_API_URL + '/clients', {
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

async function updateVenue(token, venue, onSuccess) {
    fetch(process.env.REACT_APP_API_URL + '/update-client', {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": token
        },
        body: JSON.stringify(venue)
    })
    .then(response => response.json())
    .then(data => {
        onSuccess()
    })
    .catch(error => {
        console.error("Error fetching data: ", error);
    });
}

export default Content;

