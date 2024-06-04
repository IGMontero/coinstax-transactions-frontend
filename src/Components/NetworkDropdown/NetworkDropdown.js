import React, { useCallback, useEffect } from 'react';
import eth from '../../assets/images/svg/crypto-icons/eth.svg';
import pol from '../../assets/images/svg/crypto-icons/polygon.webp';
import bnb from '../../assets/images/svg/crypto-icons/binanceLogo.png';
import btcMainnet from '../../assets/images/svg/crypto-icons/btc-mainnet.svg';
import optimism from '../../assets/images/svg/crypto-icons/optimism-seeklogo.png';
import baseMainnet from '../../assets/images/svg/crypto-icons/base-mainnet.png';
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
import { getAddressesInfo } from '../../slices/addresses/thunk';
import { useParams } from 'react-router-dom';

const NetworkDropdown = () => {
  const dispatch = useDispatch();
  const networkType = useSelector(selectNetworkType);
  const { address } = useParams();

  const [filteredNetworks, setFilteredNetworks] = React.useState();

  const networks = [
    {
      key: 'all',
      label: 'All Networks',
      icon: (
        <i
          style={{
            fontSize: '16px',
            paddingRight: '8px',
            marginLeft: '-4px',
          }}
          className="ri-function-line "
        ></i>
      ),
      withDivider: true,
    },
    {
      key: 'ethereum',
      label: 'Ethereum',
      blockchain: 'ethereum',
      icon: eth,
      iconAlt: 'eth',
      width: 20,
      height: 20,
    },
    {
      key: 'polygon',
      label: 'Polygon',
      blockchain: 'polygon',
      icon: pol,
      iconAlt: 'polygon',
      width: 20,
      height: 20,
    },
    {
      key: 'bsc-mainnet',
      blockchain: 'bnb',
      label: 'BNB Chain',
      icon: bnb,
      iconAlt: 'bnb',
      width: 20,
      height: 20,
    },
    {
      key: 'optimism',
      label: 'Optimism',
      blockchain: 'optimism',
      icon: optimism,
      iconAlt: 'optimism',
      width: 19,
      height: 19,
    },
    {
      key: 'base-mainnet',
      label: 'Base',
      icon: baseMainnet,
      blockchain: 'base',
      iconAlt: 'base-mainnet',
      width: 20,
      height: 20,
    },
  ];

  const fetchAddressInfo = async () => {
    try {
      const response = await dispatch(getAddressesInfo({ address }));
      const res = response.payload;
      const availableNetworks = Object.keys(res.blockchains);
      const filtered = networks.filter(
        (network) =>
          network.key !== 'all' &&
          availableNetworks.includes(network.blockchain),
      );
      const newNetworkType =
        filtered.find((n) => n.key === networkType)?.key || 'all';
      setFilteredNetworks([...networks.slice(0, 1), ...filtered]);
      dispatch(setNetworkType(newNetworkType));
    } catch (error) {
      console.error('Error fetching address data:', error);
    }
  };

  useEffect(() => {
    if (address) {
      fetchAddressInfo();
    }
  }, [address, networkType]);

  const handleChangeNetwork = (newType) => {
    dispatch(setNetworkType(newType));
  };

  const renderNetworkIcon = (network) => {
    return (
      <>
        {network.key === 'all' ? (
          <>
            {network.icon}
            <DropdownItem divider />
          </>
        ) : (
          <img
            src={network.icon}
            alt={network.iconAlt}
            width={network.width}
            height={network.height}
            className="ms-n1 me-2"
          />
        )}
      </>
    );
  };

  const selectedNetwork = networks.find((n) => n.key === networkType);

  return (
    <Col xxl={6} className="d-flex justify-content-end align-items-center">
      <div className="d-flex justify-content-end align-items-center">
        <UncontrolledDropdown className="card-header-dropdown ">
          <DropdownToggle
            tag="a"
            className="btn btn-sm p-1 btn-soft-primary  border rounded d-flex align-items-center"
            role="button"
          >
            <span className="ms-2 d-flex align-items-center py-0">
              {renderNetworkIcon(selectedNetwork)}
              <span className="fs-6 py-0">{selectedNetwork.label}</span>
            </span>
            <i className="mdi mdi-chevron-down  ms-2 fs-5"></i>
          </DropdownToggle>
          <DropdownMenu className="dropdown-menu-end mt-2 ">
            {filteredNetworks?.map((network) => (
              <React.Fragment key={network.key}>
                <DropdownItem
                  className="d-flex align-items-center mt-0 py-2"
                  onClick={() => handleChangeNetwork(network.key)}
                >
                  {renderNetworkIcon(network)}
                  <div className="d-flex flex-column">
                    <span className="fw-normal">{network.label}</span>
                  </div>
                </DropdownItem>
                {network.withDivider ? (
                  <DropdownItem divider className="my-0 py-0" />
                ) : null}
              </React.Fragment>
            ))}
          </DropdownMenu>
        </UncontrolledDropdown>
      </div>
    </Col>
  );
};

export default NetworkDropdown;
