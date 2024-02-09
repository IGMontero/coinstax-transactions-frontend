import React, { useEffect, useState } from 'react';
import {
  Container,
  Col,
  Row,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Button,
  TabPane,
  TabContent,
  Nav,
  NavItem,
  NavLink,
  InputGroup,
  Input,
  Spinner,
} from 'reactstrap';
import classnames from 'classnames';
import PerformanceChart from './components/PerformanceChart';
import AcitvesTable from './components/ActivesTable';
import HistorialTable from './components/HistorialTable';
import Nfts from './components/Nfts';
import eth from '../../assets/images/svg/crypto-icons/eth.svg';
import btc from '../../assets/images/svg/crypto-icons/btc.svg';
import arb from '../../assets/images/svg/crypto-icons/ankr.svg';
import pol from '../../assets/images/svg/crypto-icons/poly.svg';
import gnosis from '../../assets/images/svg/crypto-icons/gno.svg';

import { fetchAssets, fetchNFTS } from '../../slices/transactions/thunk';
import DashboardHome from '../DashboardHome/DashboardHome';
import { useDispatch } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { formatIdTransaction } from '../../utils/utils';
import QrModal from './modals/QrModal';
const DashboardInfo = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { address, type } = useParams();

  const [customActiveTab, setCustomActiveTab] = useState('1');

  const [addressTitle, setAddressTitle] = useState('');

  const [isCopied, setIsCopied] = useState(false);

  const [searchInput, setSearchInput] = useState('');
  const [addressForSearch, setAddressForSearch] = useState('');

  const [assetsData, setAssetsData] = useState([]);

  const [loading, setLoading] = useState(false);

  const [series, setSeries] = useState([]);

  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');

  const [showQrModal, setShowQrModal] = useState(false);

  const toggleCustom = (tab) => {
    if (customActiveTab !== tab) {
      setCustomActiveTab(tab);
    }
  };

  const toggleQrModal = () => {
    setShowQrModal(!showQrModal);
  };

  const fetchDataAssets = () => {
    dispatch(fetchAssets(addressForSearch))
      .unwrap()
      .then((response) => {
        setAssetsData(response);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching performance data:', error);
        setLoading(false);
      });
  };

  const handleSearchClick = () => {
    setAssetsData([]);
    setSeries([]);
    setTitle('');
    setSubtitle('');
    setAddressTitle('');
    setCustomActiveTab('1');

    setAddressForSearch(searchInput);
    setAddressTitle(searchInput);
    navigate(`/address/${searchInput}/tokens`);
    setLoading(true);
  };

  useEffect(() => {
    if (addressForSearch) {
      fetchDataAssets();
    }
  }, [addressForSearch, dispatch]);

  useEffect(() => {
    if (series.length > 0 && series[0].data.length > 0) {
      const firstPointValue = series[0].data[0].y;
      setTitle(`$${firstPointValue.toLocaleString()}`);
      const lastPointValue = series[0].data[series[0].data.length - 1].y;
      const change = firstPointValue - lastPointValue;
      let changePercentage = (change / firstPointValue) * 100;

      if (isNaN(changePercentage)) {
        changePercentage = 0;
      }
      const formattedChange = isNaN(change) ? 0 : change.toLocaleString();
      const sign = changePercentage >= 0 ? '+' : '';
      setSubtitle(
        `${sign}${changePercentage.toFixed(2)}% ($${formattedChange})`,
      );

      console.log(subtitle);
    }
  }, [series, title, subtitle]);

  const handleCopy = async (e, text) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);
      setTimeout(() => {
        setIsCopied(null);
      }, 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };
  useEffect(() => {
    if (type) {
      setCustomActiveTab(
        type === 'nfts' ? '2' : type === 'history' ? '3' : '1',
      );
    }
    if (address) {
      setAddressForSearch(address);
      setAddressTitle(address);
    }
  }, [type, address]);

  const handleNavLinkClick = (route, toggle) => {
    setCustomActiveTab(toggle);
    navigate(`/address/${addressForSearch}/${route}`);
  };

  return (
    <React.Fragment>
      <QrModal
        showQrModal={showQrModal}
        toggleQrModal={toggleQrModal}
        addressTitle={addressTitle}
      />
      <Container fluid>
        <div className="page-content pb-5">
          <Row className="pb-3 mt-n4 d-flex justify-content-center ">
            <Col lg={8}>
              <InputGroup className="mb-5">
                <Input
                  className="form-control py-2 rounded"
                  placeholder="Assets, wallet, domain, or identify"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                />
                <Button
                  disabled={!searchInput || loading}
                  color="primary"
                  onClick={handleSearchClick}
                >
                  Search
                </Button>
              </InputGroup>
            </Col>
          </Row>
          {!addressForSearch ? (
            <DashboardHome />
          ) : (
            <>
              {loading ? (
                <div
                  className="d-flex justify-content-start align-items-center"
                  style={{ height: '10vh' }}
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
                    <div className="d-flex flex-row">
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
                    </div>
                    <div className="d-flex flex-row ">
                      <h1 className="fw-semibold">{title}</h1>
                      <UncontrolledDropdown className="card-header-dropdown">
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
                      </UncontrolledDropdown>
                    </div>
                    <h5
                      className={`mt-0 text-${
                        subtitle[0] == '+' ? 'success' : 'danger'
                      }`}
                    >
                      {subtitle}
                    </h5>{' '}
                  </Col>
                  <Col
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
                    {/* <Button className="rounded-circle bg-transparent border-1 border-dark btn btn-sm">
                      <i className="ri-share-forward-fill text-dark fs-4 p-1"></i>
                    </Button>
                    <Button className="rounded-circle bg-transparent border-1 mx-3 border-dark btn btn-sm">
                      <i className="ri-send-plane-fill text-dark fs-4 p-1"></i>
                    </Button>
                    <Button color="primary" className="btn btn-sm">
                      Add wallet
                    </Button> */}
                  </Col>
                </Row>
              )}
              <Row className="d-flex justify-content-center align-items-center mb-3 mt-3 ">
                {' '}
                <Col className="col-12 ">
                  <div
                    className=" w-100 ms-1 top-0 d-flex justify-content-between position-sticky align-items-center  "
                    style={{
                      zIndex: 5,
                      backgroundColor: '#1a1d21',
                      // backdropFilter: 'blur(5px)',
                    }}
                  >
                    <Col xxl={6} className="">
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
                    </Col>
                    {/* <Col
                      xxl={6}
                      className="d-flex justify-content-end align-items-center"
                    >
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
                                <span className="fw-semibold ">
                                  All Networks
                                </span>
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
                                <span className="fw-semibold">
                                  Gnosis Chain
                                </span>
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
                    </Col> */}
                  </div>
                  <TabContent
                    activeTab={customActiveTab}
                    className="text-muted"
                  >
                    <TabPane tabId="1" id="home1">
                      <div className="d-flex">
                        <div className="flex-grow-1 ms-2">
                          <Col
                            xxl={12}
                            className="mt-3 mb-3 d-flex flex-row justify-content-around"
                          >
                            <Col className="me-1 col-12">
                              <PerformanceChart
                                address={addressForSearch}
                                series={series}
                                setSeries={setSeries}
                                title={title}
                                subtitle={subtitle}
                              />
                            </Col>
                          </Col>
                          <Col xxl={12}>
                            <AcitvesTable data={assetsData} />
                          </Col>
                        </div>
                      </div>
                    </TabPane>

                    <TabPane tabId="2">
                      <div className="d-flex">
                        <div className="flex-grow-1 ms-2">
                          <Nfts
                            activeTab={customActiveTab}
                            address={addressForSearch}
                          />
                        </div>
                      </div>
                    </TabPane>

                    <TabPane tabId="3">
                      <div className="d-flex">
                        <div className="flex-grow-1 ms-2">
                          <HistorialTable
                            activeTab={customActiveTab}
                            address={addressForSearch}
                          />
                        </div>
                      </div>
                    </TabPane>
                  </TabContent>
                </Col>
              </Row>
            </>
          )}
        </div>
      </Container>
    </React.Fragment>
  );
};

export default DashboardInfo;
