import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Col, Container, Input, InputGroup, Row } from 'reactstrap';

const DashboardHome = () => {
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState('');

  const handleSearchClick = () => {
    // handlerClearAllData();
    // setAddressForSearch(searchInput);
    // setAddressTitle(searchInput);
    navigate(`/address/${searchInput}/tokens`);
  };

  return (
    <React.Fragment>
      <Col className="col-12 mt-5" style={{ height: '100vh', width: '100%' }}>
        <div className="d-flex  justify-content-center align-items-center">
          <h1>Search for your wallet address to get started</h1>
        </div>
        <Row className="d-flex justify-content-center mt-5  align-items-center ">
          <Col lg={8} className="pb-3  d-flex justify-content-center ">
            <InputGroup className="mb-3">
              <Input
                className="form-control py-2 rounded"
                placeholder="Assets, wallet, domain, or identify"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
              <Button
                disabled={!searchInput}
                color="primary"
                onClick={handleSearchClick}
              >
                Search
              </Button>
            </InputGroup>
          </Col>
        </Row>
      </Col>
    </React.Fragment>
  );
};

export default DashboardHome;
