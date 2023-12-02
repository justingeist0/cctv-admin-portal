import React from 'react';
import { useState } from 'react';
import IconInputText from './view/IconInputText';
import {ReactComponent as NameIcon} from './svg/user_card.svg';
import {ReactComponent as AddressIcon} from './svg/address.svg';
import {ReactComponent as PhoneIcon} from './svg/phone.svg';

const AddVenue = ({ refreshVenues }) => {
  const [isAdding, setIsAdding] = useState(false);

  return (
    <div className='container'>
      {isAdding ? 
        <VenueEditBox refreshVenues={refreshVenues} close={() => setIsAdding(false)} />
       : 
        <button className='clickable hover' onClick={() => { setIsAdding(true)}}>Add a new Venue</button>
      }
    </div>
  );
};

const VenueEditBox = ({ refreshVenues, close }) => {

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleAddressChange = (e) => {
    setAddress(e.target.value);
  };

  const handlePhoneChange = (e) => {
    setPhone(e.target.value);
  };

  return (
    <div className="hover box" style={{display: 'flex'}}>
      <div style={{flexGrow: "1"}}>
        <>
          <IconInputText src={<NameIcon className="text-input-icon" />} placeholderText={"Name..."} text={name} handleInputChange={handleNameChange}/>
          <IconInputText src={<AddressIcon className="text-input-icon" />} placeholderText={"Address..."} text={address} handleInputChange={handleAddressChange}/>
          <IconInputText src={<PhoneIcon className="text-input-icon" />} placeholderText={"Phone..."} text={phone} handleInputChange={handlePhoneChange}/>
        </>
        <button className='clickable hover' onClick={() => {
          addVenue(name, address);
          refreshVenues();
          close();
        }}>Add Venue</button>
        <a style={{marginLeft: '12px', fontSize: '12px'}} className='hover' onClick={close}>Cancel</a>
      </div>
    </div>
  );
};

const addVenue = (name, address) => {

}

export default AddVenue;