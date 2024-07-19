import React from 'react';
import { Col, Input } from 'reactstrap';

const SearchBarWallets = ({ onSearch }) => {
  const handleSearch = (event) => {
    onSearch(event.target.value);
  };

  return (
    <Input
      type="text"
      placeholder="Search by name or address"
      onChange={handleSearch}
    />
  );
};

export default SearchBarWallets;
