import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Select, { components } from 'react-select';
import { Col } from 'reactstrap';
import { getAddressesSuggestions } from '../../slices/addresses/thunk';
import { layoutModeTypes } from '../constants/layout';
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

  const addresses = useSelector((state) => state.addressName.addresses);

  // #region STATES
  const [isUnsupported, setIsUnsupported] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [options, setOptions] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // #region USEEFFECTS / API CALLS
  useEffect(() => {
    if (
      fetchData &&
      (fetchData.transactions?.unsupported ||
        fetchData.performance?.unsupported)
    ) {
      setIsUnsupported(true);
    } else {
      setIsUnsupported(false);
    }
  }, [fetchData, isUnsupported]);

  useEffect(() => {
    if (selectedOption) {
      setSearchInput(selectedOption.label);
      setOptions((currentOptions) => [
        selectedOption,
        ...currentOptions.filter((o) => o.value !== selectedOption.value),
        ...addresses.filter(
          (o) => !currentOptions.some((opt) => opt.value === o.value),
        ),
      ]);
    } else {
      setOptions(addresses);
    }
  }, [selectedOption, addresses]);

  useEffect(() => {
    if (!isUnsupported) {
      setOptions((currentOptions) => [
        ...addresses,
        ...currentOptions.filter(
          (o) => !addresses.some((opt) => opt.value === o.value),
        ),
      ]);
    }
  }, [addresses, isUnsupported]);

  useEffect(() => {
    if (!isUnsupported) {
      setOptions(addresses);
    }
  }, [isMenuOpen, addresses, isUnsupported]);

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
      const suggestions = [];
      if (addresses.length > 0) {
        // Filter addresses that match the search input (case-insensitive)
        suggestions.push(
          ...addresses.filter(
            (addr) =>
              addr.value?.toLowerCase().includes(searchInput.toLowerCase()) ||
              addr.label?.toLowerCase().includes(searchInput.toLowerCase()),
          ),
        );
      }

      if (
        (searchInput.length >= 3 && !searchInput.startsWith('0x')) ||
        (searchInput.startsWith('0x') && searchInput.length >= 5)
      ) {
        // Fetch suggestions from the API if the search input meets the length criteria
        const response = await dispatch(
          getAddressesSuggestions({
            blockchain: 'eth-mainnet',
            query: searchInput,
          }),
        );

        const apiSuggestions = response.payload;

        if (Array.isArray(apiSuggestions)) {
          // Filter valid API suggestions (with name and address)
          const validApiSuggestions = apiSuggestions.filter(
            (s) => s.name && s.address,
          );
          // Map valid API suggestions to the desired format and add them to the suggestions array
          suggestions.push(
            ...validApiSuggestions.map((addr) => ({
              label: addr.name,
              value: addr.address,
              address: addr.address,
              logo: addr.logo || null,
              coingeckoId: addr.coingeckoId || null,
            })),
          );
        } else {
          console.error('No suggestions found');
        }
      }

      // If the search input is a valid Ethereum address and not already in the suggestions or addresses,
      // add it to the suggestions array
      if (
        searchInput.startsWith('0x') &&
        searchInput.length >= 5 &&
        !suggestions.some((s) => s?.value === searchInput) &&
        !addresses.some((a) => a?.value === searchInput)
      ) {
        suggestions.push({
          label: null,
          value: searchInput,
          address: searchInput,
          // logo: null,
          // coingeckoId: null,
        });
      }

      // Update the options state with the fetched suggestions
      setOptions(suggestions);
    } catch (error) {
      console.log('Failed to fetch suggestions:', error);
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
        layoutModeType === layoutModeTypes['DARKMODE'] ? ' #1d1d21' : '#fff',
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
        layoutModeType === layoutModeTypes['DARKMODE'] ? '#1d1d21' : '#fff',
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
          ? '#1d1d21'
          : '#e2e2e2'
        : state.isSelected
          ? layoutModeType === layoutModeTypes['DARKMODE']
            ? '#212529'
            : '#ddd'
          : 'transparent',
      color:
        state.isFocused || state.isSelected
          ? 'muted'
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
        color:
          layoutModeType === layoutModeTypes['DARKMODE']
            ? '#4B8EE0'
            : '#0759BC',
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
        value={selectedOption}
        inputValue={searchInput}
        options={options}
        onChange={handleChange}
        onMenuClose={() => setIsMenuOpen(false)}
        onMenuOpen={() => setIsMenuOpen(true)}
        isLoading={loading}
        filterOption={() => true}
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
            // handleSaveInCookiesAndGlobalState();
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
