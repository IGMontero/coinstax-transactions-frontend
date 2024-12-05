import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Select, { components } from 'react-select';
import { trackGAEvent } from '../../helpers/GAHelper';
import { useRefreshUserPortfolio } from '../../hooks/useUserPortfolio';
import { getAddressesSuggestions } from '../../slices/addresses/thunk';
import { setAddressName } from '../../slices/addressName/reducer';
import { addUserWallet } from '../../slices/userWallets/thunk';
import { layoutModeTypes } from '../constants/layout';
import CustomOptions from './components/CustomOptions';

const SearchBar = ({
  selectedOption,
  searchInput,
  setSearchInput,
  trackWallets,
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const userId = user?.id;
  const refreshUserPortfolio = useRefreshUserPortfolio();
  const { userPortfolioSummary } = useSelector((state) => state.userWallets);
  const { layoutModeType } = useSelector((state) => ({
    layoutModeType: state.Layout.layoutModeType,
  }));
  const { fetchData } = useSelector((state) => state);

  const addresses = useSelector((state) => state.addressName.addresses);
  const inputRef = React.createRef();

  // #region STATES
  const [isUnsupported, setIsUnsupported] = useState(false);
  const [loading, setLoading] = useState(false);
  // const [searchInput, setSearchInput] = useState('');
  const [options, setOptions] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const filteredAddressesBySearchInput = addresses.filter(
    (addr) =>
      addr.value?.toLowerCase().includes(searchInput.toLowerCase()) ||
      addr.label?.toLowerCase().includes(searchInput.toLowerCase()),
  );

  const getFilteredAddresses = (text) => {
    return addresses.filter(
      (addr) =>
        addr.value?.toLowerCase().includes(text.toLowerCase()) ||
        addr.label?.toLowerCase().includes(text.toLowerCase()),
    );
  };

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
        ...currentOptions.filter(
          (o) => o.value.toLowerCase() !== selectedOption.value.toLowerCase(),
        ),
        ...addresses.filter(
          (o) =>
            !currentOptions.some(
              (opt) => opt.value.toLowerCase() === o.value.toLowerCase(),
            ),
        ),
      ]);
    } else {
      setOptions(
        addresses.map((addr) => ({
          ...addr,
          value: addr.value.toLowerCase(),
        })),
      );
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

  const fetchSuggestions = async (searchInput) => {
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

  // const debouncedFetchSuggestions = useCallback(
  //   debounce(fetchSuggestions, 600),
  //   [searchInput],
  // );

  // useEffect(() => {
  //   debouncedFetchSuggestions();
  // }, [searchInput, debouncedFetchSuggestions]);

  // useEffect(() => {
  //   if (searchInput.length < 3) {
  //     setOptions([]);
  //   }
  // }, [searchInput]);
  const debouncedFetchSuggestions = useCallback(
    debounce((input) => fetchSuggestions(input), 600),
    [], // Only recreate if `fetchSuggestions` itself changes
  );

  useEffect(() => {
    if (searchInput.length >= 3) {
      debouncedFetchSuggestions(searchInput);
    } else {
      const addresses = getFilteredAddresses(searchInput);
      setOptions(addresses || []);
    }
  }, [searchInput, debouncedFetchSuggestions]);

  const handleInputChange = (inputValue, actionMeta) => {
    if (actionMeta.action === 'input-change') {
      setSearchInput(inputValue);
    }
  };

  useEffect(() => {
    if (inputRef.current) {
      const input = inputRef.current.inputRef;
      input.addEventListener('keydown', handleKeyDown);
      return () => input.removeEventListener('keydown', handleKeyDown);
    }
  }, [inputRef]);

  const handleTrackAddressSearchAnalytics = (address) => {
    // Track address search analytics
    console.log('Tracking address search analytics for:', address);

    const category = 'address_search';
    const action = 'address_search';
    const label = address;

    trackGAEvent({
      category,
      action,
      label,
    });
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
        // if address is not in the list of addresses, add it

        const isAddressInList = userPortfolioSummary?.addresses?.some(
          (addr) => addr.value === selectedOption.value,
        );

        if (
          !isAddressInList &&
          trackWallets &&
          user
        ) {
          console.log("f3")
          handleAddWallet(selectedOption.value);
        }
        dispatch(
          setAddressName({
            value: selectedOption.value,
            label: selectedOption.label || null,
          }),
        );
      }

      handleTrackAddressSearchAnalytics(selectedOption.value);

      setSearchInput('');
    }
  };

  const handleAddWallet = async (address) => {
    setLoading(true);
    try {
      console.log('Adding wallet:', address);
      const response = await dispatch(
        addUserWallet({ address, userId }),
      ).unwrap();

      if (response && !response.error) {
        navigate(`/address/${address}`);
        dispatch(setAddressName({ value: address, label: null }));
        refreshUserPortfolio();
      } else {
        // Swal.fire({
        //   title: 'Error',
        //   text: response.message || 'Failed to connect wallet',
        //   icon: 'error',
        // });
      }
      setLoading(false);
    } catch (error) {
      console.error('Failed to connect wallet: ', error);
      // Swal.fire({
      //   title: 'Error',
      //   text: error || 'Failed to connect wallet',
      //   icon: 'error',
      // });
      setLoading(false);
    }
  };

  const handleSearch = (
    e,
    { pressEnter = false, pressIcon = false, pressButtonAdd = false } = {},
  ) => {
    if (pressEnter) {
      if (
        trackWallets &&
        user &&
        e.key === 'Enter' &&
        searchInput.length >= 3
      ) {
        console.log("f1")
        handleAddWallet(searchInput);
      } else {
        if (e.key === 'Enter' && searchInput.length >= 3) {
          setSearchInput('');
          // Close dropdown
          setIsMenuOpen(false);
          navigate(`/address/${searchInput}`);
          handleTrackAddressSearchAnalytics(searchInput);
        }
      }
    }
    if (pressIcon) {
      if (searchInput) {
        if (selectedOption.coingeckoId) {
          navigate(`/tokens/${selectedOption.coingeckoId}`);
        } else {
          navigate(`/address/${searchInput}`);
        }
      }
    }
    if (pressButtonAdd) {
      if (!user) {
        navigate(`/address/${searchInput}`);
      } else {
        console.log("f2")
        handleAddWallet(searchInput);
      }
    }
  };


  const searchBarStyles = {
    control: (provided) => ({
      ...provided,
      backgroundColor:
        layoutModeType === layoutModeTypes['DARKMODE'] ? ' #1d1d21' : '#fff',
      color: layoutModeType === layoutModeTypes['DARKMODE'] ? '#fff' : 'black',
      cursor: 'text',
      textAlign: 'left',
      border:
        layoutModeType === layoutModeTypes['DARKMODE']
          ? '1px solid #2a2f34'
          : '1px solid #ced4da',
      outline: 'none !important',
      boxShadow: 'none !important',
      '&:hover': {
        border:
          layoutModeType === layoutModeTypes['DARKMODE']
            ? '1px solid #2a2f34'
            : '1px solid #ced4da',
      },
    }),
    input: (provided) => ({
      ...provided,
      fontWeight: '400',
      color: layoutModeType === layoutModeTypes['DARKMODE'] ? '#fff' : 'black',
    }),
    menu: (provided) => ({
      ...provided,
      marginTop: '0px',
      zIndex: 9999,
      backgroundColor:
        layoutModeType === layoutModeTypes['DARKMODE'] ? '#1d1d21' : '#fff',
      color: layoutModeType === layoutModeTypes['DARKMODE'] ? '#fff' : 'black',
    }),
    option: (provided, state) => ({
      ...provided,
      cursor: 'pointer',
      borderRadius: '16px',

      backgroundColor: state.isFocused
        ? layoutModeType === layoutModeTypes['DARKMODE']
          ? 'transparent'
          : 'transparent'
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
            ? 'transparent'
            : 'transparent'
          : state.isSelected
            ? layoutModeType === layoutModeTypes['DARKMODE']
              ? '#212529'
              : '#ddd'
            : 'transparent',
      },
      '&:hover': {
        backgroundColor: 'transparent',
        color:
          layoutModeType === layoutModeTypes['DARKMODE']
            ? '#4B8EE0'
            : '#0759BC',
      },
    }),
  };

  const handleKeyDown = (e) => {
    if (e.shiftKey && e.key === 'ArrowUp') {
      // Access the input element and select all text
      const input = e.target;
      input.select();
      e.preventDefault();
    } else if (e.key === 'ArrowDown') {
      // Access the input element and move the cursor to the end of the text
      const input = e.target;
      input.selectionStart = input.selectionEnd = input.value.length;

      e.preventDefault();
    }
  };

  const DropdownIndicator = (props) => (
    <components.DropdownIndicator {...props}>
      <div
        onClick={(e) =>
          handleSearch(e, {
            pressEnter: false,
            pressIcon: true,
            pressButtonAdd: false,
          })
        }
      >
        <i
          className={`ri-search-line  align-middle text-${layoutModeType === layoutModeTypes['DARKMODE'] ? 'white' : 'white'} 
          ${searchInput ? 'cursor-pointer' : ''}`}
        ></i>
      </div>
    </components.DropdownIndicator>
  );

  // #region RENDER
  return (
    <div className="d-flex w-100 align-items-center cursor-text">
      <Select
        name="address"
        placeholder="Assets, wallet, domain, or identity"
        className="w-100 cursor-text"
        classNamePrefix=" cursor-text"
        // classNamePrefix="select-custom-menu"
        ref={inputRef}
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
        styles={searchBarStyles}
        menuIsOpen={isMenuOpen}
        noOptionsMessage={
          searchInput.length < 3
            ? () => 'Type at least 3 characters to search'
            : () => null
        }
        onKeyDown={(e) =>
          handleSearch(e, {
            pressEnter: true,
            pressIcon: false,
            pressButtonAdd: false,
          })
        }

      // onKeyDownCapture={handleKeyDown} // Detect Shift + Up here
      />
    </div>
  );
};

export default SearchBar;
