import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Col, Container, Input, InputGroup, Row } from 'reactstrap';
import Index from './OnePage/index';
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
      {/* <Col className="col-12 mt-5 ">
        <div className="d-flex  justify-content-center align-items-center">
          <h1>Welcome to Coinstax</h1>
        </div>
        <div className="d-flex  justify-content-center align-items-center">
          <h2>Search for your wallet address to get started</h2>
        </div>
        <Row className="d-flex justify-content-center mt-3  align-items-center ">
          <Col lg={8} className="pb-3  d-flex justify-content-center ">
            <InputGroup className="mb-3">
              <Input
                className="form-control py-2 rounded"
                placeholder="Assets, wallet, domain, or identify"
                value={searchInput}
                onChange={(e) => {
                  const filteredInput = e.target.value.replace(
                    /[^a-zA-Z0-9]/g,
                    '',
                  );
                  setSearchInput(filteredInput);
                }}
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
      </Col> */}
      <Index />
    </React.Fragment>
  );
};

export default DashboardHome;
