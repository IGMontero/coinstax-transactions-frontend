import React, { useState } from 'react';
import SearchBar from './SearchBar';

const ParentComponentSearchBar = ({
  trackWallets,
  searchInput,
  setSearchInput,
}) => {
  const [selectedOption, setSelectedOption] = useState(null);

  const handleDropdownSelect = (option) => {
    setSelectedOption(option);
  };

  // const handleSearch

  return (
    <SearchBar
      trackWallets={trackWallets}
      selectedOption={selectedOption}
      searchInput={searchInput}
      setSearchInput={setSearchInput}
    />
  );
};

export default ParentComponentSearchBar;
