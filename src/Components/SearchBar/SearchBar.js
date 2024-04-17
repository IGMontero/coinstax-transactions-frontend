import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import { components } from 'react-select';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { layoutModeTypes } from '../constants/layout';
import { Col } from 'reactstrap';
import DropdownAddresses from './DropdownAddresses/DropdownAddresses';

const SearchBar = ({ onDropdownSelect, selectedOption }) => {
  const navigate = useNavigate();
  const { layoutModeType } = useSelector((state) => ({
    layoutModeType: state.Layout.layoutModeType,
  }));

  const [searchInput, setSearchInput] = useState('');

  const originalOptions = [
    {
      label: searchInput,
      value: searchInput,
    },
  ];

  // Render current input value as option too.
  const [options, setOptions] = useState(originalOptions);

  useEffect(() => {
    if (selectedOption) {
      setSearchInput(selectedOption.label);
      setOptions([
        selectedOption,
        ...originalOptions.filter((o) => o.value !== selectedOption.value),
      ]);
    }
  }, [selectedOption]);

  const handleChange = (selectedOption) => {
    if (selectedOption && selectedOption.value) {
      navigate(`/address/${selectedOption.value}`);

      // Save Options to LocalStorage
      const currentOptions = JSON.parse(
        localStorage.getItem('searchOptions') || '[]',
      );
      if (
        !currentOptions.find((option) => option.value === selectedOption.value)
      ) {
        const newOptions = [...currentOptions, selectedOption];
        localStorage.setItem('searchOptions', JSON.stringify(newOptions));
        console.log('Saving new option:', newOptions); // Log para depuración
      } else {
        console.log('Option already exists'); // Verificar si ya existe
      }
    }
  };

  const handleInputChange = (inputValue, actionMeta) => {
    const filteredInput = inputValue.replace(/[^a-zA-Z0-9]/g, '');
    const options = originalOptions;

    if (actionMeta.action === 'input-change') {
      setSearchInput(filteredInput);
      if (!filteredInput.trim()) {
        setOptions(options);
      } else {
        setOptions(options);
      }
    }
  };

  const handleSearchIconClick = () => {
    if (searchInput) {
      navigate(`/address/${searchInput}`);

      const currentOptions = JSON.parse(
        localStorage.getItem('searchOptions') || '[]',
      );
      const optionToSave = { label: searchInput, value: searchInput };

      if (!currentOptions.find((option) => option.value === searchInput)) {
        const newOptions = [...currentOptions, optionToSave];
        localStorage.setItem('searchOptions', JSON.stringify(newOptions));
      } else {
        console.log('Option already exists');
      }
    }
  };

  const DropdownIndicator = (props) => {
    return (
      <components.DropdownIndicator {...props}>
        <div onClick={handleSearchIconClick}>
          <i
            className={`ri-search-line align-middle text-${
              layoutModeType === layoutModeTypes['DARKMODE'] ? 'white' : 'dark'
            } ${searchInput ? 'cursor-pointer' : ''}`}
          ></i>
        </div>
      </components.DropdownIndicator>
    );
  };

  const customStyles = {
    control: (provided) => ({
      ...provided,
      backgroundColor:
        layoutModeType === layoutModeTypes['DARKMODE'] ? '#212529' : '#fff',
      color: layoutModeType === layoutModeTypes['DARKMODE'] ? '#fff' : 'black',
      cursor: 'text',
      maxHeight: 35,
      textAlign: 'left',
      border:
        layoutModeType === layoutModeTypes['DARKMODE']
          ? '1px solid #32383e'
          : '1px solid #ddd',
      outline: 'none !important',
      boxShadow: 'none !important',
      '&:hover': {
        border:
          layoutModeType === layoutModeTypes['DARKMODE']
            ? '1px solid #555'
            : '1px solid #ccc',
      },
    }),
    menu: (provided) => ({
      ...provided,
      zIndex: 9999,
      backgroundColor:
        layoutModeType === layoutModeTypes['DARKMODE'] ? '#2a2f34' : '#fff',
      color: layoutModeType === layoutModeTypes['DARKMODE'] ? '#fff' : 'black',
      textAlign: 'left',
      cursor: 'pointer',
      borderRadius: '5px',
    }),
    option: (provided, state) => ({
      ...provided,
      cursor: 'pointer',
      backgroundColor: state.isFocused
        ? layoutModeType === layoutModeTypes['DARKMODE']
          ? '#2a2f34'
          : '#e2e2e2'
        : state.isSelected
          ? layoutModeType === layoutModeTypes['DARKMODE']
            ? '#212529'
            : '#ddd'
          : 'transparent',
      color:
        state.isFocused || state.isSelected
          ? 'white'
          : layoutModeType === layoutModeTypes['DARKMODE']
            ? '#fff'
            : 'black',
      ':active': {
        ...provided[':active'],
        backgroundColor: state.isFocused
          ? layoutModeType === layoutModeTypes['DARKMODE']
            ? '#2a2f34'
            : '#e2e2e2'
          : state.isSelected
            ? layoutModeType === layoutModeTypes['DARKMODE']
              ? '#212529'
              : '#ddd'
            : 'transparent',
      },
      '&:hover': {
        backgroundColor:
          layoutModeType === layoutModeTypes['DARKMODE']
            ? '#1f252b'
            : '#e2e2e2',
        color: 'white',
      },
    }),
    input: (provided) => ({
      ...provided,
      color: layoutModeType === layoutModeTypes['DARKMODE'] ? '#fff' : 'black',
    }),
    singleValue: (provided) => ({
      ...provided,
      color: layoutModeType === layoutModeTypes['DARKMODE'] ? '#fff' : 'black',
    }),
  };

  return (
    <Col className="d-flex col-12 w-100 align-items-center">
      <Select
        name="address"
        placeholder="Assets, wallet, domain, or identity"
        className="col-12 w-100"
        classNamePrefix="select-custom-menu"
        value={options?.find((option) => option.value === searchInput)}
        options={options || []}
        onChange={handleChange}
        onInputChange={handleInputChange}
        components={{ DropdownIndicator }}
        styles={customStyles}
        // isClearable
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            navigate(`/address/${searchInput}`);
          }
        }}
      />
      <DropdownAddresses onSelect={onDropdownSelect} />
    </Col>
  );
};

export default SearchBar;
