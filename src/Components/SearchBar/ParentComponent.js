import React, { useState } from 'react';
import SearchBar from './SearchBar';

const ParentComponentSearchBar = ({
  isConnectWalletsPage,
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
      isConnectWalletsPage={isConnectWalletsPage}
      selectedOption={selectedOption}
      searchInput={searchInput}
      setSearchInput={setSearchInput}
    />
  );
};

export default ParentComponentSearchBar;
