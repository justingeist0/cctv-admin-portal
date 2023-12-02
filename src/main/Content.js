import { useState } from 'react';
import React from 'react';
import './Content.css';
import Venues from './Venues';
import Devices from './Devices';
import SearchBar from './SearchBar';
import AddVenue from './AddVenue';

const Content = () => {
    const [venue, setVenue] = useState(null);
    const [device, setDevice] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    return (
        <div className="content-container">
            <div className="column">
                <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>
                <AddVenue refreshVenues={() => {}}/>
                <Venues selectVenue={setVenue} />
            </div>
            <div className="column-wide">
                <Devices venue={venue} selectDevice={setDevice} />
            </div>
        </div>
    );
};

export default Content;

