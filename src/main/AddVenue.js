import React from 'react';
import { useState } from 'react';
import IconInputText from './view/IconInputText';
import {ReactComponent as NameIcon} from './svg/user_card.svg';
import {ReactComponent as AddressIcon} from './svg/address.svg';
import {ReactComponent as PhoneIcon} from './svg/phone.svg';
import { useAuth } from '../AuthContext';

const AddVenue = ({ addVenue }) => {
  const [isAdding, setIsAdding] = useState(false);

  return (
    <div className='container'>
      {isAdding ? 
        <VenueEditBox addVenue={addVenue} close={() => setIsAdding(false)} />
       : 
        <button className='clickable hover' onClick={() => { setIsAdding(true)}}>Add a new Venue</button>
      }
    </div>
  );
};

const VenueEditBox = ({ addVenue, close }) => {
  const { getToken } = useAuth();

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
          addVenueRequest(name, address, phone, getToken(), addVenue, close);
        }}>Add Venue</button>
        <p style={{marginLeft: '12px', fontSize: '12px'}} className='hover' onClick={close}>Cancel</p>
      </div>
    </div>
  );
};

const addVenueRequest = (name, address, phone, getToken, addVenue, close) => {
  if (name === "") {
    alert("Please enter a name for the venue.");
    return;
  }
  if (address === "") {
    alert("Please enter an address for the venue.");
    return;
  }
  const data = {
    name: name,
    address: address,
    phone: phone
  }
  getToken.then((token) => {
    fetch(process.env.REACT_APP_API_URL + "/add-client", {
      method: "POST",
      headers: {
          "Content-Type": "application/json",
          "Authorization": token
      },
      body: JSON.stringify(data)
  })
  .then(response => {
      return response.json()
  })
  .then(json => {
      data["_id"] = json.insertedId;
      console.log(data);
      addVenue(data);
      close();
  })
  .catch(error => {
      console.error("Fetch error: ", error);
  });
  })
}

export default AddVenue;