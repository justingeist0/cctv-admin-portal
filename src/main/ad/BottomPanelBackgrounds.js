
import React, { useEffect, useState } from 'react';
import Select from 'react-select';

const images =[
    "https://firebasestorage.googleapis.com/v0/b/linklocal-c5d8f.appspot.com/o/leafy.png?alt=media&token=e03f0a5d-70ff-46ff-9737-10b06a80f4c4",
    "https://firebasestorage.googleapis.com/v0/b/linklocal-c5d8f.appspot.com/o/swirlyrirly.png?alt=media&token=464075d7-3437-4350-88d1-6c51ca966218",
    "https://firebasestorage.googleapis.com/v0/b/linklocal-c5d8f.appspot.com/o/spicy.png?alt=media&token=69d63a40-13d4-478e-9bb9-95447e4562a6",
    "https://firebasestorage.googleapis.com/v0/b/linklocal-c5d8f.appspot.com/o/spaghettinoodles.png?alt=media&token=3e2e9ac1-d802-4f81-930d-a10b3f902df0",
    "https://firebasestorage.googleapis.com/v0/b/linklocal-c5d8f.appspot.com/o/plateserved.png?alt=media&token=24e2818c-46f4-44a0-8512-1c6538c35290",
    "https://firebasestorage.googleapis.com/v0/b/linklocal-c5d8f.appspot.com/o/barber.png?alt=media&token=0f347367-2f5d-4715-81eb-92f7ea845349",
    "https://firebasestorage.googleapis.com/v0/b/linklocal-c5d8f.appspot.com/o/swimmyswimmy.png?alt=media&token=aa1f70cd-a23e-4f16-b5fd-b4f589cbe6bb"
  ]

  const options = images.map((image, index) => ({
    value: image,
    label: `Image ${index + 1}`,
    image: { uri: image },
  }));
  
  const formatOptionLabel = ({ value, label, image }) => (
    <div style={{color:"black"}}>
      <img src={value} alt={label} width="1628" height="168" />
      {label}
    </div>
  );
  
  function ImageDropdown({setBottomPanelImage}) {
    const [selectedOption, setSelectedOption] = React.useState(options[0]);
  
    useEffect(() => {
        setBottomPanelImage(selectedOption.value);
    }, [selectedOption]);

    return (
      <Select
        value={selectedOption}
        onChange={setSelectedOption}
        options={options}
        formatOptionLabel={formatOptionLabel}
      />
    );
  }
export default ImageDropdown;