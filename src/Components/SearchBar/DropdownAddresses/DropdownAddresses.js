import React, { useState, useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Button,
} from 'reactstrap';
import Swal from 'sweetalert2';

const DropdownAddresses = ({ onSelect }) => {
  const { address } = useParams();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const location = useLocation();
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
    onSelect(option);
    setDropdownOpen(false);
  };

  const handleDeleteOptionFromLocalStorage = (e, option) => {
    e.preventDefault();
    e.stopPropagation();
    Swal.fire({
      title: 'Are you sure?',
      text: '',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        const storedOptions =
          JSON.parse(localStorage.getItem('searchOptions')) || [];
        const newOptions = storedOptions.filter(
          (storedOption) => storedOption.value !== option.value,
        );
        localStorage.setItem('searchOptions', JSON.stringify(newOptions));
        setOptions((currentOptions) =>
          currentOptions.filter((o) => o.value !== option.value),
        );

        Swal.fire('Deleted!', 'Your address has been deleted.', 'success');
      }
    });
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
          options.map((option, index) =>
            option ? (
              <>
                <DropdownItem
                  className="d-flex justify-content-between align-items-center pe-2 "
                  key={index}
                  onClick={() => handleSelect(option)}
                >
                  {option.logo ? (
                    <img
                      src={option.logo}
                      alt="logo"
                      className="me-2"
                      style={{ width: '20px' }}
                    />
                  ) : null}
                  <span className="me-2"> {option.label}</span>{' '}
                  <Button
                    color="soft-danger"
                    className="btn btn-sm ms-auto p-1 py-0"
                    onClick={(e) =>
                      handleDeleteOptionFromLocalStorage(e, option)
                    }
                  >
                    <span>X</span>
                  </Button>
                </DropdownItem>
                {options.length - 1 !== index ? (
                  <hr className="my-auto ms-4" style={{ width: '83%' }} />
                ) : null}
              </>
            ) : null,
          )
        ) : (
          <DropdownItem disabled>No results</DropdownItem>
        )}
      </DropdownMenu>
    </Dropdown>
  );
};

export default DropdownAddresses;
