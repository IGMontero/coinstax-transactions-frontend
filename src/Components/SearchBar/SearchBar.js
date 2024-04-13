import React, { useState } from 'react';
import Select from 'react-select';
import { components } from 'react-select';
import { useNavigate } from 'react-router-dom';

const SearchBar = () => {
  const navigate = useNavigate();


  const [searchInput, setSearchInput] = useState('');

  const originalOptions = [
    {
      label: '0x768d280111e0fdc53e355cefb1962eb91b6cca2d',
      value: '0x768d280111e0fdc53e355cefb1962eb91b6cca2d',
    },
    {
      label: '0x89754b96dd367065ED6CA9d93a84A417527BE730',

      value: '0x89754b96dd367065ED6CA9d93a84A417527BE730',
    },
    {
      label: '0xdf7caf734b8657bcd4f8d3a64a08cca1d5c878a6',
      value: '0xdf7caf734b8657bcd4f8d3a64a08cca1d5c878a6',
    },
    {
      label: searchInput,
      value: searchInput,
    }
  ];

  // Render current input value as option too.
  const [options, setOptions] = useState(
    originalOptions
  );

  const handleChange = (selectedOption) => {
    if (selectedOption && selectedOption.value) {
      navigate(`/address/${selectedOption.value}/tokens`);
    } else {
      return;
    }
  };

  const handleInputChange = (inputValue, actionMeta) => {
    const filteredInput = inputValue.replace(/[^a-zA-Z0-9]/g, '');
    const options = originalOptions

    if (actionMeta.action === 'input-change') {
      setSearchInput(filteredInput);
      if (!filteredInput.trim()) {
        setOptions(options);
      } else {
        setOptions(options);
      }
    }
  };

  console.log(options)

  const DropdownIndicator = (props) => {
    return (
      <components.DropdownIndicator {...props}>
        <i className="ri-search-line align-middle text-white"></i>
      </components.DropdownIndicator>
    );
  };

  const customStyles = {
    control: (provided) => ({
      ...provided,
      backgroundColor: '#212529',
      color: '#fff',
      cursor: 'text',
      maxHeight: 35,
      textAlign: 'left',
      border: '1px solid #32383e',
      outline: 'none !important',
      boxShadow: 'none !important',
      '&:hover': { border: '1px solid #555' },
    }),
    menu: (provided) => ({
      ...provided,
      zIndex: 9999,
      backgroundColor: '#2a2f34',
      color: '#fff',
      textAlign: 'left',
      cursor: 'pointer',
      borderRadius: '5px',
    }),
    option: (provided, state) => ({
      ...provided,
      cursor: 'pointer',
      backgroundColor: state.isFocused
        ? '#2a2f34'
        : state.isSelected
          ? '#212529'
          : 'transparent',
      color: state.isFocused || state.isSelected ? 'white' : '#fff',
      ':active': {
        ...provided[':active'],
        backgroundColor: state.isFocused
          ? '#2a2f34'
          : state.isSelected
            ? '#212529'
            : 'transparent',
      },
      '&:hover': {
        backgroundColor: '#1f252b',
        color: 'white',
      },
    }),
    input: (provided) => ({
      ...provided,
      color: '#fff',
    }),
    singleValue: (provided) => ({
      ...provided,
      color: '#fff',
    }),
  };

  return (
    <Select
      name="address"
      placeholder="Assets, wallet, domain, or identity"
      classNamePrefix="select-custom-menu"
      value={options?.find((option) => option.value === searchInput)}
      options={options || []}
      onChange={handleChange}
      onInputChange={handleInputChange}
      components={{ DropdownIndicator }}
      styles={customStyles}
      // isClearable
      onKeyDown={
        (e) => {
          console.log(e.key);
          if (e.key === 'Enter') {
            navigate(`/address/${searchInput}/tokens`);
          }
        }
      }
    />
  );
};

export default SearchBar;
