import React, { useEffect, useRef, useState } from 'react';
import {
  Col,
  Row,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Button,
  TabPane,
  TabContent,
  Spinner,
  Container,
} from 'reactstrap';
import PerformanceChart from './components/PerformanceChart';
import ActivesTable from './components/ActivesTable';
import Nfts from '../DashboardNFT/Nfts';
import HistorialTable from '../DashboardTransactions/HistorialTable';

import eth from '../../assets/images/svg/crypto-icons/eth.svg';
import btc from '../../assets/images/svg/crypto-icons/btc.svg';
import arb from '../../assets/images/svg/crypto-icons/ankr.svg';
import pol from '../../assets/images/svg/crypto-icons/poly.svg';
import gnosis from '../../assets/images/svg/crypto-icons/gno.svg';

import { fetchAssets } from '../../slices/transactions/thunk';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { capitalizeFirstLetter } from '../../utils/utils';
import QrModal from '../../Components/Modals/QrModal';
import AddressWithDropdown from '../../Components/Address/AddressWithDropdown';
import { handleSaveInCookiesAndGlobalState } from '../../helpers/cookies_helper';
import { setAddressName } from '../../slices/addressName/reducer';

const DashboardInfo = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { address, type } = useParams();
  const previousAddress = usePrevious(address);

  const [customActiveTab, setCustomActiveTab] = useState('1');

  const [addressTitle, setAddressTitle] = useState('');

  const [isUnsupported, setIsUnsupported] = useState(false);

  const [addressForSearch, setAddressForSearch] = useState('');

  const [historyData, setHistoryData] = useState([]);

  const [assetsData, setAssetsData] = useState([]);
  const [loadingAssets, setLoadingAssets] = useState(false);

  const [loading, setLoading] = useState(false);

  const [showQrModal, setShowQrModal] = useState(false);

  const { fetchData } = useSelector((state) => state.fetchData);

  function usePrevious(value) {
    const ref = useRef();
    useEffect(() => {
      ref.current = value;
    }, [value]);
    return ref.current;
  }

  useEffect(() => {
    if (fetchData && fetchData.performance.unsupported) {
      setIsUnsupported(true);
    } else {
      setIsUnsupported(false);
    }
  }, [fetchData]);

  useEffect(() => {
    if (!isUnsupported) {
      handleSaveInCookiesAndGlobalState(
        address,
        isUnsupported,
        dispatch,
        setAddressName,
      );
    }
  }),
    [address, isUnsupported];

  useEffect(() => {
    if (address && previousAddress !== address && !type) {
      navigate(`/address/${address}`);
    }
  }, [address, previousAddress, navigate, type]);

  const toggleQrModal = () => {
    setShowQrModal(!showQrModal);
  };

  const fetchDataAssets = () => {
    setLoadingAssets(true);

    dispatch(fetchAssets(addressForSearch))
      .unwrap()
      .then((response) => {
        if (response.unsupported == true) {
          setIsUnsupported(true);
          setLoadingAssets(false);
        } else {
          setIsUnsupported(false);
        }
        setAssetsData(response);
        setLoadingAssets(false);
      })
      .catch((error) => {
        console.error('Error fetching performance data:', error);
        setLoadingAssets(false);
      });
  };

  useEffect(() => {
    if (addressForSearch) {
      fetchDataAssets();
    }
  }, [addressForSearch, type, dispatch, isUnsupported]);

  useEffect(() => {
    if (address) {
      setIsUnsupported(false);
      setAddressForSearch(address);
      setAddressTitle(address);
    }
  }, [address, location]);

  useEffect(() => {
    if (type) {
      setCustomActiveTab(
        type === 'nfts' ? '2' : type === 'history' ? '3' : '1',
      );
    }
  }, [type]);

  const renderDropdownMenu = () => {
    return (
      <Col xxl={6} className="d-flex justify-content-end align-items-center">
        <div className="d-flex justify-content-end align-items-center">
          <UncontrolledDropdown className="card-header-dropdown ">
            <DropdownToggle
              tag="a"
              className="btn btn-sm p-1 btn-primary d-flex align-items-center"
              role="button"
            >
              <span className="ms-2 d-flex align-items-center">
                {' '}
                <i className="ri-function-line text-white fs-4 me-2"></i>
                All Networks
              </span>
              <i className="mdi mdi-chevron-down ms-2 fs-5"></i>
            </DropdownToggle>
            <DropdownMenu className="dropdown-menu-end mt-2 ">
              <DropdownItem className="d-flex align-items-center">
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
              </DropdownItem>
              <DropdownItem className="d-flex align-items-center">
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
                    <small>$8.6k </small>{' '}
                    <i className="ri-checkbox-blank-circle-fill text-muted fs-10 mx-2"></i>
                    <small>$12.7k </small>
                  </div>
                </div>
              </DropdownItem>
              <DropdownItem className="d-flex align-items-center">
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
                    <small>$434.44k </small>
                    <i className="ri-checkbox-blank-circle-fill text-muted fs-10 mx-2"></i>
                    <small>$0.352901k </small>
                  </div>
                </div>
              </DropdownItem>
              <DropdownItem className="d-flex align-items-center">
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
            </DropdownMenu>
          </UncontrolledDropdown>
        </div>
      </Col>
    );
  };

  document.title = `${type ? capitalizeFirstLetter(type) : 'Dashboard'} ${addressTitle ? '- ' + addressTitle : ''}`;

  return (
    <React.Fragment>
      <div className="page-content">
        <QrModal
          showQrModal={showQrModal}
          toggleQrModal={toggleQrModal}
          addressTitle={addressTitle}
        />

        <>
          {/* <AddressWithDropdown /> */}
          {loading ? (
            <div
              className="d-flex d-none justify-content-start align-items-center"
              style={{ height: '13vh' }}
            >
              <Spinner style={{ width: '2rem', height: '2rem' }} />
            </div>
          ) : (
            <Row className="d-flex justify-content-center jusitfy-content-between align-items-center border-2">
              <Col
                xxl={9}
                lg={9}
                md={9}
                sm={9}
                xs={9}
                className="d-flex flex-column"
                order="1"
              >
                {/* <div className="d-flex flex-row">
                    <h4>{formatIdTransaction(addressTitle, 6, 8)}</h4>
                    <UncontrolledDropdown className="card-header-dropdown">
                      <DropdownToggle
                        tag="a"
                        className="text-reset"
                        role="button"
                      >
                        <i className="mdi mdi-chevron-down ms-2 fs-5"></i>
                      </DropdownToggle>
                      <DropdownMenu className="dropdown-menu-end ms-3">
                        <DropdownItem
                          className="d-flex align-items-center"
                          onClick={toggleQrModal}
                        >
                          {' '}
                          <i className="ri-qr-code-line fs-2 me-2"></i>
                          <span className="fw-semibold">Show QR code</span>
                        </DropdownItem>
                        <DropdownItem
                          className="d-flex align-items-center"
                          onClick={(e) => handleCopy(e, addressTitle)}
                        >
                          {isCopied ? (
                            <i className="ri-check-line fs-2 me-2 "></i>
                          ) : (
                            <i className="ri-file-copy-line fs-2 me-2"></i>
                          )}
                          <span className="fw-semibold">Copy direction</span>
                        </DropdownItem>
                      </DropdownMenu>
                    </UncontrolledDropdown>
                  </div> */}
                <div className="d-flex flex-row mt-3">
                  {/* <h1 className="fw-semibold">{title}</h1> */}
                  {isUnsupported && (
                    <div className="mt-5  ">
                      <h1 className="fw-semibold text-danger">
                        Unsupported Address
                      </h1>
                      <h5 className="text-primary">
                        Contact our support team{' '}
                      </h5>
                    </div>
                  )}
                  {/* <UncontrolledDropdown className="card-header-dropdown">
                      <DropdownToggle
                        tag="a"
                        className="text-reset "
                        role="button"
                      >
                        <i className="ri-more-fill ms-2 fs-5 btn btn-light px-1 py-0 ms-3"></i>
                      </DropdownToggle>
                      <DropdownMenu className="dropdown-menu-end ms-3">
                        <DropdownItem className="d-flex align-items-center">
                          <span className="fw-semibold">
                            Include NFTs in Totals
                            <input
                              type="checkbox"
                              className="form-check-input ms-2"
                            />
                          </span>
                        </DropdownItem>
                      </DropdownMenu>
                    </UncontrolledDropdown> */}
                </div>
                {/* <h5
                    className={`mt-0 text-${
                      subtitle[0] == '+' ? 'success' : 'danger'
                    }`}
                  >
                    {subtitle}
                  </h5>{' '} */}
              </Col>
              {/* <Col
                xxl={3}
                lg={3}
                md={3}
                sm={12}
                xs={12}
                className="d-flex justify-content-center mb-3"
                order={{
                  sm: 'last',
                  xs: 'last',
                  md: '2',
                  lg: '2',
                  xxl: '2',
                }}
              >
                <Button className="rounded-circle bg-transparent border-1 border-dark btn btn-sm">
                      <i className="ri-share-forward-fill text-dark fs-4 p-1"></i>
                    </Button>
                    <Button className="rounded-circle bg-transparent border-1 mx-3 border-dark btn btn-sm">
                      <i className="ri-send-plane-fill text-dark fs-4 p-1"></i>
                    </Button>
                    <Button color="primary" className="btn btn-sm">
                      Add wallet
                    </Button>
              </Col> */}
            </Row>
          )}
          <Row className="d-flex justify-content-center align-items-center mb-3 mt-3 ">
            {' '}
            {!isUnsupported ? (
              <Col className="col-12 ">
                <div
                  className=" w-100 top-0 d-flex justify-content-between position-sticky align-items-center  "
                  style={{
                    zIndex: 5,
                    backgroundColor: '#16161a',
                  }}
                >
                  {/* <Col xxl={6} className="">
                      <Nav
                        tabs
                        className="  nav nav-tabs nav-tabs-custom nav-primary nav-justified mb-3"
                      >
                        <NavItem>
                          <NavLink
                            style={{
                              cursor: 'pointer',
                              paddingTop: '.7rem',
                              paddingBottom: '.7rem',
                              fontWeight: 'bold',
                            }}
                            className={classnames({
                              active: customActiveTab === '1',
                            })}
                            onClick={() => {
                              handleNavLinkClick('tokens', '1');
                            }}
                          >
                            Tokens
                          </NavLink>
                        </NavItem>
                        <NavItem>
                          <NavLink
                            style={{
                              cursor: 'pointer',
                              paddingTop: '.7rem',
                              paddingBottom: '.7rem',
                              fontWeight: 'bold',
                            }}
                            className={classnames({
                              active: customActiveTab === '2',
                            })}
                            onClick={() => {
                              handleNavLinkClick('nfts', '2');
                            }}
                          >
                            NFTs
                          </NavLink>
                        </NavItem>
                        <NavItem>
                          <NavLink
                            style={{
                              cursor: 'pointer',
                              paddingTop: '.7rem',
                              paddingBottom: '.7rem',
                              fontWeight: 'bold',
                            }}
                            className={classnames({
                              active: customActiveTab === '3',
                            })}
                            onClick={() => {
                              handleNavLinkClick('history', '3');
                            }}
                          >
                            History
                          </NavLink>
                        </NavItem>
                      </Nav>
                    </Col> */}

                  {/* Dropdown Menu  here  renderDropdownMenu()*/}
                </div>

                <div className="d-flex">
                  <div className="flex-grow-1">
                    <Col xxl={12} className="mb-4">
                      <div className="d-flex justify-content-start">
                        <Col
                          className="col-12"
                          style={{
                            marginTop: '-2rem',
                          }}
                        >
                          <div className={loading ? 'pt-3' : ''}>
                            <AddressWithDropdown />
                          </div>
                          <PerformanceChart
                            loading={loading}
                            setLoading={setLoading}
                            setIsUnsupported={setIsUnsupported}
                            address={addressForSearch}
                          />
                        </Col>
                      </div>
                    </Col>

                    <Col className={`${loading ? 'mt-n2' : ''}`} xxl={12}>
                      <ActivesTable loading={loadingAssets} data={assetsData} />
                    </Col>
                    <Col xxl={12} className="mt-3 d-flex flex-column">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <h2 className="ms-1 mt-2">NFTs</h2>
                        <Button
                          onClick={() => navigate(`/address/${address}/nfts`)}
                          className="btn btn-sm btn-soft-primary rounded"
                        >
                          <span className="p-1">See more NFTs</span>
                        </Button>
                      </div>
                      <div className="border border-2 rounded p-3 py-0 w-100 d-flex justify-content-center overflow-hidden">
                        <Nfts address={addressForSearch} />
                      </div>
                    </Col>

                    <Col xxl={12} className="mt-3">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <h2 className="ms-1 mt-2">Transactions</h2>
                        <Button
                          onClick={() =>
                            navigate(`/address/${address}/history`)
                          }
                          className="btn btn-sm btn-soft-primary rounded"
                        >
                          <span className="p-1">See more activity</span>
                        </Button>
                      </div>
                      <div className="border border-2 rounded p-3 ">
                        <HistorialTable
                          data={historyData}
                          setData={setHistoryData}
                          activeTab={customActiveTab}
                          address={addressForSearch}
                        />
                      </div>
                    </Col>
                  </div>
                </div>
              </Col>
            ) : (
              <div style={{ minHeight: '100vh' }}></div>
            )}
          </Row>
        </>
      </div>
    </React.Fragment>
  );
};

export default DashboardInfo;
