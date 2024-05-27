import React from 'react';
import eth from '../../assets/images/svg/crypto-icons/eth.svg';
import pol from '../../assets/images/svg/crypto-icons/polygon.webp';
import bnb from '../../assets/images/svg/crypto-icons/binanceLogo.png';
import {
  selectNetworkType,
  setNetworkType,
} from '../../slices/networkType/reducer';
import {
  Col,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  UncontrolledDropdown,
} from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';
import { capitalizeFirstLetter } from '../../utils/utils';

const NetworkDropdown = () => {
  const dispatch = useDispatch();
  const networkType = useSelector(selectNetworkType);

  const networks = [
    {
      key: 'all',
      label: 'All Networks',
      icon: (
        <i
          style={{
            fontSize: '20px',
            paddingRight: '8px',
            marginLeft: '-4px',
          }}
          className="ri-function-line "
        ></i>
      ),
    },
    {
      key: 'ethereum',
      label: 'Ethereum',
      icon: eth,
      iconAlt: 'eth',
      width: 20,
      height: 20,
    },
    {
      key: 'polygon',
      label: 'Polygon',
      icon: pol,
      iconAlt: 'polygon',
      width: 20,
      height: 20,
    },
    {
      key: 'bsc-mainnet',
      label: 'BNB Chain',
      icon: bnb,
      iconAlt: 'bnb',
      width: 20,
      height: 20,
    },
  ];

  const handleChangeNetwork = (newType) => {
    dispatch(setNetworkType(newType));
  };

  const renderNetworkIcon = (network) => {
    if (network.key === 'all') {
      return network.icon;
    }
    return (
      <img
        src={network.icon}
        alt={network.iconAlt}
        width={network.width}
        height={network.height}
        className="ms-n1 me-2"
      />
    );
  };

  return (
    <Col xxl={6} className="d-flex justify-content-end align-items-center">
      <div className="d-flex justify-content-end align-items-center">
        <UncontrolledDropdown className="card-header-dropdown ">
          <DropdownToggle
            tag="a"
            className="btn btn-sm p-1 btn-soft-primary  border rounded d-flex align-items-center"
            role="button"
          >
            <span className="ms-2 d-flex align-items-center">
              {renderNetworkIcon(networks.find((n) => n.key === networkType))}
              <span className="fs-6">
                {networkType === 'all'
                  ? 'All Networks'
                  : capitalizeFirstLetter(networkType)}
              </span>
            </span>
            <i className="mdi mdi-chevron-down  ms-2 fs-5"></i>
          </DropdownToggle>
          <DropdownMenu className="dropdown-menu-end mt-2 ">
            {networks.map((network) => (
              <DropdownItem
                key={network.key}
                className="d-flex align-items-center py-2 "
                onClick={() => handleChangeNetwork(network.key)}
              >
                {renderNetworkIcon(network)}
                <div className="d-flex flex-column">
                  <span className="fw-normal">{network.label}</span>
                </div>
              </DropdownItem>
            ))}
          </DropdownMenu>
        </UncontrolledDropdown>
      </div>
    </Col>
  );
};

export default NetworkDropdown;
