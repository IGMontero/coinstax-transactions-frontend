import React, { useState, useEffect } from 'react';
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap';

const DropdownAddresses = ({ onSelect }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [options, setOptions] = useState([]);

  useEffect(() => {
    const storedOptions =
      JSON.parse(localStorage.getItem('searchOptions')) || [];
    setOptions(storedOptions);
  }, []);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleSelect = (option) => {
    console.log('option', option);
    onSelect(option);
    setDropdownOpen(false);
  };

  return (
    <Dropdown isOpen={dropdownOpen} toggle={toggleDropdown}>
      <DropdownToggle
        caret={false}
        color="primary"
        className="btn btn-primary dropdown-toggle btn-sm align-items-center d-flex justify-content-center ms-3 p-1 mb-0"
      >
        <i className="bi bi-list fw-bold fs-8 px-0 pe-n1"></i>
      </DropdownToggle>
      <DropdownMenu className="mt-1">
        {options.length > 0 ? (
          options.map((option, index) => (
            <DropdownItem key={index} onClick={() => handleSelect(option)}>
              {option.label}
            </DropdownItem>
          ))
        ) : (
          <DropdownItem disabled>No results</DropdownItem>
        )}
      </DropdownMenu>
    </Dropdown>
  );
};

export default DropdownAddresses;
