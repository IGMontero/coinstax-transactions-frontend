import { useState } from 'react';
import SearchBar from './SearchBar';

const ParentComponentSearchBar = () => {
  const [selectedOption, setSelectedOption] = useState(null);

  const handleDropdownSelect = (option) => {
    setSelectedOption(option);
  };

  return (
    <SearchBar
      onDropdownSelect={handleDropdownSelect}
      selectedOption={selectedOption}
    />
  );
};

export default ParentComponentSearchBar;
