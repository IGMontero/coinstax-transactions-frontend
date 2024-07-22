import React from 'react';
import { Container, Button } from 'reactstrap';
import Helmet from '../../Components/Helmet/Helmet';
import AddressTable from './components/tables/AddressTable';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const DashboardAccUsersWallets = () => {
  const addresses = useSelector((state) => state.addressName.addresses);
  const navigate = useNavigate();
  const handeGoToDashboard = () => {
    navigate('/clients');
  };

  return (
    <React.Fragment>
      <Helmet title="Wallets" />
      <div className="page-content">
        <Container>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h1>Client Addresses</h1>
            <div className="d-flex">
              <Button
                className="d-flex btn-hover-light justify-content-center align-items-center"
                color="soft-light"
                style={{
                  borderRadius: '10px',
                  border: '.5px solid grey',
                }}
              >
                <i className="ri-add-line me-2"></i>
                Add Wallet
              </Button>
              <Button
                onClick={handeGoToDashboard}
                className=" d-flex btn-hover-light justify-content-center align-items-center ms-3"
                color="soft-light"
                style={{
                  borderRadius: '10px',
                  border: '.5px solid grey',
                }}
              >
                <i className="ri-arrow-left-s-line me-2"></i>
                Back To Clients
              </Button>
            </div>
          </div>
          <AddressTable addresses={addresses} user={false} />
        </Container>
      </div>
    </React.Fragment>
  );
};

export default DashboardAccUsersWallets;
