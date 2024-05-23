import React from 'react';
import eth from '../../assets/images/svg/crypto-icons/eth.svg';
import pol from '../../assets/images/svg/crypto-icons/poly.svg';
// import btc from '../../assets/images/svg/crypto-icons/btc.svg';
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
            className="btn btn-sm p-1 btn-soft-primary d-flex align-items-center"
            role="button"
          >
            <span className="ms-2 d-flex align-items-center">
              <img
                src={networkIcons[networkType]}
                alt={networkType}
                width={30}
                height={30}
                className="me-2"
              />
              {capitalizeFirstLetter(networkType)}
            </span>
            <i className="mdi mdi-chevron-down ms-2 fs-5"></i>
          </DropdownToggle>
          <DropdownMenu className="dropdown-menu-end mt-2 ">
            {/* <DropdownItem className="d-flex align-items-center">
                  {' '}
                  <i className="ri-function-line text-primary fs-2 me-2"></i>
                  <div className="d-flex flex-column">
                    <span className="fw-semibold ">All Networks</span>
                    <div className="d-flex flex-row align-items-center">
                      <small>$9k </small>{' '}
                      <i className="ri-checkbox-blank-circle-fill text-muted fs-10 mx-2"></i>
                      <small>$12.7k </small>
                    </div>
                  </div>
                </DropdownItem> */}
            <DropdownItem
              className="d-flex align-items-center"
              onClick={() => handleChangeNetwork('ethereum')}
            >
              {' '}
              <img
                src={eth}
                alt="btc"
                className="ms-n1 me-2"
                width={30}
                height={30}
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
              className="d-flex align-items-center"
              onClick={() => handleChangeNetwork('polygon')}
            >
              {' '}
              <img
                src={pol}
                alt="btc"
                className="ms-n1 me-2"
                width={30}
                height={30}
              />
              <div className="d-flex flex-column">
                <span className="fw-semibold">Polygon</span>
                <div className="d-flex flex-row align-items-center">
                  {/* <small>$434.44k </small>
                      <i className="ri-checkbox-blank-circle-fill text-muted fs-10 mx-2"></i>
                      <small>$0.352901k </small> */}
                </div>
              </div>
            </DropdownItem>
            {/* <DropdownItem className="d-flex align-items-center">
                  {' '}
                  <img
                    src={btc}
                    alt="btc"
                    className="ms-n1 me-2"
                    width={30}
                    height={30}
                  />
                  <div className="d-flex flex-column">
                    <span className="fw-semibold">BNB Chain</span>
                    <div className="d-flex flex-row align-items-center">
                      <small>$0.020028</small>
                      <i className="ri-checkbox-blank-circle-fill text-muted fs-10 mx-2"></i>
                      <small></small>
                    </div>
                  </div>
                </DropdownItem>
                <DropdownItem className="d-flex align-items-center">
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
