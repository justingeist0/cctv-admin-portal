import React from 'react';
import clearIcon from './svg/close_circle.svg'; 
import searchIcon from './svg/search.svg';
import './SearchBar.css';

const SearchBar = ({searchTerm, setSearchTerm}) => {

  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const clearSearch = () => {
    setSearchTerm('');
  };

  return (
    <div className='container'>
        <div className='search-bar'>
            <input className='search-input' type="text" value={searchTerm} onChange={handleInputChange} placeholder="Search..." />
            <img className='clear-icon' src={searchTerm ? clearIcon : searchIcon} alt="clear" onClick={clearSearch} />
        </div>
    </div>
  );
};

export default SearchBar;