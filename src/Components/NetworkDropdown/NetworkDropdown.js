import React from 'react';
import eth from '../../assets/images/svg/crypto-icons/eth.svg';
import pol from '../../assets/images/svg/crypto-icons/polygon.webp';
import btc from '../../assets/images/svg/crypto-icons/btc.svg';
// import arb from '../../assets/images/svg/crypto-icons/ankr.svg';
// import gnosis from '../../assets/images/svg/crypto-icons/gno.svg';
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

  console.log('networkType', networkType);

  const networkIcons = {
    ethereum: eth,
    polygon: pol,
    all: (
      <i
        className="ri-drag-move-line text-warning me-2"
        style={{ fontSize: '18px' }}
      ></i>
    ),
    btc: btc,
  };

  const handleChangeNetwork = (newType) => {
    dispatch(setNetworkType(newType));
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
              {networkType === 'all' ? (
                networkIcons['all']
              ) : (
                <img
                  src={networkIcons[networkType]}
                  alt={networkType}
                  width={22}
                  height={22}
                  className="me-2"
                />
              )}
              <span className="fs-6">
                {networkType === 'all'
                  ? 'All Networks'
                  : capitalizeFirstLetter(networkType)}
              </span>
            </span>
            <i className="mdi mdi-chevron-down  ms-2 fs-5"></i>
          </DropdownToggle>
          <DropdownMenu className="dropdown-menu-end mt-2 ">
            <DropdownItem
              className="d-flex align-items-center my-0"
              onClick={() => handleChangeNetwork('all')}
            >
              <i
                style={{
                  fontSize: '24px',
                  paddingRight: '7px',
                  marginLeft: '-6px',
                }}
                className="ri-drag-move-line text-warning "
              ></i>
              <div className="d-flex flex-column">
                <span className="fw-semibold">All Networks</span>
                <div className="d-flex flex-row align-items-center">
                  {/* <small>$9k </small>{' '}
                      <i className="ri-checkbox-blank-circle-fill text-muted fs-10 mx-2"></i>
                      <small>$12.7k </small> */}
                </div>
              </div>
            </DropdownItem>
            <DropdownItem divider className="mt-0" />
            <DropdownItem
              className="d-flex align-items-center mb-2"
              onClick={() => handleChangeNetwork('ethereum')}
            >
              {' '}
              <img
                src={eth}
                alt="btc"
                className="ms-n1 me-2"
                width={20}
                height={20}
              />
              <div className="d-flex flex-column">
                <span className="fw-semibold">Ethereum</span>
                <div className="d-flex flex-row align-items-center">
                  {/* <small>$8.6k </small>{' '}
                  <i className="ri-checkbox-blank-circle-fill text-muted fs-10 mx-2"></i>
                      <small>$12.7k </small> */}
                </div>
              </div>
            </DropdownItem>
            <DropdownItem
              className="d-flex align-items-center mb-2"
              onClick={() => handleChangeNetwork('polygon')}
            >
              {' '}
              <img
                src={pol}
                alt="btc"
                className="ms-n1 me-2"
                width={20}
                height={20}
              />
              <div className="d-flex flex-column ">
                <span className="fw-semibold">Polygon</span>
                <div className="d-flex flex-row align-items-center">
                  {/* <small>$434.44k </small>
                  <i className="ri-checkbox-blank-circle-fill text-muted fs-10 mx-2"></i>
                      <small>$0.352901k </small> */}
                </div>
              </div>
            </DropdownItem>
            <DropdownItem
              disabled
              className="d-flex align-items-center"
              onClick={() => handleChangeNetwork('bsc-mainnet')}
            >
              {' '}
              <img
                src={btc}
                alt="btc"
                className="ms-n1 me-2"
                width={20}
                height={20}
              />
              <div className="d-flex flex-column">
                <span className="fw-semibold">BNB Chain</span>
                <div className="d-flex flex-row align-items-center">
                  {/* <small>$0.020028</small>
                  <i className="ri-checkbox-blank-circle-fill text-muted fs-10 mx-2"></i>
                  <small></small> */}
                </div>
              </div>
            </DropdownItem>
            {/*  <DropdownItem className="d-flex align-items-center">
                  {' '}
                  <img
                    src={arb}
                    alt="btc"
                    className="ms-n1 me-2"
                    width={30}
                    height={30}
                  />
                  <div className="d-flex flex-column">
                    <span className="fw-semibold">Arbitrum</span>
                    <div className="d-flex flex-row align-items-center">
                      <small>{'<'} $0.0001 </small>
                      <i className="ri-checkbox-blank-circle-fill text-muted fs-10 mx-2"></i>
                      <small>{'<'} $0.0001</small>
                    </div>
                  </div>
                </DropdownItem>
                <DropdownItem className="d-flex align-items-center">
                  {' '}
                  <img
                    src={gnosis}
                    alt="btc"
                    className="ms-n1 me-2"
                    width={30}
                    height={30}
                  />
                  <div className="d-flex flex-column">
                    <span className="fw-semibold">Gnosis Chain</span>
                    <div className="d-flex flex-row align-items-center">
                      <small>{'<'} $0.0001 </small>
                      <i className="ri-checkbox-blank-circle-fill text-muted fs-10 mx-2"></i>
                      <small>{'<'} $0.0001</small>
                    </div>
                  </div>
                </DropdownItem>
            */}{' '}
          </DropdownMenu>
        </UncontrolledDropdown>
      </div>
    </Col>
  );
};

export default NetworkDropdown;
