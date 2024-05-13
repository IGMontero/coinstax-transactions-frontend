import React, { useCallback, useEffect, useState } from 'react';
import Select from 'react-select';
import { components } from 'react-select';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { layoutModeTypes } from '../constants/layout';
import { Col } from 'reactstrap';
import { getAddressesSuggestions } from '../../slices/addresses/thunk';
import DropdownAddresses from './DropdownAddresses/DropdownAddresses';
import {
  getUserSavedAddresses,
  setUserSavedAddresses,
} from '../../helpers/cookies_helper';
import CustomOptions from './components/CustomOptions';

const SearchBar = ({ onDropdownSelect, selectedOption }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const { address } = useParams();
  const { layoutModeType } = useSelector((state) => ({
    layoutModeType: state.Layout.layoutModeType,
  }));
  const { fetchData } = useSelector((state) => state);

  // #region STATES
  const [isUnsupported, setIsUnsupported] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [options, setOptions] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [optionDropdown, setOptionDropdown] = useState([]);
  const [savedOptions, setSavedOptions] = useState(getUserSavedAddresses());

  // #region USEEFFECTS / API CALLS
  useEffect(() => {
    if (
      fetchData &&
      (fetchData.transactions.unsupported || fetchData.performance.unsupported)
    ) {
      setIsUnsupported(true);
    } else {
      setIsUnsupported(false);
    }
  }, [fetchData]);

  useEffect(() => {
    if (selectedOption) {
      setSearchInput(selectedOption.label);
      setOptions((currentOptions) => [
        selectedOption,
        ...currentOptions.filter((o) => o.value !== selectedOption.value),
        ...savedOptions.filter(
          (o) => !currentOptions.some((opt) => opt.value === o.value),
        ),
      ]);
    } else {
      setOptions(savedOptions);
    }
  }, [selectedOption, savedOptions]);

  useEffect(() => {
    setOptions((currentOptions) => [
      ...savedOptions,
      ...currentOptions.filter(
        (o) => !savedOptions.some((opt) => opt.value === o.value),
      ),
    ]);
  }, [savedOptions]);

  useEffect(() => {
    setOptions(savedOptions);
  }, [isMenuOpen, savedOptions]);

  const debounce = (func, delay) => {
    let timerId;
    return (...args) => {
      clearTimeout(timerId);
      timerId = setTimeout(() => func(...args), delay);
    };
  };

  const fetchSuggestions = async () => {
    setLoading(true);
    try {
      if (
        (searchInput.length >= 3 && !searchInput.startsWith('0x')) ||
        (searchInput.startsWith('0x') && searchInput.length >= 5)
      ) {
        const response = await dispatch(
          getAddressesSuggestions({
            blockchain: 'eth-mainnet',
            query: searchInput,
          }),
        );

        const suggestions = response.payload;

        if (Array.isArray(suggestions)) {
          const validSuggestions = suggestions.filter(
            (s) => s.name && s.address,
          );
          setOptions(
            validSuggestions.map((addr) => ({
              label: addr.name,
              value: addr.address,
              address: addr.address,
              logo: addr.logo || null,
              coingeckoId: addr.coingeckoId || null,
            })),
          );
        } else {
          console.error('No suggestions found');
          setOptions([]);
        }
      }
    } catch (error) {
      console.error('Failed to fetch suggestions:', error);
      setOptions([]);
    } finally {
      setLoading(false);
    }
  };

  const debouncedFetchSuggestions = useCallback(
    debounce(fetchSuggestions, 300),
    [searchInput],
  );

  useEffect(() => {
    debouncedFetchSuggestions();
  }, [searchInput, debouncedFetchSuggestions]);

  useEffect(() => {
    if (searchInput.length < 3) {
      setOptions([]);
    }
  }, [searchInput]);

  useEffect(() => {
    if (!isUnsupported) {
      handleSaveInCookies();
    }

    // if (address) {
    //   setSearchInput(address);
    // }
  }, [isUnsupported, address, location]);

  useEffect(() => {
    console.log('Is menu open changed:', isMenuOpen);
  }, [isMenuOpen]);

  const handleMenuClose = () => {
    // Clean up options al
  };

  useEffect(() => {
    console.log('Search input changed:', searchInput);
  }, [searchInput]);

  // #region HANDLERS
  const handleSaveInCookies = () => {
    const validInput = searchInput.trim().length > 0;
    if (validInput) {
      const storedOptions = getUserSavedAddresses();
      const newOption = {
        label: searchInput,
        value: searchInput,
        logo:
          options.find((option) => option.value === searchInput)?.logo || null,
        coingeckoId:
          options.find((option) => option.value === searchInput)?.coingeckoId ||
          null,
      };

      const isAddressAlreadySaved = storedOptions.some(
        (o) => o.value === newOption.value,
      );

      if (!isAddressAlreadySaved) {
        storedOptions.unshift(newOption);

        if (storedOptions.length > 10) {
          storedOptions.pop();
        }

        setUserSavedAddresses(storedOptions);
      }
    }
  };

  const handleInputChange = (inputValue, actionMeta) => {
    if (actionMeta.action === 'input-change') {
      setSearchInput(inputValue);
    }
  };

  const handleChange = (selectedOption) => {
    if (selectedOption && selectedOption.value) {
      if (!selectedOption.value.trim()) {
        console.error('Empty address selected, not navigating or saving.');
        return;
      }
      if (selectedOption.coingeckoId) {
        navigate(`/tokens/${selectedOption.coingeckoId}`);
      } else {
        navigate(`/address/${selectedOption.value}`);
      }
      setSearchInput('');
    }
  };

  const handleSearchIconClick = () => {
    if (searchInput) {
      if (selectedOption.coingeckoId) {
        navigate(`/tokens/${selectedOption.coingeckoId}`);
      } else {
        navigate(`/address/${searchInput}`);
      }
    }
  };

  const handleDropdownSelect = useCallback(
    (option) => {
      setSearchInput(option.label);
      setOptions([option]);
      navigate(`/address/${option.value}`);
    },
    [navigate],
  );

  // #region STYLES
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
      alignItems: 'left',
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
    loadingIndicator: (provided) => ({
      ...provided,
      color: layoutModeType === layoutModeTypes['DARKMODE'] ? '#fff' : 'black',
    }),
  };

  const DropdownIndicator = (props) => (
    <components.DropdownIndicator {...props}>
      <div onClick={handleSearchIconClick}>
        <i
          className={`ri-search-line align-middle text-${layoutModeType === layoutModeTypes['DARKMODE'] ? 'white' : 'dark'} ${searchInput ? 'cursor-pointer' : ''}`}
        ></i>
      </div>
    </components.DropdownIndicator>
  );

  // #region RENDER
  return (
    <Col className="d-flex col-12 w-100 align-items-center">
      <Select
        name="address"
        placeholder="Assets, wallet, domain, or identity"
        className="col-12 w-100"
        classNamePrefix="select-custom-menu"
        value={null}
        inputValue={searchInput}
        options={options}
        onChange={handleChange}
        onMenuClose={() => setIsMenuOpen(false)}
        onMenuOpen={() => setIsMenuOpen(true)}
        isLoading={loading}
        onInputChange={handleInputChange}
        components={{ DropdownIndicator, Option: CustomOptions }}
        styles={customStyles}
        menuIsOpen={isMenuOpen}
        noOptionsMessage={
          searchInput.length < 3
            ? () => 'Type at least 3 characters to search'
            : () => 'We were unable to find any results for your search'
        }
        onKeyDown={(e) => {
          if (e.key === 'Enter' && searchInput.length >= 3) {
            setSearchInput('');
            // Close dropdown
            setIsMenuOpen(false);
            navigate(`/address/${searchInput}`);
            handleSaveInCookies();
          }
        }}
      />
      {/* <DropdownAddresses
        optionDropdown={optionDropdown}
        isUnsupported={isUnsupported}
        onSelect={handleDropdownSelect}
      /> */}
    </Col>
  );
};

export default SearchBar;
