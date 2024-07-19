import React from 'react';
import { Col, Input } from 'reactstrap';

const SearchBarWallets = ({ onSearch }) => {
  const handleSearch = (event) => {
    onSearch(event.target.value);
  };

  return (
    <Input type="text" placeholder="Search addresses" onChange={handleSearch} />
  );
};

export default SearchBarWallets;
