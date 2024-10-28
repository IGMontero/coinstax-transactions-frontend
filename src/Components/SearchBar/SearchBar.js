import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Select, { components } from 'react-select';
import { Button, Col, Spinner } from 'reactstrap';
import { getAddressesSuggestions } from '../../slices/addresses/thunk';
import { layoutModeTypes } from '../constants/layout';
import CustomOptions from './components/CustomOptions';
import { setAddressName } from '../../slices/addressName/reducer';
import { trackGAEvent } from '../../helpers/GAHelper';
import { useRefreshUserPortfolio } from '../../hooks/useUserPortfolio';
import { addUserWallet } from '../../slices/userWallets/thunk';
import Swal from 'sweetalert2';

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

  // #region STATES
  const [isUnsupported, setIsUnsupported] = useState(false);
  const [loading, setLoading] = useState(false);
  // const [searchInput, setSearchInput] = useState('');
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
    debounce(fetchSuggestions, 600),
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
      const response = await dispatch(
        addUserWallet({ address, userId }),
      ).unwrap();

      if (response && !response.error) {
        navigate(`/address/${address}`);
        dispatch(setAddressName({ value: address, label: null }));
        refreshUserPortfolio();
      } else {
        Swal.fire({
          title: 'Error',
          text: response.message || 'Failed to connect wallet',
          icon: 'error',
        });
      }
      setLoading(false);
    } catch (error) {
      console.error('Failed to connect wallet: ', error);
      Swal.fire({
        title: 'Error',
        text: error || 'Failed to connect wallet',
        icon: 'error',
      });
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
        handleAddWallet(searchInput);
      }
    }
  };

  // const handleDropdownSelect = useCallback(
  //   (option) => {
  //     setSearchInput(option.label);
  //     setOptions([option]);
  //     navigate(`/address/${option.value}`);
  //   },
  //   [navigate],
  // );

  // #region STYLES
  const customStyles = {
    control: (provided) => ({
      ...provided,
      backgroundColor:
        layoutModeType === layoutModeTypes['DARKMODE'] ? ' #1d1d21' : '#fff',
      color: layoutModeType === layoutModeTypes['DARKMODE'] ? '#fff' : 'black',
      cursor: 'text',
      maxHeight: '58px',
      textAlign: 'left',
      // border:
      //   layoutModeType === layoutModeTypes['DARKMODE']
      //     ? '1px solid #32383e'
      //     : '1px solid #ddd',
      border: '1px solid #6b6464',
      borderRadius: '16px',
      // padding: '18px 146px 18px 20px',
      fontSize: '16px',
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
      borderRadius: '16px',
      border: '1px solid #6b6464',
      transition: '1s all ease-in-out',
      transform: 'translateY(0px)',
    }),
    option: (provided, state) => ({
      ...provided,
      cursor: 'pointer',
      borderRadius: '16px',

      backgroundColor: state.isFocused
        ? layoutModeType === layoutModeTypes['DARKMODE']
          ? 'transparent'
          : // '#1d1d21'
            'transparent'
        : // '#e2e2e2'
          state.isSelected
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
            : // '#2a2f34'
              'transparent'
          : // '#e2e2e2'
            state.isSelected
            ? layoutModeType === layoutModeTypes['DARKMODE']
              ? '#212529'
              : '#ddd'
            : 'transparent',
      },
      '&:hover': {
        // backgroundColor:
        //   layoutModeType === layoutModeTypes['DARKMODE']
        //     ? '#1f252b'
        //     : '#e2e2e2',
        backgroundColor: 'transparent',
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
            : () => 'We were unable to find any results for your search'
        }
        onKeyDown={(e) =>
          handleSearch(e, {
            pressEnter: true,
            pressIcon: false,
            pressButtonAdd: false,
          })
        }
        // onClick={(e) =>
        //   handleSearch(e, {
        //     pressEnter: true,
        //     pressIcon: false,
        //     pressButtonAdd: false,
        //   })
        // }
      />
      {trackWallets && user && (
        <Button
          className={`d-flex btn-hover-light ms-2 p-2  text-dark justify-content-center align-items-center`}
          color="soft-light"
          disabled={
            userPortfolioSummary.addresses.some(
              (addr) => addr.address === searchInput,
            ) ||
            loading ||
            !searchInput
          }
          style={{
            borderRadius: '10px',
            border: '.5px solid grey',
            cursor: `${!loading ? 'pointer' : 'not-allowed'}`,
          }}
          onClick={(e) =>
            handleSearch(e, {
              pressEnter: false,
              pressIcon: false,
              pressButtonAdd: true,
            })
          }
        >
          <i className="bx bx-plus me-2"></i>
          {loading ? (
            <div>
              <Spinner size="sm" color="light" />
            </div>
          ) : (
            <>Add</>
          )}
        </Button>
      )}
      {/* <DropdownAddresses
        optionDropdown={optionDropdown}
        isUnsupported={isUnsupported}
        onSelect={handleDropdownSelect}
      /> */}
    </div>
  );
};

export default SearchBar;
