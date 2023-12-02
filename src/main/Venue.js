import React, { useState } from 'react';
import { ReactComponent as Chevron } from './svg/chevron.svg';
import IconInputText from './view/IconInputText';
import IconText from './view/IconText';
import {ReactComponent as NameIcon} from './svg/user_card.svg';
import {ReactComponent as AddressIcon} from './svg/address.svg';
import {ReactComponent as PhoneIcon} from './svg/phone.svg';

const Venue = ({ venue, selectVenue, isVenueSelected }) => {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(venue.name);
  const [address, setAddress] = useState(venue.address);
  const [phone, setPhone] = useState(venue.phone);

  const handleEdit = () => {
    setEditing(!editing);
  };

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
    <div className="hover box" style={{display: 'flex'}} onClick={() => selectVenue(venue)}>
      {/* <p className="venue-id">{venue._id}</p> */}
      <div style={{flexGrow: "1"}}>
       
      {editing ? (
        <>
          <IconInputText src={<NameIcon className="text-input-icon" />} placeholderText={"Name..."} text={name} handleInputChange={handleNameChange}/>
          <IconInputText src={<AddressIcon className="text-input-icon" />} placeholderText={"Address..."} text={address} handleInputChange={handleAddressChange}/>
          <IconInputText src={<PhoneIcon className="text-input-icon" />} placeholderText={"Phone..."} text={phone} handleInputChange={handlePhoneChange}/>
        </>
      ) : (
        <>
          <IconText src={<NameIcon className="svg" />} textClass={"main-text"} text={name}/>
          <IconText src={<AddressIcon className="svg" />} textClass={"sub-text accent"} text={address}/>
          <IconText src={<PhoneIcon className="svg" />} textClass={"sub-text accent"} text={phone}/>
        </>
      )}
      <button className='clickable hover' onClick={handleEdit}>{editing ? 'Save' : 'Edit'}</button>
      {editing &&
        <a style={{marginLeft: '12px', fontSize: '12px'}} className='hover' onClick={handleEdit}>Cancel</a>
      }
      </div>

      {!editing && 
        <Chevron className="svg" />
      }

    </div>
  );
};

export default Venue;