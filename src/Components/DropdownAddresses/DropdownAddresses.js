import React, { useState, useEffect } from 'react';
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap';

const DropdownAddresses = ({ options2 }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [options, setOptions] = useState([]);

  useEffect(() => {
    // Check if there are options passed as props
    if (options2 && options2.length > 0) {
      setOptions(options2);
    } else {
      // Load from localStorage if no options are provided as props
      const storedOptions =
        JSON.parse(localStorage.getItem('dropdownOptions')) || [];
      setOptions(storedOptions);
    }
  }, [options2]);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
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
            <DropdownItem key={index}>{option.label}</DropdownItem>
          ))
        ) : (
          <DropdownItem disabled>No results</DropdownItem>
        )}
      </DropdownMenu>
    </Dropdown>
  );
};

export default DropdownAddresses;
